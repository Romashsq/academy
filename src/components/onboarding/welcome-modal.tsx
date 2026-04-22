"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Flame, BookOpen, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY = "vc_onboarded";

const STEP_META = [
  { icon: Zap,   iconColor: "from-lime-400 to-lime-600",   glowColor: "bg-lime-500/20"   },
  { icon: Zap,   iconColor: "from-yellow-400 to-orange-500", glowColor: "bg-yellow-500/20" },
  { icon: Flame, iconColor: "from-orange-400 to-red-500",  glowColor: "bg-orange-500/20" },
];

interface Props {
  firstLessonId?: string;
}

export function WelcomeModal({ firstLessonId }: Props) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();

  const STEPS = [
    { ...STEP_META[0], title: t("onboarding.step1Title"), description: t("onboarding.step1Desc"), hint: t("onboarding.step1Hint") },
    { ...STEP_META[1], title: t("onboarding.step2Title"), description: t("onboarding.step2Desc"), hint: t("onboarding.step2Hint") },
    { ...STEP_META[2], title: t("onboarding.step3Title"), description: t("onboarding.step3Desc"), hint: t("onboarding.step3Hint") },
  ];

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Small delay so the page renders first
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
      }
    } catch { /* private browsing — skip modal */ }
  }, []);

  const close = (goToLesson = false) => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    setVisible(false);
    if (goToLesson && firstLessonId) {
      router.push(`/lessons/${firstLessonId}`);
    }
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#0d1117] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={() => close(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step dots */}
            <div className="flex items-center gap-1.5 mb-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-lime-500" : i < step ? "w-3 bg-lime-500/40" : "w-3 bg-white/10"
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="relative mb-6">
              <div className={`absolute inset-0 rounded-full ${current.glowColor} blur-2xl scale-150 opacity-60`} />
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${current.iconColor} flex items-center justify-center`}>
                <Icon className="w-7 h-7 text-black" strokeWidth={2.5} />
              </div>
            </div>

            {/* Text */}
            <h2 className="font-syne font-bold text-xl text-white mb-3 leading-snug">
              {current.title}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {current.description}
            </p>

            {/* Hint chip */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-500 mb-6">
              <BookOpen className="w-3 h-3" />
              {current.hint}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {t("onboarding.back")}
                </button>
              ) : (
                <span />
              )}

              {isLast ? (
                <Button
                  onClick={() => close(true)}
                  className="gap-2 flex-1"
                >
                  {t("onboarding.startFirstLesson")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  className="gap-2"
                >
                  {t("onboarding.next")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
