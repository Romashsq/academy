"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

/**
 * Rehydrates Zustand persist stores from localStorage AFTER React hydration.
 * This prevents the hydration mismatch caused by Zustand reading localStorage
 * synchronously during React's reconciliation phase.
 */
export function StoreHydration() {
  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  return null;
}
