import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { LessonViewer } from "./lesson-viewer";

// ============================================
// SEO METADATA
// ============================================

export async function generateMetadata(
  { params }: { params: { lessonId: string } }
): Promise<Metadata> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId, isPublished: true },
    select: {
      title: true,
      titleEn: true,
      description: true,
      descriptionEn: true,
      module: { select: { title: true, titleEn: true, emoji: true } },
    },
  });

  if (!lesson) return { title: "Lesson — VibeCode Academy" };

  const title = lesson.titleEn ?? lesson.title;
  const description = lesson.descriptionEn ?? lesson.description;
  const moduleTitle = lesson.module.titleEn ?? lesson.module.title;

  return {
    title: `${title} — VibeCode Academy`,
    description: description || `${lesson.module.emoji} ${moduleTitle} · VibeCode Academy`,
    openGraph: {
      title: `${title} — VibeCode Academy`,
      description: description || `Learn ${title} in the AI development course`,
      type: "article",
    },
  };
}

// ============================================
// DATA FETCHING
// ============================================

async function getLessonData(lessonId: string, userId: string) {
  // Все запросы параллельно + модули сразу для вычисления nextModule без дополнительного запроса
  const [lesson, quiz, quizAttempt, practiceTasks, allModules] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id: lessonId, isPublished: true },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            titleEn: true,
            emoji: true,
            order: true,
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              select: { id: true, title: true, titleEn: true, order: true },
            },
          },
        },
        progress: {
          where: { userId },
          select: { completed: true, completedAt: true, timeSpent: true },
        },
      },
    }),
    prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: { id: true, text: true, options: true, order: true },
        },
      },
    }),
    prisma.quizAttempt.findFirst({
      where: { userId, lessonId },
      orderBy: { score: "desc" },
      select: { score: true, total: true, xpEarned: true },
    }),
    prisma.practiceTask.findMany({
      where: { lessonId },
      orderBy: { order: "asc" },
      include: {
        submissions: {
          where: { userId, status: "active" },
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
      },
    }),
    // Загружаем только id и order всех модулей — дёшево, зато не нужен отдельный последовательный запрос
    prisma.module.findMany({
      where: { isPublished: true },
      select: { id: true, order: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return { lesson, quiz, quizAttempt, practiceTasks, allModules };
}

// ============================================
// PAGE COMPONENT
// ============================================

interface Props {
  params: { lessonId: string };
}

export default async function LessonPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const { lesson, quiz, quizAttempt, practiceTasks, allModules } = await getLessonData(
    params.lessonId,
    session.user.id
  );
  if (!lesson) notFound();

  const progress = lesson.progress[0] ?? null;

  // Найти следующий урок
  const currentIndex = lesson.module.lessons.findIndex(
    (l) => l.id === lesson.id
  );
  const nextLesson = lesson.module.lessons[currentIndex + 1] ?? null;

  // Если это последний урок модуля — найти следующий модуль из уже загруженного списка (без доп. запроса)
  const nextModule = !nextLesson
    ? (allModules.find((m) => m.order === lesson.module.order + 1) ?? null)
    : null;

  // Парсим options из JSON-строки для каждого вопроса
  const quizData = quiz
    ? {
        id: quiz.id,
        xpReward: quiz.xpReward,
        questions: quiz.questions.map((q) => ({
          ...q,
          options: JSON.parse(q.options) as string[],
        })),
      }
    : null;

  // Сериализуем practiceTasks (даты → строки, type → union)
  const practiceTasksData = practiceTasks.map((task) => ({
    ...task,
    submissions: task.submissions.map((s) => ({
      ...s,
      type: s.type as "file" | "screenshot" | "link",
      submittedAt: s.submittedAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
  }));

  return (
    <LessonViewer
      lesson={lesson}
      progress={progress}
      nextLesson={nextLesson}
      nextModuleId={nextModule?.id ?? null}
      userId={session.user.id}
      quiz={quizData}
      quizAttempt={quizAttempt ?? null}
      practiceTasks={practiceTasksData}
    />
  );
}
