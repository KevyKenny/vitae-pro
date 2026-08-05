"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type SuccessAnimationProps = {
  className?: string;
  size?: "md" | "lg";
};

export function SuccessAnimation({
  className,
  size = "lg",
}: SuccessAnimationProps) {
  const dim = size === "lg" ? "size-20" : "size-14";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.span
        className={cn(
          "absolute rounded-full bg-emerald-wash",
          size === "lg" ? "size-28" : "size-20",
        )}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.span
        className={cn(
          "relative flex items-center justify-center rounded-full bg-emerald text-paper shadow-m",
          dim,
        )}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 18 }}
      >
        <motion.span
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Check className={size === "lg" ? "size-10" : "size-7"} strokeWidth={2.5} />
        </motion.span>
      </motion.span>
    </div>
  );
}
