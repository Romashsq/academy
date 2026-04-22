"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Star,
  BookOpen,
  Maximize2,
  Minimize2,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/store/notification-store";
import { useChatStore } from "@/store/chat-store";
import { QuizSection } from "@/components/lesson/quiz-section";
import { PracticeSection, PracticeTaskData } from "@/components/lesson/practice-section";
import { LevelUpOverlay } from "@/components/ui/level-up-overlay";
import { useTranslation } from "@/hooks/use-translation";

// ============================================
// ТИПЫ
// ============================================

interface LessonData {
  id: string;
  title: string;
  titleEn: string | null;
  content: string;
  contentEn: string | null;
  durationMinutes: number;
  xpReward: number;
  isFree: boolean;
  module: {
    id: string;
    title: string;
    titleEn: string | null;
    emoji: string;
    order: number;
    lessons: Array<{ id: string; title: string; titleEn: string | null; order: number }>;
  };
}

interface ProgressData {
  completed: boolean;
  completedAt: Date | null;
  timeSpent: number;
}

interface NextLesson {
  id: string;
  title: string;
  titleEn: string | null;
  order: number;
}

interface QuizData {
  id: string;
  xpReward: number;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    order: number;
  }>;
}

interface QuizAttemptData {
  score: number;
  total: number;
  xpEarned: number;
}

interface Props {
  lesson: LessonData;
  progress: ProgressData | null;
  nextLesson: NextLesson | null;
  nextModuleId: string | null;
  userId: string;
  quiz: QuizData | null;
  quizAttempt: QuizAttemptData | null;
  practiceTasks: PracticeTaskData[];
}

// ============================================
// ISOLATED TIMER — re-renders only itself, not LessonViewer
// ============================================

