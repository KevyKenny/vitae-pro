"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LETTER_PANE_LABELS } from "@/features/cover-letter/components/letter-section-navigator";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";

export function AIWritingPanel() {
  const {
    aiSuggestion,
    applyAiSuggestion,
    discardAiSuggestion,
    regenerateAi,
    setAiOpen,
    document,
    activeSection,
  } = useCoverLetter();

  return (
    <motion.aside
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="flex h-full w-full flex-col border-l border-line bg-surface shadow-l"
      aria-label="AI writing assistant"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
            AI Writing Assistant
          </p>
          <p className="text-sm text-ink-soft">
            Section:{" "}
            <span className="font-semibold text-ink">
              {activeSection
                ? LETTER_PANE_LABELS[activeSection]
                : "—"}
            </span>
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          aria-label="Close AI panel"
          onClick={() => {
            setAiOpen(false);
            discardAiSuggestion();
          }}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="rounded-[12px] bg-paper-dim/80 p-3 text-sm text-ink-soft">
          Contextual to{" "}
          <strong className="text-ink">
            {document.job.jobTitle || "this role"}
          </strong>{" "}
          at{" "}
          <strong className="text-ink">
            {document.job.companyName || "this company"}
          </strong>
          . Tone: {document.tone}.
        </div>

        {aiSuggestion ? (
          <div className="overflow-hidden rounded-[14px] border border-line-strong shadow-s">
            <div className="border-b border-line px-3 py-2">
              <p className="text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
                {aiSuggestion.action}
              </p>
            </div>
            <div className="space-y-3 p-3">
              <div>
                <p className="mb-1 text-[0.68rem] font-semibold text-ink-faint uppercase">
                  Current
                </p>
                <p className="text-sm text-ink-soft line-through decoration-line-strong/70">
                  {aiSuggestion.original || "Empty"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[0.68rem] font-semibold text-ink-faint uppercase">
                  Suggested
                </p>
                <p className="rounded-[8px] bg-emerald-wash p-3 text-sm leading-relaxed text-ink">
                  {aiSuggestion.suggestion}
                </p>
              </div>
              <p className="text-[0.78rem] text-ink-soft">
                <span className="font-semibold text-ink">Why: </span>
                {aiSuggestion.explanation}
              </p>
              <Badge variant="outline">
                Confidence {Math.round(aiSuggestion.confidence * 100)}%
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line p-3">
              <Button
                type="button"
                variant="outline"
                shape="soft"
                size="sm"
                className="rounded-[8px]"
                onClick={discardAiSuggestion}
              >
                Reject
              </Button>
              <Button
                type="button"
                variant="outline"
                shape="soft"
                size="sm"
                className="rounded-[8px]"
                onClick={regenerateAi}
              >
                Regenerate
              </Button>
              <Button
                type="button"
                variant="outline"
                shape="soft"
                size="sm"
                className="rounded-[8px]"
                onClick={() =>
                  toast.message("Compare", {
                    description: `Original ${aiSuggestion.original.length} chars → Suggested ${aiSuggestion.suggestion.length} chars`,
                  })
                }
              >
                Compare
              </Button>
              <Button
                type="button"
                shape="soft"
                size="sm"
                className="rounded-[8px]"
                onClick={applyAiSuggestion}
              >
                Accept
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-soft">
            Choose an AI action on a paragraph. Suggestions appear here for you
            to accept or reject — they never replace your writing automatically.
          </p>
        )}
      </div>
    </motion.aside>
  );
}
