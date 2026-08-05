"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  icon?: React.ReactNode;
};

export function FeatureCard({
  title,
  description,
  selected = false,
  onSelect,
  className,
  icon,
}: FeatureCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-[14px] border bg-surface p-5 text-left transition-all duration-150",
        selected
          ? "border-emerald bg-emerald-wash shadow-m"
          : "border-line hover:border-emerald hover:shadow-s",
        className,
      )}
    >
      {icon ? (
        <div className="mb-3 flex size-10 items-center justify-center rounded-[10px] bg-paper-dim text-emerald">
          {icon}
        </div>
      ) : null}
      <p className="font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
      ) : null}
    </motion.button>
  );
}
