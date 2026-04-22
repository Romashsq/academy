"use client";

import Link from "next/link";
import { Star, Flame, BookOpen, Trophy, Zap, ExternalLink } from "lucide-react";
import { formatXP } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { PublicProfileShareButton } from "./share-button";

interface Achievement {
  id: string;
  achievement: { emoji: string; title: string; description: string };
}

interface Props {
  userId: string;
  name: string | null;
  totalXP: number;
  currentStreak: number;
  createdAtISO: string;
  level: number;
  levelTitle: string;
  xpProgress: number;
  nextLevelXP: number;
  levelGradient: string;
  lessonStats: number;
  achievements: Achievement[];
}

export function PublicProfileView({
  userId, name, totalXP, currentStreak, createdAtISO,
  level, levelTitle, xpProgress, nextLevelXP, levelGradient,
  lessonStats, achievements,
}: Props) {
  const { t } = useTranslation();

  const memberSince = new Date(createdAtISO).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const studentFallback = t("publicProfile.studentFallback");

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">

      {/* ── Hero card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-5">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${levelGradient} flex items-center justify-center text-2xl font-bold text-black flex-shrink-0`}>
            {name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h1 className="font-syne font-bold text-xl text-white truncate">
                  {name ?? studentFallback}
                </h1>
                <p className="text-gray-500 text-sm">
                  {t("publicProfile.memberSince").replace("{date}", memberSince)}
                </p>
              </div>
              <PublicProfileShareButton userId={userId} name={name ?? studentFallback} />
            </div>

            {/* Level badge */}
            <div className="flex items-center gap-2 mt-3">
              <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${levelGradient} px-3 py-1 rounded-full text-black text-sm font-bold`}>
                <Star className="w-3.5 h-3.5" />
                {t("publicProfile.levelBadge").replace("{level}", String(level)).replace("{title}", levelTitle)}
              </div>
            </div>

            {/* XP bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>{formatXP(totalXP)} XP</span>
                <span>{t("publicProfile.untilNextXP").replace("{xp}", formatXP(nextLevelXP))}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${levelGradient} rounded-full`}
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Zap, label: t("publicProfile.xpLabel"), value: formatXP(totalXP) + " XP", color: "text-lime-400" },
          { icon: Flame, label: t("publicProfile.streakLabel"), value: `${currentStreak} ${t("publicProfile.streakDays")}`, color: "text-orange-400" },
          { icon: BookOpen, label: t("publicProfile.lessonsLabel"), value: String(lessonStats), color: "text-blue-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
            <p className="text-white font-semibold text-lg leading-none">{value}</p>
            <p className="text-gray-600 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Achievements ── */}
      {achievements.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h2 className="font-syne font-semibold text-white text-sm">
              {t("publicProfile.achievementsTitle").replace("{count}", String(achievements.length))}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {achievements.map((ua) => (
              <div
                key={ua.id}
                className="flex items-center gap-2.5 bg-white/5 rounded-xl p-3"
                title={ua.achievement.description}
              >
                <span className="text-2xl">{ua.achievement.emoji}</span>
                <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                  {ua.achievement.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5 text-center">
        <p className="text-gray-400 text-sm mb-3">
          {t("publicProfile.ctaText")}
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-black text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Zap className="w-4 h-4" />
          {t("publicProfile.startFree")}
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
