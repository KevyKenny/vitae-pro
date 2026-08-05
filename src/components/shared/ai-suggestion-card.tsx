"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AISuggestion } from "@/types";

type AISuggestionCardProps = {
  suggestion: AISuggestion;
  onAction?: (id: string) => void;
  className?: string;
};

const severityDot: Record<AISuggestion["severity"], string> = {
  info: "bg-emerald-bright",
  improve: "bg-gold",
  critical: "bg-destructive",
};

export function AISuggestionCard({
  suggestion,
  onAction,
  className,
}: AISuggestionCardProps) {
  return (
    <motion.article
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex gap-3 border-b border-line py-3.5 last:border-b-0",
        className,
      )}
    >
      <span
        className={cn(
          "mt-1.5 size-[7px] shrink-0 rounded-full",
          severityDot[suggestion.severity],
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-[0.86rem] leading-snug text-ink">
          <span className="font-semibold">{suggestion.title}</span>
          <span className="text-ink-soft"> — {suggestion.body}</span>
        </p>
        <button
          type="button"
          className="mt-1 block text-[0.78rem] font-semibold text-emerald hover:underline"
          onClick={() => onAction?.(suggestion.id)}
        >
          {suggestion.ctaLabel}
        </button>
      </div>
      {onAction ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="hidden shrink-0 sm:inline-flex"
          onClick={() => onAction(suggestion.id)}
        >
          Apply
        </Button>
      ) : null}
    </motion.article>
  );
}
