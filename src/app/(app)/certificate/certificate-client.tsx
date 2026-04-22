"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Award, Star, Zap, Share2, Download, Check, ExternalLink,
  BookOpen, Trophy, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatXP } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface Props {
  name: string;
  completedCount: number;
  totalCount: number;
  totalXP: number;
  level: number;
  levelTitle: string;
  certId: string;
  userId: string;
}

const LEVEL_COLORS: Record<number, { gradient: string; text: string }> = {
  1: { gradient: "from-gray-500 to-gray-700", text: "text-gray-400" },
  2: { gradient: "from-blue-500 to-blue-700", text: "text-blue-400" },
  3: { gradient: "from-violet-500 to-violet-700", text: "text-violet-400" },
  4: { gradient: "from-orange-500 to-orange-700", text: "text-orange-400" },
  5: { gradient: "from-lime-400 to-lime-600", text: "text-lime-400" },
};

export function CertificateClient({
  name, completedCount, totalCount, totalXP, level, levelTitle, certId, userId
}: Props) {
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isComplete = completedCount >= totalCount && totalCount > 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const colors = LEVEL_COLORS[level] ?? LEVEL_COLORS[1];

  const shareProfile = async () => {
    const url = `${window.location.origin}/u/${userId}`;
    const text = `${t("certificate.shareText").replace("{xp}", formatXP(totalXP))} ${url}`;
    if (navigator.share) {
      await navigator.share({ title: t("certificate.shareTitle"), url });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">

      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t("certificate.backToDashboard")}
      </Link>

      {/* Certificate card */}
      <div
        ref={certRef}
        className="relative overflow-hidden rounded-3xl border-2 border-lime-500/30 bg-[#0a0f1a] p-8"
      >
        {/* Decorative glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-lime-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-lime-500/5 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 mb-4 shadow-[0_0_40px_8px_rgba(132,204,22,0.3)]">
            <Award className="w-8 h-8 text-black" strokeWidth={2} />
          </div>
          <p className="text-lime-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">
            VibeCode Academy
          </p>
          <h1 className="font-syne font-bold text-2xl text-white">
            {isComplete ? t("certificate.completion") : t("certificate.participation")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t("certificate.courseName")}</p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-lime-500/20" />
          <Star className="w-4 h-4 text-lime-500/40" />
          <div className="flex-1 h-px bg-lime-500/20" />
        </div>

        {/* Name */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-2">{t("certificate.certifiedThat")}</p>
          <p className={`font-syne font-bold text-3xl bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            {name}
          </p>
          <p className="text-gray-400 text-sm mt-3">
            {isComplete
              ? t("certificate.completedFull")
              : t("certificate.completedPartial").replace("{completed}", String(completedCount)).replace("{total}", String(totalCount))}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: BookOpen, label: t("certificate.statLessons"), value: `${completedCount}/${totalCount}` },
            { icon: Zap, label: t("certificate.statXP"), value: `${formatXP(totalXP)} XP` },
            { icon: Trophy, label: t("certificate.statLevel"), value: `${level} — ${levelTitle}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center bg-white/5 rounded-2xl p-3">
              <Icon className="w-4 h-4 text-lime-400 mx-auto mb-1.5" />
              <p className="text-white font-semibold text-sm">{value}</p>
              <p className="text-gray-600 text-[11px] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
            <span>{t("certificate.courseProgress")}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-500 to-lime-400 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-700">
          <span>ID: {certId}</span>
          <span>{new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={shareProfile} className="gap-2 flex-1">
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              {t("certificate.copied")}
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              {t("certificate.shareLinkedIn")}
            </>
          )}
        </Button>

        <Link href={`/u/${userId}`} target="_blank">
          <Button variant="ghost" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            {t("certificate.publicProfile")}
          </Button>
        </Link>
      </div>

      {/* CTA if not complete */}
      {!isComplete && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
          <p className="text-gray-400 text-sm mb-3">
            {t("certificate.completeAll").replace("{n}", String(totalCount))}
          </p>
          <Link href="/courses">
            <Button className="gap-2">
              <BookOpen className="w-4 h-4" />
              {t("certificate.continueLearning")}
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}
