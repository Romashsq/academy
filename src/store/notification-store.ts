import { create } from "zustand";

// ============================================
// TYPES
// ============================================

export type NotificationType = "xp" | "achievement" | "streak" | "info" | "error" | "levelup";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  emoji?: string;
}

interface NotificationStore {
  notifications: Notification[];
  add: (notification: Omit<Notification, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
}

// ============================================
// ZUSTAND STORE
// ============================================

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  add: (notification) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },

  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clear: () => set({ notifications: [] }),
}));

// ============================================
// NOTIFICATION HELPERS
// ============================================

export const notify = {
  xp: (amount: number) => {
    useNotificationStore.getState().add({
      type: "xp",
      emoji: "⭐",
      title: `+${amount} XP`,
      message: "Lesson complete!",
    });
  },

  achievement: (title: string, emoji: string, xpReward: number) => {
    useNotificationStore.getState().add({
      type: "achievement",
      emoji,
      title: `Achievement: ${title}`,
      message: `+${xpReward} XP`,
    });
  },

  streak: (days: number) => {
    useNotificationStore.getState().add({
      type: "streak",
      emoji: "🔥",
      title: `${days}-day streak!`,
      message: "Keep it up",
    });
  },

  info: (message: string, emoji = "💪") => {
    useNotificationStore.getState().add({
      type: "info",
      emoji,
      title: message,
    });
  },

  levelUp: (level: number, title: string) => {
    useNotificationStore.getState().add({
      type: "levelup",
      emoji: "🚀",
      title: `Level Up! Level ${level} — ${title}`,
      message: "Keep going, you're on fire!",
    });
  },
};
