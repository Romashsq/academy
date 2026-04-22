"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Medal,
  User,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn, calculateLevel, formatXP } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/use-translation";

// ============================================
// ТИПЫ
// ============================================

interface SidebarProps {
  name: string | null;
  email: string | null;
  image: string | null;
  totalXP: number;
  currentStreak: number;
}

// ============================================
// SIDEBAR COMPONENT
// ============================================

export function Sidebar({ name, email, totalXP, currentStreak }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  // Close on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const { level, title: levelTitle, nextLevelXP, progress: xpProgress } =
    calculateLevel(totalXP);

  const initial = (name?.[0] ?? email?.[0] ?? "U").toUpperCase();

  const levelLabel = `Lvl.${level} — ${levelTitle}`;

  const navItems = [
    { href: "/dashboard", label: t("nav.overview"), icon: LayoutDashboard },
    { href: "/courses", label: t("nav.courses"), icon: BookOpen },
    { href: "/achievements", label: t("nav.achievements"), icon: Trophy },
    { href: "/leaderboard", label: t("nav.leaderboard"), icon: Medal },
    { href: "/profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    <aside className={cn(
      "sidebar fixed left-0 top-0 h-full w-64 border-r border-white/10 z-40 flex flex-col transition-transform duration-300",
      mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Логотип */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-emerald group-hover:shadow-emerald-lg transition-all">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-syne font-bold text-white text-lg leading-none">
              VibeCode
            </span>
            <span className="block text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
              Academy
            </span>
          </div>
        </Link>
      </div>

      {/* Пользователь + XP */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {name ?? t("nav.student")}
            </p>
            <p className="text-gray-500 text-xs truncate">{email}</p>
          </div>
        </div>

        {/* XP прогресс */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span className="text-emerald-400/80">{levelLabel}</span>
            <span className="text-emerald-400">
              {formatXP(totalXP)} / {formatXP(nextLevelXP)} XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-1.5" />
        </div>
      </div>

      {/* Навигация */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-emerald-400"
                    : "text-gray-500 group-hover:text-white"
                )}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Нижние действия */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {t("nav.settings")}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {t("nav.logout")}
        </button>
      </div>
    </aside>
    </>
  );
}
