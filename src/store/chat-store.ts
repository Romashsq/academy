import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  imageUrl?: string;
}

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  historyLoaded: boolean;
  prefillMessage: string | null;
  lessonContext: string | null;
  addMessage: (msg: Omit<ChatMessage, "id" | "createdAt">, id?: string) => string;
  updateLastAssistant: (content: string) => void;
  clearMessages: () => void;
  setMessages: (msgs: ChatMessage[]) => void;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setHistoryLoaded: (v: boolean) => void;
  setPrefillMessage: (msg: string | null) => void;
  setLessonContext: (ctx: string | null) => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  historyLoaded: false,
  prefillMessage: null,
  lessonContext: null,

  addMessage: (msg, id) => {
    const newId = id ?? crypto.randomUUID();
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: newId, createdAt: Date.now() },
      ],
    }));
    return newId;
  },

  updateLastAssistant: (content) => {
    set((s) => {
      const msgs = s.messages;
      const lastIdx = msgs.length - 1;
      if (lastIdx < 0 || msgs[lastIdx]?.role !== "assistant") return s;
      // Мутируем последний элемент на месте чтобы не пересоздавать весь массив —
      // Zustand всё равно триггерит ре-рендер только подписчиков messages
      const next = [...msgs];
      next[lastIdx] = { ...msgs[lastIdx], content };
      return { messages: next };
    });
  },

  clearMessages: () => set({ messages: [] }),
  setMessages: (msgs) => set({ messages: msgs }),
  setOpen: (open) => set({ isOpen: open }),
  setLoading: (loading) => set({ isLoading: loading }),
  setHistoryLoaded: (v) => set({ historyLoaded: v }),
  setPrefillMessage: (msg) => set({ prefillMessage: msg }),
  setLessonContext: (ctx) => set({ lessonContext: ctx }),
}));
