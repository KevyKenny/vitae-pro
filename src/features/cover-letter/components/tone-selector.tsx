"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Code2,
  Crown,
  Heart,
  Palette,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toneOptions } from "@/mocks/cover-letter-builder";
import type { LetterTone } from "@/features/cover-letter/types";

const ICONS: Record<string, LucideIcon> = {
  Briefcase,
  Zap,
  Heart,
  Crown,
  Palette,
  Code2,
};

export function ToneSelector({
  value,
  onChange,
}: {
  value: LetterTone;
  onChange: (tone: LetterTone) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {toneOptions.map((tone) => {
        const Icon = ICONS[tone.icon] ?? Briefcase;
        const selected = value === tone.id;
        return (
          <motion.button
            key={tone.id}
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(tone.id)}
            aria-pressed={selected}
            className={cn(
              "rounded-[14px] border p-3 text-left transition-colors sm:p-3.5",
              selected
                ? "border-emerald bg-emerald-wash shadow-s"
                : "border-line-strong bg-surface hover:border-emerald/40",
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-[8px] sm:size-8",
                  selected ? "bg-emerald text-paper" : "bg-paper-dim text-emerald",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{tone.label}</p>
                <p className="mt-0.5 text-[0.74rem] leading-snug text-ink-soft">
                  {tone.description}
                </p>
                <p className="mt-2 font-serif text-[0.78rem] italic text-ink-faint">
                  “{tone.example}”
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
