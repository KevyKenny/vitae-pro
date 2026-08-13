"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { cn } from "@/lib/utils";

export function AISuggestionCard({ compact = false }: { compact?: boolean }) {
  const {
    aiSuggestion,
    applyAiSuggestion,
    discardAiSuggestion,
    regenerateAi,
  } = useEditor();

  const suggestionLines =
    aiSuggestion?.suggestion
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean) ?? [];

  return (
    <AnimatePresence>
      {aiSuggestion ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className={cn(
            "overflow-hidden rounded-[14px] border border-line-strong bg-surface shadow-l",
            compact && "shadow-none",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
              <span className="size-1.5 rounded-full bg-gold" aria-hidden />
              AI Suggestion · {aiSuggestion.action}
            </p>
            {!compact ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                shape="soft"
                aria-label="Close suggestion"
                onClick={discardAiSuggestion}
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
          <div className="space-y-3 p-4">
            {aiSuggestion.original ? (
              <div>
                <p className="mb-1 text-[0.7rem] font-semibold text-ink-faint uppercase">
                  Original
                </p>
                <p className="whitespace-pre-wrap text-sm text-ink-soft line-through decoration-line-strong/80">
                  {aiSuggestion.original}
                </p>
              </div>
            ) : null}
            <div>
              <p className="mb-1 text-[0.7rem] font-semibold text-ink-faint uppercase">
                Suggestion
              </p>
              {suggestionLines.length > 1 ? (
                <ul className="space-y-2 rounded-[8px] bg-emerald-wash p-3 text-sm leading-relaxed text-ink">
                  {suggestionLines.map((line, index) => (
                    <li key={`${index}-${line.slice(0, 24)}`} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden />
                      <span>{line.replace(/^[-•*]\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="whitespace-pre-wrap rounded-[8px] bg-emerald-wash p-3 text-sm leading-relaxed text-ink">
                  {aiSuggestion.suggestion}
                </p>
              )}
            </div>
            <p className="text-[0.78rem] leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">Why: </span>
              {aiSuggestion.explanation}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                Confidence {Math.round(aiSuggestion.confidence * 100)}%
              </Badge>
              <Badge variant="default">{aiSuggestion.sectionType}</Badge>
            </div>
          </div>
          {!compact ? (
            <div className="flex gap-2 border-t border-line p-3">
              <Button
                type="button"
                variant="outline"
                shape="soft"
                className="flex-1 rounded-[8px]"
                onClick={regenerateAi}
              >
                Regenerate
              </Button>
              <Button
                type="button"
                shape="soft"
                className="flex-1 rounded-[8px]"
                onClick={applyAiSuggestion}
              >
                Accept
              </Button>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
