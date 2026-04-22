"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Star, Trophy } from "lucide-react";

interface Props {
  level: number;
  levelTitle: string;
  onClose: () => void;
}

const LEVEL_ICONS: Record<number, typeof Zap> = {
  1: Zap,
  2: Star,
  3: Star,
  4: Trophy,
  5: Trophy,
};

export function LevelUpOverlay({ level, levelTitle, onClose }: Props) {
  const Icon = LEVEL_ICONS[level] ?? Star;

  // Auto-dismiss after 3.5s
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="level-up"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      >
        {/* Outer glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.6, 0.3], scale: [0.3, 1.2, 1] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-[500px] h-[500px] rounded-full bg-lime-500/20 blur-[100px] pointer-events-none"
        />

        {/* Sparks */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: Math.cos((i / 8) * Math.PI * 2) * 140,
              y: Math.sin((i / 8) * Math.PI * 2) * 140,
            }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.04, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-lime-400 pointer-events-none"
          />
        ))}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative flex flex-col items-center gap-5 bg-[#0d1117] border border-lime-500/30 rounded-3xl px-10 py-8 shadow-[0_0_80px_20px_rgba(132,204,22,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Badge "Level up!" */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="absolute -top-4 bg-lime-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
          >
            Level Up!
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-700 flex items-center justify-center shadow-[0_0_40px_8px_rgba(132,204,22,0.4)]"
          >
            <Icon className="w-10 h-10 text-black" strokeWidth={2.5} />
          </motion.div>

          {/* Level number */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm mb-1">New Level</p>
            <p className="font-syne font-bold text-5xl text-white leading-none">{level}</p>
            <p className="text-lime-400 font-semibold text-lg mt-1">{levelTitle}</p>
          </motion.div>

          {/* Stars row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-1"
          >
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < level ? "text-lime-400 fill-lime-400" : "text-gray-700 fill-gray-700"}`}
              />
            ))}
          </motion.div>

          {/* Dismiss hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
            className="text-gray-600 text-xs"
          >
            Click to continue
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
