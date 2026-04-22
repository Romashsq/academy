"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface Props {
  userId: string;
  name: string;
}

export function PublicProfileShareButton({ userId, name }: Props) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${userId}`;
    const text = `${name} is learning AI development on VibeCode Academy! 🚀 ${url}`;

    if (navigator.share) {
      await navigator.share({ title: `${name} — VibeCode Academy`, url });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-lime-400" />
          {t("certificate.copied")}
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          Share
        </>
      )}
    </button>
  );
}
