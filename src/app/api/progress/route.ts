import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { GamificationService } from "@/lib/gamification";

// ============================================
// СХЕМА ВАЛИДАЦИИ
// ============================================

const progressSchema = z.object({
  lessonId: z.string().min(1, "lessonId обязателен"),
  timeSpent: z.number().int().min(0).max(86400), // max 24 часа
});

// ============================================
// POST /api/progress
// Отмечает урок как завершённый и начисляет XP
// ============================================

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = progressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { lessonId, timeSpent } = parsed.data;

    const result = await GamificationService.completeLesson(
      session.user.id,
      lessonId,
      timeSpent
    );

    return NextResponse.json({
      success: true,
      xpEarned: result.xpEarned,
      newAchievements: result.newAchievements,
      streakUpdated: result.streakUpdated,
      newStreak: result.newStreak,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      newLevelTitle: result.newLevelTitle,
    });
  } catch (error) {
    console.error("[PROGRESS_ERROR]", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/progress?lessonId=xxx
// Получить прогресс по уроку
// ============================================

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId required" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId: session.user.id, lessonId },
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("[PROGRESS_GET_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
