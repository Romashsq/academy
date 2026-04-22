"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  X, Send, Trash2, Bot, Sparkles, ChevronDown, User,
  Loader2, Zap, Maximize2, Minimize2, Paperclip, ImageOff,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "@/store/chat-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

// ── Suggestions ───────────────────────────────────────────────────────────
const SUGGESTIONS = {
  ru: [
    "Что такое промпт-инженерия?",
    "Как начать Vibe Coding с нуля?",
    "Чем Claude отличается от ChatGPT?",
    "Как создать своего ИИ-агента?",
  ],
  en: [
    "What is prompt engineering?",
    "How to start Vibe Coding from scratch?",
    "Claude vs ChatGPT — key differences?",
    "How to build your own AI agent?",
  ],
};

interface ChatAssistantProps {
  userContext?: string;
}

interface PendingImage {
  fileUrl: string;
  preview: string;
  fileName: string;
}

// ── Chat UI ───────────────────────────────────────────────────────────────
function ChatUI({
  isFullscreen,
  onToggleFullscreen,
  messages,
  isLoading,
  input,
  setInput,
  sendMessage,
  clearMessages,
  setOpen,
  inputRef,
  bottomRef,
  pendingImage,
  onAttachImage,
  onClearImage,
}: {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  messages: { id: string; role: "user" | "assistant"; content: string; createdAt: number; imageUrl?: string }[];
  isLoading: boolean;
  input: string;
  setInput: (v: string) => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
  setOpen: (v: boolean) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  pendingImage: PendingImage | null;
  onAttachImage: () => void;
  onClearImage: () => void;
}) {
  const { t } = useTranslation();
  const suggestions = SUGGESTIONS.en;
  const isEmpty = messages.length === 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    /* Always dark — ignore theme */
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ colorScheme: "dark" }}
    >
      {/* ── Header ── */}
      <div className="px-5 py-3.5 bg-[#0d0f1a] border-b border-white/[0.07] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d0f1a]" />
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Vibe AI</p>
            <p style={{ color: "#34d399", fontSize: 11, fontFamily: "monospace" }}>
              {"● online · GPT-4o mini"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              style={{ color: "#6b7280" }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:!text-red-400 transition-all"
              title={t("chat.clear")}
            >
              <Trash2 style={{ width: 14, height: 14 }} />
            </button>
          )}
          <button
            onClick={onToggleFullscreen}
            style={{ color: "#6b7280" }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:!text-white transition-all"
            title={isFullscreen ? t("chat.minimize") : t("chat.maximize")}
          >
            {isFullscreen
              ? <Minimize2 style={{ width: 14, height: 14 }} />
              : <Maximize2 style={{ width: 14, height: 14 }} />}
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{ color: "#6b7280" }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:!text-white transition-all"
          >
            <ChevronDown style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ background: "#070810" }}>

        {/* Welcome */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/25 to-emerald-800/10 border border-emerald-500/20 flex items-center justify-center">
                <Sparkles style={{ width: 32, height: 32, color: "#34d399" }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Bot style={{ width: 12, height: 12, color: "#fff" }} />
              </div>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, fontFamily: "var(--font-syne)", lineHeight: 1.2, marginBottom: 8 }}>
                {"Hey! I'm Vibe AI"}
              </p>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
                {"Expert in AI, Vibe Coding & prompt engineering. Ask me anything!"}
              </p>
            </div>
            <div className="w-full space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left transition-all duration-200 hover:translate-x-1"
                  style={{
                    color: "#9ca3af",
                    fontSize: 12,
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(52,211,153,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "#9ca3af";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <span style={{ color: "#34d399", marginRight: 8 }}>→</span>{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg: { id: string; role: "user" | "assistant"; content: string; createdAt: number; imageUrl?: string }, i: number) => (
          <div
            key={msg.id}
            className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            style={{ animation: "fadeSlideIn 0.2s ease-out" }}
          >
            {/* Avatar */}
            <div
              className="flex-shrink-0 mt-0.5"
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                background: msg.role === "assistant"
                  ? "linear-gradient(135deg, #10b981, #065f46)"
                  : "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: msg.role === "assistant" ? "0 2px 8px rgba(16,185,129,0.3)" : "none",
              }}
            >
              {msg.role === "assistant"
                ? <Zap style={{ width: 14, height: 14, color: "#fff" }} />
                : <User style={{ width: 13, height: 13, color: "#9ca3af" }} />}
            </div>

            {/* Bubble */}
            <div
              style={{
                maxWidth: "82%",
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                padding: "10px 14px",
                fontSize: 13,
                lineHeight: 1.65,
                ...(msg.role === "user"
                  ? {
                      background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.15))",
                      border: "1px solid rgba(52,211,153,0.2)",
                      color: "#f0fdf4",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#e5e7eb",
                    }),
              }}
            >
              {msg.role === "assistant" && !msg.content && isLoading && i === messages.length - 1 ? (
                <div className="flex gap-1.5 py-0.5 items-center">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#34d399",
                        display: "inline-block",
                        animation: `bounce 1s infinite ${delay}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : msg.role === "assistant" ? (
                <div className="prose-chat">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <>
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="attached"
                      style={{ maxWidth: "100%", borderRadius: 8, marginBottom: msg.content ? 6 : 0 }}
                    />
                  )}
                  {msg.content && <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{msg.content}</p>}
                </>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        style={{
          padding: "12px 16px 14px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "#0a0c15",
          flexShrink: 0,
        }}
      >
        {/* Превью прикреплённого изображения */}
        {pendingImage && (
          <div style={{ marginBottom: 8, position: "relative", display: "inline-block" }}>
            <img
              src={pendingImage.preview}
              alt="attachment"
              style={{ maxHeight: 80, borderRadius: 8, border: "1px solid rgba(52,211,153,0.3)" }}
            />
            <button
              onClick={onClearImage}
              style={{
                position: "absolute", top: -6, right: -6,
                width: 18, height: 18, borderRadius: "50%",
                background: "#ef4444", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X style={{ width: 10, height: 10, color: "#fff" }} />
            </button>
          </div>
        )}

        <div
          className="flex items-end gap-2 transition-all"
          style={{
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.03)",
            padding: "8px 8px 8px 14px",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
        >
          {/* Кнопка прикрепить изображение */}
          <button
            onClick={onAttachImage}
            title={t("chat.attachScreenshot")}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, background: pendingImage ? "rgba(52,211,153,0.15)" : "transparent",
              color: pendingImage ? "#34d399" : "#4b5563", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#34d399"; e.currentTarget.style.background = "rgba(52,211,153,0.1)"; }}
            onMouseLeave={(e) => {
              if (!pendingImage) { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.background = "transparent"; }
            }}
          >
            <Paperclip style={{ width: 14, height: 14 }} />
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={"Ask about AI, Vibe Coding..."}
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              color: "#f9fafb",
              fontSize: 13,
              resize: "none",
              outline: "none",
              border: "none",
              maxHeight: 120,
              lineHeight: 1.5,
              paddingTop: 2,
              paddingBottom: 2,
              scrollbarWidth: "none",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={(!input.trim() && !pendingImage) || isLoading}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "none",
              cursor: (input.trim() || pendingImage) && !isLoading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
              background: (input.trim() || pendingImage) && !isLoading
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "rgba(255,255,255,0.05)",
              boxShadow: (input.trim() || pendingImage) && !isLoading ? "0 2px 12px rgba(16,185,129,0.35)" : "none",
            }}
          >
            {isLoading
              ? <Loader2 style={{ width: 14, height: 14, color: "#6b7280", animation: "spin 1s linear infinite" }} />
              : <Send style={{ width: 14, height: 14, color: (input.trim() || pendingImage) ? "#fff" : "#4b5563" }} />}
          </button>
        </div>
        <p style={{ textAlign: "center", color: "#374151", fontSize: 10, marginTop: 8 }}>
          Powered by GPT-4o mini · Enter ↵ to send · 📎 attach screenshot
        </p>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export function ChatAssistant({ userContext }: ChatAssistantProps) {
  const { t } = useTranslation();
  const {
    messages, isOpen, isLoading, historyLoaded,
    prefillMessage,
    addMessage, updateLastAssistant,
    clearMessages, setMessages, setOpen, setLoading, setHistoryLoaded, setPrefillMessage,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isStreaming = useRef(false);

  // Load history from DB on first open
  useEffect(() => {
    if (isOpen && !historyLoaded) {
      fetch("/api/chat?limit=30")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setMessages(
              data.map((m: { id: string; role: string; content: string; createdAt: string }) => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
                createdAt: new Date(m.createdAt).getTime(),
              }))
            );
          }
          setHistoryLoaded(true);
        })
        .catch(() => setHistoryLoaded(true));
    }
  }, [isOpen, historyLoaded, setMessages, setHistoryLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  // Prefill из store (например, из кнопки "Спросить ментора" в практике)
  useEffect(() => {
    if (prefillMessage) {
      setOpen(true);
      setInput(prefillMessage);
      setPrefillMessage(null);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [prefillMessage, setOpen, setPrefillMessage]);

  // Загрузка изображения
  const handleImageFile = useCallback(async (file: File) => {
    const preview = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) return;
      const data = await res.json() as { fileUrl: string; fileName: string };
      setPendingImage({ fileUrl: data.fileUrl, preview, fileName: data.fileName });
    } catch {
      URL.revokeObjectURL(preview);
    }
  }, []);

  const handleAttachImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleClearImage = useCallback(() => {
    if (pendingImage) URL.revokeObjectURL(pendingImage.preview);
    setPendingImage(null);
  }, [pendingImage]);

  // Close fullscreen on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, setOpen]);

  const handleClearMessages = useCallback(async () => {
    clearMessages();
    await fetch("/api/chat", { method: "DELETE" }).catch(() => {});
  }, [clearMessages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if ((!trimmed && !pendingImage) || isStreaming.current) return;

    const imageToSend = pendingImage;
    setInput("");
    setPendingImage(null);
    if (imageToSend) URL.revokeObjectURL(imageToSend.preview);
    isStreaming.current = true;
    setLoading(true);

    const userMsgId = crypto.randomUUID();
    addMessage({ role: "user", content: trimmed, imageUrl: imageToSend?.preview } as Parameters<typeof addMessage>[0], userMsgId);
    addMessage({ role: "assistant", content: "" });

    const history = messages
      .filter((m) => m.content)
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: trimmed }],
          context: userContext,
          userMessageId: userMsgId,
          imageUrl: imageToSend?.fileUrl,
        }),
      });

      if (!res.ok || !res.body) {
        updateLastAssistant("Something went wrong. Please try again.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      // RAF batching: вместо setState на каждый байт — максимум 60 обновлений в секунду
      const pendingRef = { current: "", rafId: 0 };

      const flush = () => {
        updateLastAssistant(pendingRef.current);
        pendingRef.rafId = 0;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (pendingRef.rafId) cancelAnimationFrame(pendingRef.rafId);
          updateLastAssistant(accumulated);
          break;
        }
        accumulated += decoder.decode(value, { stream: true });
        pendingRef.current = accumulated;
        if (!pendingRef.rafId) {
          pendingRef.rafId = requestAnimationFrame(flush);
        }
      }
    } catch {
      updateLastAssistant("Connection error. Check your internet.");
    } finally {
      setLoading(false);
      isStreaming.current = false;
    }
  }, [messages, userContext, addMessage, updateLastAssistant, setLoading]);

  const sharedProps = {
    isFullscreen,
    onToggleFullscreen: () => setIsFullscreen((v) => !v),
    messages,
    isLoading,
    input,
    setInput,
    sendMessage,
    clearMessages: handleClearMessages,
    setOpen,
    inputRef,
    bottomRef,
    pendingImage,
    onAttachImage: handleAttachImage,
    onClearImage: handleClearImage,
  };

  return (
    <>
      {/* Скрытый инпут для загрузки изображений */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = "";
        }}
      />

      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
        style={{
          background: isOpen
            ? "#059669"
            : "linear-gradient(135deg, #10b981, #047857)",
          boxShadow: isOpen
            ? "0 4px 20px rgba(5,150,105,0.5)"
            : "0 8px 32px rgba(16,185,129,0.4)",
          transform: isOpen ? "scale(0.95)" : "scale(1)",
        }}
        onMouseEnter={(e) => !isOpen && (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = isOpen ? "scale(0.95)" : "scale(1)")}
      >
        {isOpen ? (
          <X style={{ width: 22, height: 22, color: "#fff" }} />
        ) : (
          <div className="relative">
            <Bot style={{ width: 24, height: 24, color: "#fff" }} />
            <span
              className="absolute -top-1 -right-1 animate-pulse"
              style={{ width: 10, height: 10, background: "#6ee7b7", borderRadius: "50%", display: "block", border: "2px solid #047857" }}
            />
          </div>
        )}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-2xl animate-ping"
            style={{ background: "rgba(52,211,153,0.25)" }}
          />
        )}
      </button>

      {/* ── Fullscreen overlay ── */}
      {isOpen && isFullscreen && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full h-full max-w-4xl max-h-[90vh] mx-4"
            style={{
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
              boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(52,211,153,0.1)",
              background: "#070810",
              animation: "scaleIn 0.2s ease-out",
            }}
          >
            <ChatUI {...sharedProps} />
          </div>
        </div>
      )}

      {/* ── Popup panel ── */}
      {!isFullscreen && (
        <div
          className="fixed bottom-20 right-6 z-[55]"
          style={{
            width: 400,
            maxWidth: "calc(100vw - 1.5rem)",
            height: "min(580px, calc(100vh - 96px))",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(52,211,153,0.08)",
            background: "#070810",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            transformOrigin: "bottom right",
            transform: isOpen ? "scale(1) translateY(0)" : "scale(0.9) translateY(16px)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          <ChatUI {...sharedProps} />
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
