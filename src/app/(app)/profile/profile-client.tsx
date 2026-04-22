"use client";

import { Flame, Star, BookOpen, Trophy, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatXP, timeAgo } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

// ============================================
// ТИПЫ
// ============================================

interface AchievementItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  xpReward: number;
  isEarned: boolean;
}

interface RecentLesson {
  id: string;
  moduleEmoji: string;
  lessonTitle: string;
  moduleTitle: string;
  xpReward: number;
  completedAt: string | null;
}

interface Props {
  name: string | null;
  email: string | null;
  role: string;
  totalXP: number;
  currentStreak: number;
  completedLessonsCount: number;
  totalMinutesLearned: number;
  level: number;
  levelTitle: string;
  nextLevelXP: number;
  xpProgress: number;
  createdAt: string;
  achievements: AchievementItem[];
  recentLessons: RecentLesson[];
}

// ============================================
// PROFILE CLIENT COMPONENT
// ============================================

export function ProfileClient({
  name,
  email,
  role,
  totalXP,
  currentStreak,
  completedLessonsCount,
  totalMinutesLearned,
  level,
  levelTitle,
  nextLevelXP,
  xpProgress,
  createdAt,
  achievements,
  recentLessons,
}: Props) {
  const { t } = useTranslation();
  const studentLabel = t("profile.student");

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* ── Заголовок профиля ── */}
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-3xl font-bold font-syne shadow-emerald flex-shrink-0">
          {name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="font-syne text-3xl font-bold text-white">
              {name ?? studentLabel}
            </h1>
            {role === "admin" && <Badge>Admin</Badge>}
          </div>
          <p className="text-gray-400 text-sm mb-2">{email}</p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {t("profile.memberSince")}{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="font-syne text-xl font-bold text-white">{formatXP(totalXP)}</div>
          <div className="text-gray-500 text-xs">{t("profile.totalXP")}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="font-syne text-xl font-bold text-white">{currentStreak}</div>
          <div className="text-gray-500 text-xs">{t("profile.currentStreak")}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="font-syne text-xl font-bold text-white">{completedLessonsCount}</div>
          <div className="text-gray-500 text-xs">{t("profile.lessonsCompleted")}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="font-syne text-xl font-bold text-white">{totalMinutesLearned}</div>
          <div className="text-gray-500 text-xs">{t("profile.minutesLearned")}</div>
        </Card>
      </div>

      {/* ── Уровень ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">{t("profile.level")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="font-syne text-2xl font-bold text-white">
              {level} — {levelTitle}
            </span>
            <span className="text-gray-500 text-sm">
              {formatXP(totalXP)} / {formatXP(nextLevelXP)} XP
            </span>
          </div>
          <Progress value={xpProgress} />
          <p className="text-gray-500 text-xs mt-2">
            {t("profile.untilNextLevel", { xp: formatXP(nextLevelXP - totalXP) })}
          </p>
        </CardContent>
      </Card>

      {/* ── Достижения ── */}
      <div>
        <h2 className="font-syne text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          {t("profile.achievements")}
          <span className="text-gray-500 text-sm font-normal">
            {achievements.filter((a) => a.isEarned).length} / {achievements.length}
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-4 text-center transition-all ${
                achievement.isEarned
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "opacity-40 grayscale"
              }`}
            >
              <div className={`text-3xl mb-2 ${!achievement.isEarned && "grayscale"}`}>
                {achievement.emoji}
              </div>
              <div className="font-medium text-white text-sm mb-1">{achievement.title}</div>
              <div className="text-gray-400 text-xs mb-2 line-clamp-2">{achievement.description}</div>
              {achievement.isEarned ? (
                <Badge className="text-[10px]">+{achievement.xpReward} XP</Badge>
              ) : (
                <span className="text-gray-600 text-xs">{t("profile.locked")}</span>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* ── Последние уроки ── */}
      {recentLessons.length > 0 && (
        <div>
          <h2 className="font-syne text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            {t("profile.recentLessons")}
          </h2>

          <Card>
            <div className="divide-y divide-white/5">
              {recentLessons.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="text-xl">{p.moduleEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.lessonTitle}</p>
                    <p className="text-gray-500 text-xs">{p.moduleTitle}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant="secondary" className="text-[10px]">
                      +{p.xpReward} XP
                    </Badge>
                    <span className="text-gray-600 text-xs">
                      {p.completedAt ? timeAgo(new Date(p.completedAt)) : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
