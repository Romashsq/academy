import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getModuleData(moduleId: string, userId: string) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId, isPublished: true },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          durationMinutes: true,
          isFree: true,
          xpReward: true,
          order: true,
          progress: {
            where: { userId },
            select: { completed: true, completedAt: true },
          },
        },
      },
    },
  });

  return module;
}

interface Props {
  params: { moduleId: string };
}

export default async function ModulePage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const module = await getModuleData(params.moduleId, session.user.id);
  if (!module) notFound();

  const completedLessons = module.lessons.filter(
    (l) => l.progress[0]?.completed
  ).length;
  const totalLessons = module.lessons.length;
  const progressPercent =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const nextLesson = module.lessons.find((l) => !l.progress[0]?.completed);

  const totalXP = module.lessons.reduce((acc, l) => acc + l.xpReward, 0);
  const totalMinutes = module.lessons.reduce(
    (acc, l) => acc + l.durationMinutes,
    0
  );

  const moduleTitle = module.titleEn ?? module.title;
  const moduleDescription = module.descriptionEn ?? module.description;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        All courses
      </Link>

      {/* Module header */}
      <div className="flex items-start gap-5">
        <span className="text-5xl flex-shrink-0">{module.emoji}</span>
        <div className="flex-1">
          <h1 className="font-syne text-3xl font-bold text-white mb-2">
            {moduleTitle}
          </h1>
          <p className="text-gray-400 mb-4">{moduleDescription}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              {totalLessons} lessons
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              ~{Math.round(totalMinutes / 60) > 0
                ? `${Math.round(totalMinutes / 60)}h`
                : `${totalMinutes} min`}
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              {totalXP} XP total
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span className="text-emerald-400">
                {completedLessons} / {totalLessons} lessons
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* Continue button */}
      {nextLesson && (
        <Link href={`/lessons/${nextLesson.id}`}>
          <Button size="lg" className="w-full gap-2">
            {completedLessons === 0 ? "Start module" : "Continue"}
            <PlayCircle className="w-5 h-5" />
          </Button>
        </Link>
      )}
      {completedLessons === totalLessons && totalLessons > 0 && (
        <div className="flex items-center justify-center gap-3 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <span className="font-syne font-semibold text-emerald-400">
            Module complete! 🎉
          </span>
        </div>
      )}

      {/* Lesson list */}
      <Card className="overflow-hidden">
        <div className="divide-y divide-white/5">
          {module.lessons.map((lesson, index) => {
            const isDone = lesson.progress[0]?.completed ?? false;
            const lessonTitle = lesson.titleEn ?? lesson.title;
            const lessonDescription = lesson.descriptionEn ?? lesson.description;

            return (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="flex items-start gap-4 px-5 py-4 hover:bg-white/5 transition-colors group"
              >
                {/* Status icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-700 group-hover:border-emerald-500/50 transition-colors flex items-center justify-center">
                      <span className="text-xs text-gray-600 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className={`font-medium text-sm ${
                        isDone
                          ? "text-gray-400 line-through"
                          : "text-white group-hover:text-emerald-400 transition-colors"
                      }`}
                    >
                      {lessonTitle}
                    </span>
                    {lesson.isFree && !isDone && (
                      <Badge variant="free" className="text-[10px]">
                        Free
                      </Badge>
                    )}
                    {!lesson.isFree && !isDone && (
                      <Lock className="w-3 h-3 text-gray-600" />
                    )}
                  </div>
                  {lessonDescription && (
                    <p className="text-gray-500 text-xs line-clamp-1">
                      {lessonDescription}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                  <span className="text-gray-600">{lesson.durationMinutes} min</span>
                  <span className="text-emerald-700">+{lesson.xpReward} XP</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
