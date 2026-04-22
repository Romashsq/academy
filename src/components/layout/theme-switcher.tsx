"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { useTranslation } from "@/hooks/use-translation";

export function ThemeSwitcher() {
  const { theme, toggle } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      className={`
        relative w-14 h-7 rounded-full border transition-all duration-300 flex items-center
        ${isDark
          ? "bg-lime-500/10 border-lime-500/30"
          : "bg-lime-500/20 border-lime-600/40"
        }
      `}
    >
      {/* Track fill */}
      <span
        className={`
          absolute inset-0.5 rounded-full transition-all duration-300
          ${isDark ? "bg-transparent" : "bg-lime-100/60"}
        `}
      />
      {/* Thumb */}
      <span
        className={`
          relative z-10 w-5 h-5 rounded-full flex items-center justify-center
          shadow-sm transition-all duration-300
          ${isDark
            ? "translate-x-1 bg-[#0a0c10] border border-lime-500/40"
            : "translate-x-[30px] bg-white border border-lime-500/60"
          }
        `}
      >
        {isDark
          ? <Moon className="w-2.5 h-2.5 text-lime-400" />
          : <Sun className="w-2.5 h-2.5 text-lime-600" />
        }
      </span>
    </button>
  );
}
