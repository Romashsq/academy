import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { calculateLevel, formatXP } from "@/lib/utils";
import type { Metadata } from "next";
import { PublicProfileView } from "./public-profile-view";

// ============================================
// METADATA
// ============================================

export async function generateMetadata(
  { params }: { params: { userId: string } }
): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { name: true, totalXP: true },
  });
  if (!user) return { title: "Profile not found — VibeCode Academy" };

  return {
    title: `${user.name ?? "Student"} — VibeCode Academy`,
    description: `${user.name ?? "Student"} is learning AI development on VibeCode Academy. Already earned ${formatXP(user.totalXP)} XP!`,
    openGraph: {
      title: `${user.name ?? "Student"} on VibeCode Academy`,
      description: `Learning vibe coding · ${formatXP(user.totalXP)} XP`,
      type: "profile",
    },
  };
}

// ============================================
// PAGE
// ============================================

export default async function PublicProfilePage(
  { params }: { params: { userId: string } }
) {
  const [user, achievements, lessonStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        totalXP: true,
        currentStreak: true,
        longestStreak: true,
        createdAt: true,
      },
    }),

    prisma.userAchievement.findMany({
      where: { userId: params.userId },
      include: { achievement: { select: { emoji: true, title: true, description: true } } },
      orderBy: { earnedAt: "desc" },
    }),

    prisma.lessonProgress.count({
      where: { userId: params.userId, completed: true },
    }),
  ]);

  if (!user) notFound();

  const { level, title: levelTitle, progress: xpProgress, nextLevelXP } = calculateLevel(user.totalXP);

  const LEVEL_COLORS: Record<number, string> = {
    1: "from-gray-500 to-gray-600",
    2: "from-blue-500 to-blue-700",
    3: "from-violet-500 to-violet-700",
    4: "from-orange-500 to-orange-700",
    5: "from-lime-400 to-lime-600",
  };
  const levelGradient = LEVEL_COLORS[level] ?? LEVEL_COLORS[1];

  return (
    <PublicProfileView
      userId={params.userId}
      name={user.name}
      totalXP={user.totalXP}
      currentStreak={user.currentStreak}
      createdAtISO={user.createdAt.toISOString()}
      level={level}
      levelTitle={levelTitle}
      xpProgress={xpProgress}
      nextLevelXP={nextLevelXP}
      levelGradient={levelGradient}
      lessonStats={lessonStats}
      achievements={achievements}
    />
  );
}
