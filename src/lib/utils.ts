import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Parse Zod validation errors into a field → message map
export function parseZodErrors<T extends Record<string, unknown>>(
  errors: Array<{ path: (string | number)[]; message: string }>
): Partial<Record<keyof T, string>> {
  const result: Record<string, string> = {};
  for (const err of errors) {
    const field = err.path[0] as string;
    if (!result[field]) result[field] = err.message;
  }
  return result as Partial<Record<keyof T, string>>;
}

// Форматирование XP
export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

// Форматирование времени (секунды → "5 мин")
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}ч ${remainingMinutes}м` : `${hours}ч`;
}

// Вычисление уровня по XP
export function calculateLevel(xp: number): {
  level: number;
  title: string;
  nextLevelXP: number;
  progress: number;
  isMaxLevel: boolean;
} {
  const levels = [
    { level: 1, title: "Beginner", xp: 0 },
    { level: 2, title: "Student", xp: 500 },
    { level: 3, title: "Practitioner", xp: 2000 },
    { level: 4, title: "Expert", xp: 5000 },
    { level: 5, title: "Master", xp: 10000 },
  ];

  let currentLevel = levels[0];
  let nextLevel: typeof levels[0] | null = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] ?? null;
    }
  }

  const isMaxLevel = nextLevel === null;

  const progressXP = xp - currentLevel.xp;
  const rangeXP = nextLevel ? nextLevel.xp - currentLevel.xp : 1;
  const progress = isMaxLevel ? 100 : Math.min((progressXP / rangeXP) * 100, 100);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelXP: nextLevel ? nextLevel.xp : currentLevel.xp,
    progress,
    isMaxLevel,
  };
}

// Relative time ("2 hours ago")
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
