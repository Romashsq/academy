import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SearchInput } from "./search-input";
import { SearchResults } from "./search-results";
import { SearchTitle } from "./search-title";

// ============================================
// ТИПЫ
// ============================================

interface SearchPageProps {
  searchParams: { q?: string };
}

// ============================================
// ПОИСК
// ============================================

async function searchData(q: string, userId: string) {
  if (q.length < 2) return { lessons: [], modules: [] };

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
        titleEn: true,
        description: true,
        descriptionEn: true,
        durationMinutes: true,
        xpReward: true,
        isFree: true,
        module: { select: { id: true, title: true, titleEn: true, emoji: true } },
        progress: {
          where: { userId },
          select: { completed: true },
        },
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
        titleEn: true,
        description: true,
        descriptionEn: true,
        emoji: true,
        _count: { select: { lessons: { where: { isPublished: true } } } },
      },
      take: 5,
      orderBy: { order: "asc" },
    }),
  ]);

  return { lessons, modules };
}

// ============================================
// PAGE
// ============================================

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await auth();
  if (!session) redirect("/login");

  const q = searchParams.q?.trim() ?? "";
  const { lessons, modules } = await searchData(q, session.user.id);

  return (
    <div className="max-w-3xl mx-auto">
      <SearchTitle />
      <SearchInput />
      <SearchResults
        q={q}
        lessons={lessons.map((l) => ({
          id: l.id,
          title: l.titleEn ?? l.title,
          description: l.descriptionEn ?? l.description,
          durationMinutes: l.durationMinutes,
          xpReward: l.xpReward,
          isFree: l.isFree,
          isCompleted: l.progress[0]?.completed ?? false,
          moduleEmoji: l.module.emoji,
          moduleTitle: l.module.titleEn ?? l.module.title,
        }))}
        modules={modules.map((m) => ({
          id: m.id,
          emoji: m.emoji,
          title: m.titleEn ?? m.title,
          description: m.descriptionEn ?? m.description,
          lessonsCount: m._count.lessons,
        }))}
      />
    </div>
  );
}
