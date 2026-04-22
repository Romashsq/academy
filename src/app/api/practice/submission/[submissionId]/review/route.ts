import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePracticeReview } from "@/lib/practice-review";

// POST /api/practice/submission/[submissionId]/review
// Запрашивает AI-ревью для сданного задания
export async function POST(
  req: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Проверяем что сабмит принадлежит этому пользователю
  const submission = await prisma.practiceSubmission.findFirst({
    where: { id: params.submissionId, userId: session.user.id, status: "active" },
    select: { id: true, aiReview: true, aiReviewAt: true },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  // Если ревью уже есть и было меньше 10 минут назад — возвращаем кэшированное
  if (submission.aiReview && submission.aiReviewAt) {
    const ageMs = Date.now() - new Date(submission.aiReviewAt).getTime();
    if (ageMs < 10 * 60 * 1000) {
      try {
        return NextResponse.json({ review: JSON.parse(submission.aiReview) });
      } catch {
        // Повреждённый JSON в кэше — генерируем заново
      }
    }
  }

  try {
    const review = await generatePracticeReview(params.submissionId);
    return NextResponse.json({ review });
  } catch (err) {
    console.error("AI review error:", err);
    return NextResponse.json({ error: "Review generation failed" }, { status: 500 });
  }
}
