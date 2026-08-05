"use client";

import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { AIGenerationProgress } from "@/features/cover-letter/components/ai-generation-progress";
import { CoverLetterScore } from "@/features/cover-letter/components/cover-letter-score";
import { SuggestionCard } from "@/features/cover-letter/components/suggestion-card";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import type { LetterSectionKey } from "@/features/cover-letter/types";
import { cn } from "@/lib/utils";

const SECTIONS: {
  key: LetterSectionKey;
  label: string;
  rows: number;
}[] = [
  { key: "greeting", label: "Greeting", rows: 1 },
  { key: "opening", label: "Opening paragraph", rows: 3 },
  { key: "experience", label: "Experience paragraph", rows: 4 },
  { key: "skills", label: "Skills paragraph", rows: 3 },
  { key: "closing", label: "Closing paragraph", rows: 3 },
  { key: "signature", label: "Signature", rows: 2 },
];

const AI_ACTIONS = [
  "Improve",
  "Rewrite",
  "Make More Persuasive",
  "Shorten",
  "Expand",
  "Make More Professional",
  "Match Job Description",
];

export function CoverLetterEditor() {
  const {
    document,
    updateBodySection,
    setActiveSection,
    activeSection,
    requestAi,
    generating,
    generationStepIndex,
    applySuggestion,
    dismissSuggestion,
    setAiOpen,
  } = useCoverLetter();

  const fullText = [
    document.body.greeting,
    document.body.opening,
    document.body.experience,
    document.body.skills,
    document.body.closing,
    document.body.signature,
  ]
    .filter(Boolean)
    .join("\n\n");
  const words = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const chars = fullText.length;
  const isEmpty =
    !document.body.opening &&
    !document.body.experience &&
    !document.body.skills;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-paper-dim/40">
      <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5 pb-28 md:px-8 md:py-7">
        <AIGenerationProgress
          active={generating}
          stepIndex={Math.max(0, generationStepIndex)}
        />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">
              Letter workspace
            </h2>
            <p className="text-sm text-ink-soft">
              Edit each section. AI actions open contextual suggestions.
            </p>
          </div>
          <p className="font-mono text-[0.72rem] text-ink-faint">
            {words} words · {chars} chars
          </p>
        </div>

        {isEmpty && !generating ? (
          <EmptyState
            icon={Mail}
            title="No letter draft yet"
            description="Fill in the job details on the left, then generate a personalized draft."
            actionLabel="Focus job form"
            onAction={() => toast.message("Add job details in the left panel")}
            className="bg-surface"
          />
        ) : null}

        <div className="space-y-3 rounded-[14px] border border-line-strong bg-surface p-4 shadow-s">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Header
          </p>
          <p className="font-serif text-lg font-semibold text-ink">
            {document.body.headerName}
          </p>
          <p className="text-sm text-ink-faint">{document.body.headerMeta}</p>
          <p className="text-sm text-ink-soft">{document.body.date}</p>
        </div>

        {SECTIONS.map((section) => {
          const active = activeSection === section.key;
          return (
            <div
              key={section.key}
              className={cn(
                "rounded-[14px] border bg-surface p-4 shadow-s transition-colors",
                active ? "border-emerald" : "border-line-strong",
              )}
              onFocusCapture={() => setActiveSection(section.key)}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
                  {section.label}
                </p>
                <button
                  type="button"
                  className="text-[0.72rem] font-semibold text-emerald"
                  onClick={() => {
                    setActiveSection(section.key);
                    setAiOpen(true);
                  }}
                >
                  Open AI
                </button>
              </div>
              <div className="mb-2 flex flex-wrap gap-1">
                {AI_ACTIONS.map((action) => (
                  <AIActionButton
                    key={action}
                    label={action}
                    onClick={() => requestAi(action, section.key)}
                  />
                ))}
              </div>
              <Textarea
                value={document.body[section.key]}
                onChange={(e) => updateBodySection(section.key, e.target.value)}
                rows={section.rows}
                className="bg-paper"
                aria-label={section.label}
              />
            </div>
          );
        })}

        <CoverLetterScore score={document.score} />

        {document.suggestions.length ? (
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-semibold text-ink">
              AI recommendations
            </h3>
            <AnimatePresence>
              {document.suggestions.map((s) => (
                <SuggestionCard
                  key={s.id}
                  suggestion={s}
                  onApply={() => applySuggestion(s)}
                  onDismiss={() => dismissSuggestion(s.id)}
                  onSave={() => toast.success("Suggestion saved for later")}
                />
              ))}
            </AnimatePresence>
          </section>
        ) : null}
      </div>
    </div>
  );
}
