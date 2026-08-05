"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PreferenceCard({
  title,
  description,
  selected,
  onClick,
  children,
  className,
}: {
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-[14px] border p-4 text-left transition-colors",
        selected
          ? "border-emerald bg-emerald-wash shadow-s"
          : "border-line-strong bg-surface hover:border-emerald/40",
        className,
      )}
    >
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1 text-[0.78rem] leading-snug text-ink-soft">
          {description}
        </p>
      ) : null}
      {children}
    </motion.button>
  );
}

export function RadioCard({
  title,
  description,
  selected,
  onSelect,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <PreferenceCard
      title={title}
      description={description}
      selected={selected}
      onClick={onSelect}
    />
  );
}
