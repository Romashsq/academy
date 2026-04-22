import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const submitSchema = z.object({
  // max(50) — защита от DoS через огромный массив
  answers: z.array(z.number().int().min(0).max(999)).max(50),
});

// POST /api/quiz/[lessonId]/submit — проверить ответы и выдать XP
export async function POST(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const { answers } = parsed.data;
  const userId = session.user.id;

  // Получаем квиз с правильными ответами
  const quiz = await prisma.quiz.findUnique({
    where: { lessonId: params.lessonId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // Проверяем ответы
  const results = quiz.questions.map((q, i) => {
    const selected = answers[i] ?? -1;
    const correct = selected === q.correctIndex;
    return {
      correct,
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      explanation: q.explanation ?? null,
    };
  });

  const score = results.filter((r) => r.correct).length;
  const total = quiz.questions.length;
  const rawXp = total > 0 ? Math.round(quiz.xpReward * score / total) : 0;

  // Найти предыдущий лучший результат
  const bestPrevious = await prisma.quizAttempt.findFirst({
    where: { userId, lessonId: params.lessonId },
    orderBy: { score: "desc" },
    select: { score: true, xpEarned: true, attemptNumber: true },
  });

  const attemptNumber = (bestPrevious?.attemptNumber ?? 0) + 1;

  // XP начисляем только если улучшился результат (или первая попытка)
  const prevBestScore = bestPrevious?.score ?? -1;
  const xpEarned = score > prevBestScore ? rawXp - (bestPrevious?.xpEarned ?? 0) : 0;
  const isNewBest = score > prevBestScore;

  await prisma.$transaction([
    prisma.quizAttempt.create({
      data: { userId, lessonId: params.lessonId, score, total, xpEarned: rawXp, attemptNumber },
    }),
    ...(xpEarned > 0
      ? [prisma.user.update({ where: { id: userId }, data: { totalXP: { increment: xpEarned } } })]
      : []),
  ]);

  return NextResponse.json({ score, total, xpEarned, results, isNewBest, attemptNumber });
}
