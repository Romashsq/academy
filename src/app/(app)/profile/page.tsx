import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { calculateLevel } from "@/lib/utils";
import { ProfileClient } from "./profile-client";

// ============================================
// DATA FETCHING
// ============================================

async function getProfileData(userId: string) {
  const [user, achievements, recentLessons, allAchievements] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          totalXP: true,
          currentStreak: true,
          createdAt: true,
          role: true,
        },
      }),

      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { earnedAt: "desc" },
      }),

      prisma.lessonProgress.findMany({
        where: { userId, completed: true },
        orderBy: { completedAt: "desc" },
        take: 10,
        include: {
          lesson: {
            select: {
              title: true,
              titleEn: true,
              xpReward: true,
              durationMinutes: true,
              module: { select: { emoji: true, title: true, titleEn: true } },
            },
          },
        },
      }),

      prisma.achievement.findMany({ orderBy: { xpReward: "desc" } }),
    ]);

  return { user, achievements, recentLessons, allAchievements };
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { user, achievements, recentLessons, allAchievements } =
    await getProfileData(session.user.id);

  if (!user) redirect("/login");

  const earnedIds = new Set(achievements.map((ua) => ua.achievementId));
  const { level, title: levelTitle, nextLevelXP, progress: xpProgress } =
    calculateLevel(user.totalXP);

  const totalMinutesLearned = recentLessons.reduce(
    (acc, l) => acc + (l.lesson.durationMinutes ?? 0),
    0
  );

  return (
    <ProfileClient
      name={user.name}
      email={user.email}
      role={user.role}
      totalXP={user.totalXP}
      currentStreak={user.currentStreak}
      completedLessonsCount={recentLessons.length}
      totalMinutesLearned={totalMinutesLearned}
      level={level}
      levelTitle={levelTitle}
      nextLevelXP={nextLevelXP}
      xpProgress={xpProgress}
      createdAt={user.createdAt.toISOString()}
      achievements={allAchievements.map((a) => ({
        id: a.id,
        emoji: a.emoji,
        title: a.title,
        description: a.description,
        xpReward: a.xpReward,
        isEarned: earnedIds.has(a.id),
      }))}
      recentLessons={recentLessons.map((p) => ({
        id: p.id,
        moduleEmoji: p.lesson.module.emoji,
        lessonTitle: p.lesson.titleEn ?? p.lesson.title,
        moduleTitle: p.lesson.module.titleEn ?? p.lesson.module.title,
        xpReward: p.lesson.xpReward,
        completedAt: p.completedAt ? p.completedAt.toISOString() : null,
      }))}
    />
  );
}
