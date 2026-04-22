"use client";

import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle, ChevronDown, ChevronUp, BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { useState } from "react";

// ============================================
// ТИПЫ
// ============================================

interface LessonItem {
  id: string;
  title: string;
  titleEn: string | null;
  durationMinutes: number;
  isFree: boolean;
  xpReward: number;
  order: number;
  isCompleted: boolean;
}

interface ModuleItem {
  id: string;
  emoji: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  completedLessons: number;
  totalLessons: number;
  progress: number;
  lessons: LessonItem[];
}

interface Props {
  modules: ModuleItem[];
}

// ============================================
// COURSES CLIENT COMPONENT
// ============================================

export function CoursesClient({ modules }: Props) {
  const { t } = useTranslation();

  // Определяем статусы модулей
  const totalCompleted = modules.reduce((sum, m) => sum + m.completedLessons, 0);
  const totalLessons = modules.reduce((sum, m) => sum + m.totalLessons, 0);
  const isNewUser = totalCompleted === 0;

  // Текущий активный модуль (первый незавершённый с прогрессом > 0, или первый)
  const activeModule = modules.find(m => m.progress > 0 && m.progress < 100)
    ?? modules.find(m => m.completedLessons === 0);

  // По умолчанию разворачиваем активный модуль
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(activeModule ? [activeModule.id] : [modules[0]?.id].filter(Boolean) as string[])
  );

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Находим следующий урок для продолжения
  const nextLesson = (() => {
    for (const mod of modules) {
      const lesson = mod.lessons.find(l => !l.isCompleted);
      if (lesson) return { lesson, mod };
    }
    return null;
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Заголовок + прогресс */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne text-2xl md:text-3xl font-bold text-white">{t("courses.title")}</h1>
          <p className="text-gray-400 mt-1 text-sm">{t("courses.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 rounded-xl px-4 py-2 flex-shrink-0">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>{totalCompleted}/{totalLessons} {t("courses.lessons")}</span>
          <span className="text-emerald-400 font-medium">
            {totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Баннер "Продолжить" для новичка */}
      {isNewUser && nextLesson && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-background p-5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl flex-shrink-0">
              {nextLesson.mod.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide">{t("courses.whereToStart")}</span>
              </div>
              <p className="text-white font-semibold text-sm truncate">{nextLesson.lesson.titleEn ?? nextLesson.lesson.title}</p>
              <p className="text-gray-400 text-xs">{nextLesson.mod.titleEn ?? nextLesson.mod.title}</p>
            </div>
            <Link href={`/lessons/${nextLesson.lesson.id}`} className="flex-shrink-0">
              <Badge className="bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
                {t("courses.start")}
                <ArrowRight className="w-3 h-3" />
              </Badge>
            </Link>
          </div>
        </div>
      )}

      {/* Продолжить для возвращающихся */}
      {!isNewUser && nextLesson && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-gray-400 text-sm flex-1 truncate">
            {t("courses.continue")}: <span className="text-white">{nextLesson.mod.emoji} {nextLesson.lesson.titleEn ?? nextLesson.lesson.title}</span>
          </span>
          <Link href={`/lessons/${nextLesson.lesson.id}`}>
            <button className="text-emerald-400 text-xs hover:text-emerald-300 flex items-center gap-1 flex-shrink-0">
              {t("courses.open")} <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      )}

      {/* Список модулей */}
      <div className="space-y-3">
        {modules.map((mod, modIdx) => {
          const isExpanded = expandedIds.has(mod.id);
          const isDone = mod.progress === 100;
          const isActive = mod.id === activeModule?.id;
          const isLocked = modIdx > 0 && modules[modIdx - 1].progress < 20 && mod.completedLessons === 0;
          // Вычисляем один раз на уровне модуля, не внутри lessons.map (иначе O(n²))
          const nextToDoIdx = mod.lessons.findIndex(l => !l.isCompleted);

          return (
            <Card
              key={mod.id}
              className={`overflow-hidden transition-all ${
                isActive ? "border-emerald-500/30" : ""
              } ${isDone ? "opacity-80" : ""}`}
            >
              {/* Заголовок модуля — кликабельный */}
              <button
                onClick={() => toggle(mod.id)}
                className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Статус/эмодзи */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl
                    ${isDone ? "bg-emerald-500/10" : isActive ? "bg-emerald-500/15" : "bg-white/5"}`}
                  >
                    {isDone ? "✅" : mod.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className={`font-syne font-bold text-sm md:text-base truncate
                        ${isDone ? "text-gray-400" : "text-white"}`}
                      >
                        {mod.titleEn ?? mod.title}
                      </h2>
                      {isActive && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                          {t("courses.inProgress")}
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[10px] text-gray-600 flex-shrink-0 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {t("courses.finishPrevious")}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-1 mb-2">{mod.descriptionEn ?? mod.description}</p>
                    <div className="flex items-center gap-3">
                      <Progress value={mod.progress} className="h-1.5 flex-1" />
                      <span className={`text-xs flex-shrink-0 ${isDone ? "text-emerald-400" : "text-gray-500"}`}>
                        {mod.completedLessons}/{mod.totalLessons}
                      </span>
                    </div>
                  </div>

                  {/* Expand/collapse */}
                  <div className="flex-shrink-0 text-gray-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Список уроков */}
              {isExpanded && (
                <div className="border-t border-white/5 p-3 space-y-1">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const isNextToDo = !lesson.isCompleted && lessonIdx === nextToDoIdx;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                          ${lesson.isCompleted
                            ? "hover:bg-white/5 opacity-70 hover:opacity-100"
                            : isNextToDo
                            ? "bg-emerald-500/8 border border-emerald-500/20 hover:bg-emerald-500/15"
                            : "hover:bg-white/5"
                          }`}
                      >
                        {/* Статус иконка */}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : isNextToDo ? (
                            <PlayCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <span className="font-mono text-gray-600 text-xs">{String(lesson.order).padStart(2, "0")}</span>
                          )}
                        </div>

                        {/* Название */}
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm truncate block
                            ${lesson.isCompleted
                              ? "text-gray-500 line-through decoration-gray-600"
                              : isNextToDo
                              ? "text-emerald-300 font-medium"
                              : "text-gray-300 group-hover:text-white transition-colors"
                            }`}
                          >
                            {lesson.titleEn ?? lesson.title}
                          </span>
                        </div>

                        {/* Метаданные */}
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          {lesson.isFree && !lesson.isCompleted && (
                            <Badge variant="free" className="text-[10px] px-1.5">{t("courses.free")}</Badge>
                          )}
                          {!lesson.isFree && !lesson.isCompleted && (
                            <Lock className="w-3 h-3 text-gray-600" />
                          )}
                          <span className="text-gray-600 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.durationMinutes}{t("lesson.min")}
                          </span>
                          <span className="text-emerald-700 text-xs flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {lesson.xpReward}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
