"use client";

import { ChatAssistant } from "./chat-assistant";
import { useSession } from "next-auth/react";
import { calculateLevel } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";

interface Props {
  totalXP?: number;
  currentStreak?: number;
}

export function ChatWrapper({ totalXP = 0, currentStreak = 0 }: Props) {
  const { data: session } = useSession();
  const { lessonContext } = useChatStore();
  if (!session) return null;

  const { level, title } = calculateLevel(totalXP);

  const base = `User: ${session.user?.name ?? "Student"} | Level: ${level} (${title}) | XP: ${totalXP} | Streak: ${currentStreak} days`;
  const context = lessonContext ? `${base} | ${lessonContext}` : base;

  return <ChatAssistant userContext={context} />;
}
