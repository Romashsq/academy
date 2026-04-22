"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Brain, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/store/notification-store";
import { useTranslation } from "@/hooks/use-translation";

// ============================================
// ТИПЫ
// ============================================

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  order: number;
}

interface QuizData {
  id: string;
  xpReward: number;
  questions: QuizQuestion[];
}

interface QuizAttempt {
  score: number;
  total: number;
  xpEarned: number;
  attemptNumber?: number;
}

interface SubmitResult {
  correct: boolean;
  selectedIndex: number;
  correctIndex: number;
  explanation: string | null;
}

interface Props {
  lessonId: string;
  quiz: QuizData;
  previousAttempt: QuizAttempt | null;
  nextLessonId?: string | null;
}

type State = "idle" | "answering" | "submitted";

// ============================================
// QUIZ SECTION
// ============================================

export function QuizSection({ lessonId, quiz, previousAttempt, nextLessonId }: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState<State>(
    previousAttempt ? "submitted" : "idle"
  );
  const [selected, setSelected] = useState<(number | null)[]>(
    quiz.questions.map(() => null)
  );
  const [results, setResults] = useState<SubmitResult[] | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(previousAttempt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const allAnswered = selected.every((s) => s !== null);

  const handleSubmit = async () => {
    if (!allAnswered || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/quiz/${lessonId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selected }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data.results);
        setAttempt({ score: data.score, total: data.total, xpEarned: data.xpEarned, attemptNumber: data.attemptNumber });
        setState("submitted");
        if (data.xpEarned > 0) {
          notify.xp(data.xpEarned);
        }
      }
    } catch (err) {
      console.error("Quiz submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Idle — кнопка старта ──
  if (state === "idle") {
    return (
      <div className="mt-10 border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-syne font-semibold text-white">{t("quiz.title")}</h3>
            <p className="text-gray-500 text-xs">
              {quiz.questions.length} {quiz.questions.length === 1 ? t("quiz.questionCount_1") : t("quiz.questionCount_2")} · {t("quiz.bonusUp")} +{quiz.xpReward} XP
            </p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {t("quiz.description")}
        </p>
        <Button onClick={() => setState("answering")} className="gap-2">
          <Brain className="w-4 h-4" />
          {t("quiz.startButton")}
        </Button>
      </div>
    );
  }

  // ── Answering — вопросы ──
  if (state === "answering") {
    const q = quiz.questions[currentQuestion];
    const isLast = currentQuestion === quiz.questions.length - 1;

    return (
      <div className="mt-10 border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
        {/* Прогресс */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-400">
              {t("quiz.question")} {currentQuestion + 1} {t("quiz.of")} {quiz.questions.length}
            </span>
          </div>
          <div className="flex gap-1">
            {quiz.questions.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-6 rounded-full transition-colors ${
                  i < currentQuestion
                    ? "bg-emerald-500"
                    : i === currentQuestion
                    ? "bg-emerald-400"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Вопрос */}
        <p className="text-white font-medium mb-4 leading-relaxed">{q.text}</p>

        {/* Варианты */}
        <div className="space-y-2 mb-6">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                const next = [...selected];
                next[currentQuestion] = i;
                setSelected(next);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                selected[currentQuestion] === i
                  ? "border-emerald-500 bg-emerald-500/10 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span className="font-mono text-gray-500 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
            disabled={currentQuestion === 0}
          >
            {t("quiz.back")}
          </Button>

          {isLast ? (
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!allAnswered}
              className="gap-2"
            >
              {t("quiz.submit")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion((p) => p + 1)}
              disabled={selected[currentQuestion] === null}
              className="gap-2"
            >
              {t("quiz.next")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Submitted — результаты ──
  const score = attempt?.score ?? 0;
  const total = attempt?.total ?? quiz.questions.length;
  const xpEarned = attempt?.xpEarned ?? 0;
  const percent = Math.round((score / total) * 100);

  return (
    <div className="mt-10 border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
      {/* Итог */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            percent >= 60 ? "bg-emerald-500/20" : "bg-red-500/20"
          }`}>
            <Brain className={`w-5 h-5 ${percent >= 60 ? "text-emerald-400" : "text-red-400"}`} />
          </div>
          <div>
            <h3 className="font-syne font-semibold text-white">
              {score} / {total} {t("quiz.correct")}
            </h3>
            <p className="text-gray-500 text-xs">{percent}{t("quiz.percentCorrect")}</p>
          </div>
        </div>
        {xpEarned > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-emerald-400 text-sm font-semibold">
            +{xpEarned} XP
          </div>
        )}
      </div>

      {/* Детали по вопросам */}
      {results && (
        <div className="space-y-3">
          {quiz.questions.map((q, i) => {
            const r = results[i];
            return (
              <div
                key={q.id}
                className={`rounded-xl p-4 border ${
                  r.correct
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {r.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm text-white">{q.text}</p>
                </div>
                {!r.correct && (
                  <p className="text-xs text-gray-400 ml-6">
                    {t("quiz.correctAnswer")}{" "}
                    <span className="text-emerald-400">
                      {q.options[r.correctIndex]}
                    </span>
                  </p>
                )}
                {r.explanation && (
                  <p className={`text-xs ml-6 mt-1 ${r.correct ? "text-emerald-600/80" : "text-gray-500"}`}>{r.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Действия */}
      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        {/* Попробовать снова */}
        <button
          onClick={() => {
            setSelected(quiz.questions.map(() => null));
            setResults(null);
            setCurrentQuestion(0);
            setState("answering");
          }}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5"
        >
          <Brain className="w-3.5 h-3.5" />
          {attempt?.attemptNumber ? `Attempt ${attempt.attemptNumber} — retry` : "Retry"}
        </button>

        {nextLessonId && (
          <Link href={`/lessons/${nextLessonId}`}>
            <Button className="gap-2">
              Next lesson
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
