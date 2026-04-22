import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { calculateLevel } from "@/lib/utils";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

// ============================================
// SERVER COMPONENT — загрузка данных
// ============================================

async function getDashboardData(userId: string) {
  const [user, modules, recentProgress, achievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        totalXP: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveAt: true,
      },
    }),

    prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        emoji: true,
        title: true,
        titleEn: true,
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            titleEn: true,
            durationMinutes: true,
            isFree: true,
            xpReward: true,
            progress: {
              where: { userId },
              select: { completed: true },
            },
          },
        },
      },
    }),

    prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: {
        lesson: {
          select: {
            title: true,
            titleEn: true,
            xpReward: true,
            module: { select: { emoji: true } },
          },
        },
      },
    }),

    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: "desc" },
      take: 3,
    }),
  ]);

  return { user, modules, recentProgress, achievements };
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { user, modules, recentProgress, achievements } =
    await getDashboardData(session.user.id);

  if (!user) redirect("/login");

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) =>
      acc + m.lessons.filter((l) => l.progress[0]?.completed).length,
    0
  );
  const overallProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const { level, title: levelTitle, nextLevelXP, progress: xpProgress } =
    calculateLevel(user.totalXP);

  // Найти следующий незавершённый урок
  let nextLesson: { lessonId: string; moduleEmoji: string; lessonTitle: string; lessonTitleEn?: string | null; moduleTitle: string; moduleTitleEn?: string | null; durationMinutes?: number; xpReward?: number } | null = null;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!lesson.progress[0]?.completed) {
        nextLesson = {
          lessonId: lesson.id,
          moduleEmoji: mod.emoji,
          lessonTitle: lesson.title,
          lessonTitleEn: lesson.titleEn,
          moduleTitle: mod.title,
          moduleTitleEn: mod.titleEn,
          durationMinutes: lesson.durationMinutes,
          xpReward: lesson.xpReward,
        };
        break;
      }
    }
    if (nextLesson) break;
  }

  const moduleItems = modules.map((mod) => {
    const modCompleted = mod.lessons.filter((l) => l.progress[0]?.completed).length;
    const modTotal = mod.lessons.length;
    return {
      id: mod.id,
      emoji: mod.emoji,
      title: mod.title,
      titleEn: mod.titleEn,
      completedLessons: modCompleted,
      totalLessons: modTotal,
      progress: modTotal > 0 ? (modCompleted / modTotal) * 100 : 0,
    };
  });

  return (
    <DashboardClient
      userName={user.name}
      totalXP={user.totalXP}
      currentStreak={user.currentStreak}
      longestStreak={user.longestStreak}
      completedLessons={completedLessons}
      totalLessons={totalLessons}
      overallProgress={overallProgress}
      level={level}
      levelTitle={levelTitle}
      nextLevelXP={nextLevelXP}
      xpProgress={xpProgress}
      modules={moduleItems}
      recentProgress={recentProgress.map((p) => ({
        id: p.id,
        moduleEmoji: p.lesson.module.emoji,
        lessonTitle: p.lesson.title,
        lessonTitleEn: p.lesson.titleEn,
        xpReward: p.lesson.xpReward,
      }))}
      achievements={achievements.map((ua) => ({
        id: ua.id,
        emoji: ua.achievement.emoji,
        title: ua.achievement.title,
        xpReward: ua.achievement.xpReward,
      }))}
      lastActiveAt={user.lastActiveAt ? user.lastActiveAt.toISOString() : null}
      nextLesson={nextLesson}
    />
  );
}
