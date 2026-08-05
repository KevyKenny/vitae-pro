"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CoverLetterSuggestion } from "@/features/cover-letter/types";

export function SuggestionCard({
  suggestion,
  onApply,
  onDismiss,
  onSave,
}: {
  suggestion: CoverLetterSuggestion;
  onApply: () => void;
  onDismiss: () => void;
  onSave?: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="rounded-[12px] border border-line-strong bg-surface p-3.5 shadow-s"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{suggestion.title}</h3>
        <Badge variant="gold">{suggestion.impact}</Badge>
      </div>
      <p className="mt-1.5 text-[0.82rem] leading-relaxed text-ink-soft">
        {suggestion.body}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="sm"
          shape="soft"
          className="h-7 rounded-[8px] px-2.5 text-[0.74rem]"
          onClick={onApply}
        >
          <Check className="size-3.5" />
          Apply
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          shape="soft"
          className="h-7 rounded-[8px] px-2.5 text-[0.74rem]"
          onClick={onDismiss}
        >
          <X className="size-3.5" />
          Dismiss
        </Button>
        {onSave ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            shape="soft"
            className="h-7 rounded-[8px] px-2.5 text-[0.74rem]"
            onClick={onSave}
          >
            Save
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
}
