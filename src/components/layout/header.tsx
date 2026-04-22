"use client";

import { Flame, Star, Search, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatXP } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import { useTranslation } from "@/hooks/use-translation";

// ============================================
// ТИПЫ
// ============================================

interface HeaderProps {
  title?: string;
  totalXP?: number;
  currentStreak?: number;
}

// ============================================
// HEADER COMPONENT
// ============================================

export function Header({ title, totalXP, currentStreak }: HeaderProps) {
  const { t } = useTranslation();
  const isLoggedIn = totalXP !== undefined;

  return (
    <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Hamburger (mobile) + заголовок */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))}
        >
          <Menu className="w-4 h-4" />
        </button>
        {title && (
          <h1 className="font-syne font-semibold text-white text-lg">{title}</h1>
        )}
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-3">
        <ThemeSwitcher />

        {isLoggedIn ? (
          <>
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5">
              <Flame className={`w-4 h-4 ${(currentStreak ?? 0) > 0 ? "text-orange-400" : "text-gray-600"}`} />
              <span className={`text-sm font-semibold ${(currentStreak ?? 0) > 0 ? "text-orange-400" : "text-gray-600"}`}>
                {currentStreak ?? 0}
              </span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <Star className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">
                {formatXP(totalXP ?? 0)} XP
              </span>
            </div>

            {/* Поиск */}
            <Link href="/search" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Search className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">{t("header.login")}</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">{t("header.startFree")}</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
