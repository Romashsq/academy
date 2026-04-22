import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/search?q=...
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const q = raw.slice(0, 100); // max 100 символов
  if (q.length < 2) {
    return NextResponse.json({ lessons: [], modules: [] });
  }

  const [lessons, modules] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        durationMinutes: true,
        xpReward: true,
        isFree: true,
        module: { select: { id: true, title: true, emoji: true } },
      },
      take: 10,
      orderBy: { title: "asc" },
    }),
    prisma.module.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        emoji: true,
        _count: { select: { lessons: true } },
      },
      take: 5,
      orderBy: { order: "asc" },
    }),
  ]);

  return NextResponse.json({ lessons, modules });
}
