"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type MultiSelectCardProps = {
  title: string;
  description?: string;
  selected?: boolean;
  onToggle?: () => void;
  className?: string;
};

export function MultiSelectCard({
  title,
  description,
  selected = false,
  onToggle,
  className,
}: MultiSelectCardProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "relative rounded-[14px] border bg-surface p-4 text-left transition-all duration-150",
        "hover:border-emerald hover:bg-emerald-wash/40 hover:shadow-s",
        selected
          ? "border-emerald bg-emerald-wash shadow-[0_0_0_3px_var(--emerald-wash)]"
          : "border-line",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-3 right-3 flex size-5 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-emerald bg-emerald text-paper"
            : "border-line-strong bg-surface text-transparent",
        )}
        aria-hidden
      >
        <Check className="size-3 stroke-[3]" />
      </span>
      <p className="pr-7 text-sm font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
    </motion.button>
  );
}
