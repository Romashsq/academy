"use client";

import { Flame, Medal } from "lucide-react";
import { formatXP } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

// ============================================
// ТИПЫ
// ============================================

interface LeaderboardUser {
  id: string;
  displayName: string;
  initial: string;
  totalXP: number;
  currentStreak: number;
  level: number;
  levelTitle: string;
  lessonsCount: number;
  isCurrentUser: boolean;
  rank: number;
}

interface Props {
  users: LeaderboardUser[];
}

// ============================================
// MEDAL DISPLAY
// ============================================

function rankDisplay(rank: number) {
  if (rank === 1) return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", label: "🥇" };
  if (rank === 2) return { bg: "bg-gray-400/10", border: "border-gray-400/20", text: "text-gray-300", label: "🥈" };
  if (rank === 3) return { bg: "bg-orange-700/20", border: "border-orange-700/30", text: "text-orange-400", label: "🥉" };
  return { bg: "", border: "border-white/5", text: "text-gray-500", label: String(rank) };
}

// ============================================
// LEADERBOARD CLIENT COMPONENT
// ============================================

export function LeaderboardClient({ users }: Props) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Medal className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">{t("leaderboard.title")}</h1>
          <p className="text-gray-500 text-sm">{t("leaderboard.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-2">
        {users.map((user) => {
          const rd = rankDisplay(user.rank);
          return (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                user.isCurrentUser
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : `bg-white/[0.02] ${rd.border} hover:bg-white/5`
              }`}
            >
              {/* Место */}
              <div className={`w-8 text-center font-bold text-sm flex-shrink-0 ${rd.text}`}>
                {user.rank <= 3 ? rd.label : `#${user.rank}`}
              </div>

              {/* Аватар */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                user.isCurrentUser
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-gray-400"
              }`}>
                {user.initial}
              </div>

              {/* Имя + уровень */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${user.isCurrentUser ? "text-emerald-400" : "text-white"}`}>
                  {user.displayName}
                  {user.isCurrentUser && (
                    <span className="ml-2 text-xs text-emerald-600 font-normal">
                      ({t("leaderboard.you")})
                    </span>
                  )}
                </p>
                <p className="text-gray-500 text-xs">
                  Lvl.{user.level} — {user.levelTitle} · {user.lessonsCount} {t("leaderboard.lessons")}
                </p>
              </div>

              {/* Streak */}
              {user.currentStreak > 0 && (
                <div className="flex items-center gap-1 text-orange-400 text-xs flex-shrink-0">
                  <Flame className="w-3 h-3" />
                  {user.currentStreak}
                </div>
              )}

              {/* XP */}
              <div className="text-right flex-shrink-0">
                <p className="text-emerald-400 font-semibold text-sm">
                  {formatXP(user.totalXP)} XP
                </p>
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <p className="text-center text-gray-500 py-16">{t("leaderboard.noData")}</p>
        )}
      </div>
    </div>
  );
}
