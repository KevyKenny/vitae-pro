"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type IllustrationContainerProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "emerald" | "gold";
};

const tones = {
  paper: "bg-paper-dim border-line",
  emerald: "bg-emerald-wash border-emerald/15",
  gold: "bg-gold-wash border-gold/20",
};

export function IllustrationContainer({
  children,
  className,
  tone = "paper",
}: IllustrationContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex aspect-square max-h-64 w-full max-w-64 items-center justify-center overflow-hidden rounded-[22px] border shadow-m",
        tones[tone],
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 15%, rgba(47,122,92,0.12), transparent 40%), radial-gradient(circle at 15% 85%, rgba(176,141,62,0.14), transparent 42%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