function LessonTimer({ onTwoMinutes }: { onTwoMinutes: () => void }) {
  const [secs, setSecs] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecs((s) => {
        const next = s + 1;
        if (next === 120 && !firedRef.current) {
          firedRef.current = true;
          onTwoMinutes();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onTwoMinutes]);

  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return <>{m}:{s.toString().padStart(2, "0")}</>;
}

// ============================================
// TOC — оглавление из заголовков
// ============================================

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(content: string): TocItem[] {
  const lines = content.split("\n");
  const items: TocItem[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (m) {
      const text = m[2].trim();
      const id = text.toLowerCase().replace(/[^a-zа-яё0-9\s]/gi, "").replace(/\s+/g, "-");
      items.push({ id, text, level: m[1].length });
    }
  }
  return items;
}

// ============================================
// LESSON VIEWER CLIENT COMPONENT
// ============================================

export function LessonViewer({
  lesson,
  progress,
  nextLesson,
  nextModuleId,
  userId: _userId,
  quiz,
  quizAttempt,
  practiceTasks,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const { setLessonContext } = useChatStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(progress?.completed ?? false);
  const [levelUp, setLevelUp] = useState<{ level: number; title: string } | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const contentRef = useRef<HTMLDivElement>(null);

  // Контент и заголовки в зависимости от языка — мемоизируем чтобы не пересчитывать при каждом тике таймера
  const lessonTitle = useMemo(
    () => (lesson.titleEn ?? lesson.title),
    [lesson.titleEn, lesson.title]
  );
  const lessonContent = useMemo(
    () => (lesson.contentEn ?? lesson.content),
    [lesson.contentEn, lesson.content]
  );
  const moduleTitle = useMemo(
    () => (lesson.module.titleEn ?? lesson.module.title),
    [lesson.module.titleEn, lesson.module.title]
  );
  const hasEnContent = !!lesson.contentEn;

  // TOC — дорогостоящий парсинг, мемоизируем (иначе пересчитывается на каждый тик таймера и скролл)
  const toc = useMemo(() => extractToc(lessonContent), [lessonContent]);

  // Индекс текущего урока — мемоизируем
  const lessons = lesson.module.lessons;
  const currentIdx = useMemo(
    () => lessons.findIndex((l) => l.id === lesson.id),
    [lessons, lesson.id]
  );
  const prevLesson = lessons[currentIdx - 1] ?? null;

  // Передаём контекст текущего урока в чат-бот
  useEffect(() => {
    const ctx = `Current lesson: "${lessonTitle}" | Module ${lesson.module.order}: "${moduleTitle}" | Lesson ${currentIdx + 1}/${lessons.length}`;
    setLessonContext(ctx);
    return () => setLessonContext(null);
  }, [lessonTitle, moduleTitle, lesson.module.order, currentIdx, lessons.length, setLessonContext]);

  // Callback для LessonTimer — срабатывает ровно один раз в 2 минуты
  const handleTwoMinutes = useCallback(() => {
    if (!isCompleted) {
      notify.info(
        "You've been studying for 2 minutes! Keep going 🔥",
        "📚"
      );
    }
  }, [isCompleted]);

  // Прогресс прокрутки — RAF throttle: не более одного setState за кадр
  useEffect(() => {
    let rafId: number | undefined;

    const handleScroll = () => {
      if (rafId !== undefined) return;
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        const el = contentRef.current;
        if (!el) return;
        const { scrollTop, clientHeight } = document.documentElement;
        const contentTop = el.offsetTop;
        const contentHeight = el.offsetHeight;
        const scrolled = scrollTop - contentTop;
        const p = Math.min(
          Math.max((scrolled / (contentHeight - clientHeight + 100)) * 100, 0),
          100
        );
        setReadProgress(Math.round(p));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, []);

  // Клавиатурная навигация ← →
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft" && prevLesson) {
        router.push(`/lessons/${prevLesson.id}`);
      }
      if (e.key === "ArrowRight" && isCompleted && nextLesson) {
        router.push(`/lessons/${nextLesson.id}`);
      }
      if (e.key === "f" || e.key === "F") {
        setFocusMode((v) => !v);
      }
    },
    [prevLesson, nextLesson, isCompleted, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;
    setIsCompleting(true);
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, timeSpent }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsCompleted(true);
        if (data.xpEarned > 0) notify.xp(data.xpEarned);
        if (data.leveledUp && data.newLevel) {
          setTimeout(() => setLevelUp({ level: data.newLevel, title: data.newLevelTitle }), 600);
        }
        if (data.newAchievements?.length > 0) {
          data.newAchievements.forEach(
            (a: { title: string; emoji: string; xpReward: number }) => {
              setTimeout(() => notify.achievement(a.title, a.emoji, a.xpReward), 500);
            }
          );
        }
        if (data.streakUpdated && data.newStreak > 1) {
          setTimeout(() => notify.streak(data.newStreak), 1000);
        }
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to mark lesson as complete:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className={`transition-all duration-300 ${focusMode ? "max-w-3xl" : "max-w-4xl"} mx-auto`}>

      {/* Level-up overlay */}
      {levelUp && (
        <LevelUpOverlay
          level={levelUp.level}
          levelTitle={levelUp.title}
          onClose={() => setLevelUp(null)}
        />
      )}

      {/* Прогресс чтения */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5">
        <Progress value={readProgress} className="h-0.5 rounded-none" />
      </div>

      {/* ── Верхняя панель ── */}
      <div className={`flex items-center justify-between mb-6 gap-4 transition-all ${focusMode ? "opacity-50 hover:opacity-100" : ""}`}>
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <Link href="/courses" className="hover:text-white transition-colors flex items-center gap-1 flex-shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("lesson.courses")}</span>
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/courses/${lesson.module.id}`} className="hover:text-white transition-colors flex-shrink-0 hidden sm:block">
            {lesson.module.emoji} {moduleTitle}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0 hidden sm:block" />
          <span className="text-gray-300 truncate">{lessonTitle}</span>
        </div>

        {/* Инструменты */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* TOC кнопка */}
          {toc.length > 0 && (
            <button
              onClick={() => setShowToc((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
              title={t("lesson.toc")}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("lesson.toc")}</span>
            </button>
          )}

          {/* Focus mode */}
          <button
            onClick={() => setFocusMode((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            title={focusMode ? t("lesson.exitFocusTooltip") : t("lesson.focusModeTooltip")}
          >
            {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{focusMode ? t("lesson.exitFocus") : t("lesson.focusMode")}</span>
          </button>
        </div>
      </div>

      {/* Навигация по урокам модуля (мини-прогресс) */}
      {!focusMode && (
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {lessons.map((l, i) => {
            const isCurrent = l.id === lesson.id;
            return (
              <Link key={l.id} href={`/lessons/${l.id}`}>
                <div
                  title={`${String(l.order).padStart(2, "0")}. ${l.titleEn ?? l.title}`}
                  className={`h-1.5 rounded-full transition-all duration-200 flex-shrink-0
                    ${isCurrent
                      ? "w-8 bg-emerald-400"
                      : i < currentIdx
                      ? "w-4 bg-emerald-600/60 hover:bg-emerald-500/80"
                      : "w-4 bg-white/10 hover:bg-white/20"
                    }`}
                />
              </Link>
            );
          })}
          <span className="text-xs text-gray-600 ml-2 flex-shrink-0">{currentIdx + 1}/{lessons.length}</span>
        </div>
      )}

      {/* TOC drawer */}
      {showToc && toc.length > 0 && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <List className="w-4 h-4" />
              Table of contents
            </h3>
            <button onClick={() => setShowToc(false)} className="text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setShowToc(false)}
                  className={`block text-sm hover:text-emerald-400 transition-colors py-0.5
                    ${item.level === 2 ? "text-gray-300" : "text-gray-500 pl-4"}`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`grid gap-6 ${focusMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"}`}>

        {/* ── Основной контент ── */}
        <article className={focusMode ? "col-span-1" : "lg:col-span-3"}>

          {/* Мета */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {lesson.isFree && <Badge variant="free">{t("lesson.freeBadge")}</Badge>}
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-3.5 h-3.5" />
              {lesson.durationMinutes} {t("lesson.min")}
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm">
              <Star className="w-3.5 h-3.5" />
              +{lesson.xpReward} XP
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t("lesson.completed")}
              </div>
            )}
          </div>

          {/* Заметка о переводе */}
          {!hasEnContent && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 text-sm">
              {t("lesson.translationOnly")}
            </div>
          )}

          {/* Контент урока */}
          <div ref={contentRef} className="markdown-content min-h-[60vh]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lessonContent}
            </ReactMarkdown>
          </div>

          {/* Квиз или практика */}
          {quiz && (
            <QuizSection lessonId={lesson.id} quiz={quiz} previousAttempt={quizAttempt} nextLessonId={nextLesson?.id ?? null} />
          )}
          {!quiz && practiceTasks.length > 0 && (
            <PracticeSection lessonId={lesson.id} tasks={practiceTasks} />
          )}

          {/* ── Навигация после урока ── */}
          <div className="mt-10 pt-6 border-t border-white/10">

            {/* Кнопки навигации */}
            <div className="flex items-center justify-between gap-4">
              <div>
                {prevLesson && (
                  <Link href={`/lessons/${prevLesson.id}`}>
                    <Button variant="outline" className="gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      {t("lesson.previous")}
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isCompleted ? (
                  <Button onClick={handleComplete} loading={isCompleting} className="gap-2" size="lg">
                    <CheckCircle2 className="w-4 h-4" />
                    {t("lesson.markComplete")}
                  </Button>
                ) : nextLesson ? (
                  <Link href={`/lessons/${nextLesson.id}`}>
                    <Button className="gap-2" size="lg">
                      {t("lesson.nextLesson")}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : nextModuleId ? (
                  <Link href={`/courses/${nextModuleId}`}>
                    <Button className="gap-2" size="lg">
                      <ChevronRight className="w-4 h-4" />
                      {t("lesson.nextModule")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/courses">
                    <Button variant="outline" className="gap-2">
                      {t("lesson.backToCourses")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Подсказка клавиш */}
            {!focusMode && (
              <p className="text-xs text-gray-600 text-center mt-4">
                ← → to navigate between lessons · F for focus mode
              </p>
            )}
          </div>
        </article>

        {/* ── Сайдбар ── */}
        {!focusMode && (
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-3">

              {/* Таймер + прогресс чтения */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {t("lesson.timeOnLesson")}
                  </div>
                  <div className="font-mono text-sm text-white"><LessonTimer onTwoMinutes={handleTwoMinutes} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{t("lesson.readProgress")}</span>
                    <span>{readProgress}%</span>
                  </div>
                  <Progress value={readProgress} className="h-1.5" />
                </div>
              </div>

              {/* Список уроков модуля */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">
                  {lesson.module.emoji} {moduleTitle}
                </h3>
                <div className="space-y-0.5 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                  {lessons.map((l, i) => {
                    const lTitle = l.titleEn ?? l.title;
                    const isCurr = l.id === lesson.id;
                    const isDone = i < currentIdx;
                    return (
                      <Link
                        key={l.id}
                        href={`/lessons/${l.id}`}
                        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs transition-colors
                          ${isCurr
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isDone
                            ? "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            : "text-gray-500 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        <span className="w-4 flex-shrink-0 flex items-center justify-center">
                          {isCurr ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <span className="font-mono text-gray-700 text-[10px]">{String(l.order).padStart(2, "0")}</span>
                          )}
                        </span>
                        <span className="truncate">{lTitle}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Следующий урок превью */}
              {!isCompleted && nextLesson && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Next lesson:</p>
                  <p className="text-xs text-gray-300 leading-snug">
                    {nextLesson.titleEn ?? nextLesson.title}
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
