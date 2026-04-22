import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CoursesClient } from "./courses-client";

export const dynamic = "force-dynamic";

// ============================================
// DATA FETCHING
// ============================================

async function getCoursesData(userId: string) {
  return prisma.module.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      emoji: true,
      title: true,
      titleEn: true,
      description: true,
      descriptionEn: true,
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
          order: true,
          progress: {
            where: { userId },
            select: { completed: true },
          },
        },
      },
    },
  });
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function CoursesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const modules = await getCoursesData(session.user.id);

  const moduleItems = modules.map((mod) => {
    const completedLessons = mod.lessons.filter((l) => l.progress[0]?.completed).length;
    const totalLessons = mod.lessons.length;
    return {
      id: mod.id,
      emoji: mod.emoji,
      title: mod.title,
      titleEn: mod.titleEn,
      description: mod.description,
      descriptionEn: mod.descriptionEn,
      completedLessons,
      totalLessons,
      progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      lessons: mod.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        titleEn: l.titleEn,
        durationMinutes: l.durationMinutes,
        isFree: l.isFree,
        xpReward: l.xpReward,
        order: l.order,
        isCompleted: l.progress[0]?.completed ?? false,
      })),
    };
  });

  return <CoursesClient modules={moduleItems} />;
}
