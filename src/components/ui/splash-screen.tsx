"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export function SplashScreen() {
  // true on both SSR and client — splash is in the initial HTML, shows immediately.
  // Zustand hydration issues are now fixed via skipHydration + StoreHydration.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 1, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030712]"
        >
          {/* Ambient glow — один, чистый */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-[360px] h-[360px] rounded-full bg-lime-500/15 blur-[100px] pointer-events-none"
          />

          {/* Центральный блок */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* Иконка */}
            <div className="relative">
              {/* Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="absolute inset-[-8px] rounded-[22px] border border-lime-500/20"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center shadow-[0_0_32px_rgba(132,204,22,0.45)]"
              >
                <Zap className="w-9 h-9 text-black" strokeWidth={2.5} />
              </motion.div>
            </div>

            {/* Текст */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.22 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="font-syne font-bold text-[28px] text-white tracking-tight leading-none">
                VibeCode Academy
              </span>
              <span className="text-lime-400/70 text-[11px] font-medium tracking-[0.22em] uppercase">
                Learn · Build · Ship
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
