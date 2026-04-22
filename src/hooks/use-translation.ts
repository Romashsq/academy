"use client";

import { en, type Translations } from "@/lib/i18n/translations";

const dict = en as unknown as Record<string, unknown>;

// Deep value lookup by dot-notation: "lesson.completed"
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

// Variable substitution: "Hello, {name}!" + { name: "Alex" } → "Hello, Alex!"
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export function useTranslation() {
  function t(key: string, vars?: Record<string, string | number>): string {
    const value = getNestedValue(dict, key);
    return interpolate(value, vars);
  }

  return { t, locale: "en" as const };
}

// Server utility — for server components
export function getTranslations(_locale?: string): Translations {
  return en;
}
