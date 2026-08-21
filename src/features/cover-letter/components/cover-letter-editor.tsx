"use client";

import { useState } from "react";
import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import { AIGenerationProgress } from "@/features/cover-letter/components/ai-generation-progress";
import { CandidateProfileCard } from "@/features/cover-letter/components/candidate-profile-card";
import { JobInformationForm } from "@/features/cover-letter/components/job-information-form";
import { LengthSelector } from "@/features/cover-letter/components/length-selector";
import { ToneSelector } from "@/features/cover-letter/components/tone-selector";
import { SuggestionCard } from "@/features/cover-letter/components/suggestion-card";
import { LETTER_PANE_LABELS } from "@/features/cover-letter/components/letter-section-navigator";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimatePresence } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import {
  isLetterSectionKey,
  letterHasDraft,
  type LetterSectionKey,
} from "@/features/cover-letter/types";
import { toast } from "sonner";
import type { SectionSaveStatus } from "@/features/cv-editor/hooks/use-section-save";

const SECTION_META: Record<
  LetterSectionKey,
  { rows: number; placeholder: string }
> = {
  greeting: { rows: 2, placeholder: "Dear Hiring Manager," },
  opening: {
    rows: 5,
    placeholder: "Introduce yourself and why you want this role…",
  },
  experience: {
    rows: 6,
    placeholder: "Share the experience that best matches this job…",
  },
  skills: {
    rows: 5,
    placeholder: "Connect your skills to what the posting asks for…",
  },
  closing: { rows: 4, placeholder: "Close with a clear next step…" },
  signature: { rows: 3, placeholder: "Kind regards,\nYour name" },
};

const AI_ACTIONS: Array<{ label: string; action: string }> = [
  { label: "Improve with AI", action: "Improve" },
  { label: "Make more professional", action: "Make More Professional" },
  { label: "Make more concise", action: "Shorten" },
  { label: "Make more persuasive", action: "Make More Persuasive" },
  { label: "Tailor to this job", action: "Match Job Description" },
];

export function CoverLetterEditor() {
  const {
    document,
    activePane,
    setActivePane,
    updateBodySection,
    requestAi,
    generating,
    generationStepIndex,
    applySuggestion,
    dismissSuggestion,
    aiSuggestion,
    aiOpen,
    aiLoading,
    pendingGeneratedBody,
    applyGeneratedLetter,
    discardGeneratedLetter,
    generateLetter,
    saveStatus,
    retrySave,
  } = useCoverLetter();
  const [startedWriting, setStartedWriting] = useState(false);

  const emptyDraft = !letterHasDraft(document.body);
  const saveBarStatus: SectionSaveStatus =
    saveStatus === "saving"
      ? "saving"
      : saveStatus === "failed"
        ? "error"
        : saveStatus === "saved"
          ? "saved"
          : "idle";
  const dirty = saveStatus === "unsaved" || saveStatus === "failed";

  return (
    <div
      id="letter-editor-scroll"
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface"
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-none flex-col">
          <div className="space-y-4 px-4 pt-4 sm:px-6 sm:pt-5">
            <AIGenerationProgress
              active={generating}
              stepIndex={Math.max(0, generationStepIndex)}
            />

            {aiLoading ? (
              <p
                className="rounded-[10px] border border-line bg-emerald-wash/50 px-3 py-2 text-sm text-ink-soft"
                aria-live="polite"
              >
                Generating AI suggestion…
              </p>
            ) : null}

            {pendingGeneratedBody ? (
              <PendingGenerationCard
                onApply={applyGeneratedLetter}
                onDiscard={discardGeneratedLetter}
                preview={
                  pendingGeneratedBody.opening ||
                  pendingGeneratedBody.greeting ||
                  ""
                }
              />
            ) : null}

            {aiSuggestion && !aiOpen ? <CoverLetterAiCard /> : null}
          </div>

          {activePane === "job" ? (
            <JobInformationForm embedded />
          ) : activePane === "applicant" ? (
            <ApplicantPane
              saveBarStatus={saveBarStatus}
              dirty={dirty}
              onSave={retrySave}
            />
          ) : activePane === "style" ? (
            <StylePane
              saveBarStatus={saveBarStatus}
              dirty={dirty}
              onSave={retrySave}
            />
          ) : isLetterSectionKey(activePane) ? (
            emptyDraft && !generating && !startedWriting ? (
              <div className="px-4 py-6 sm:px-7 sm:py-8">
                <EmptyState
                  icon={Mail}
                  title="Start your cover letter"
                  description="Generate a first draft from the job details, or write it yourself. AI never replaces your text until you accept a suggestion."
                  actionLabel="Create with AI"
                  onAction={() => {
                    if (
                      !document.job.jobDescription.trim() &&
                      !document.job.companyName
                    ) {
                      setActivePane("job");
                      toast.message("Add job details first");
                      return;
                    }
                    generateLetter();
                  }}
                  secondaryLabel="Start writing"
                  onSecondary={() => {
                    setStartedWriting(true);
                    setActivePane("opening");
                  }}
                  className="bg-paper"
                />
              </div>
            ) : (
              <BodySectionPane
                sectionKey={activePane}
                value={document.body[activePane]}
                onChange={(value) => updateBodySection(activePane, value)}
                onAi={(action) => requestAi(action, activePane)}
                aiBusy={aiLoading || generating}
                saveStatus={saveBarStatus}
                dirty={dirty}
                onSave={retrySave}
              />
            )
          ) : null}

          {document.suggestions.length && isLetterSectionKey(activePane) ? (
            <section className="space-y-3 px-4 pb-6 sm:px-7">
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
    </div>
  );
}

function ApplicantPane({
  saveBarStatus,
  dirty,
  onSave,
}: {
  saveBarStatus: SectionSaveStatus;
  dirty: boolean;
  onSave: () => void;
}) {
  const { document, updateDocument } = useCoverLetter();
  return (
    <section className="px-5 py-5 sm:px-7 sm:py-6">
      <PaneHeading
        title="Applicant information"
        description="This header appears at the top of your letter."
      />
      <div className="mt-5 grid gap-4">
        <Field label="Full name" htmlFor="letter-header-name">
          <Input
            id="letter-header-name"
            value={document.body.headerName}
            onChange={(e) =>
              updateDocument((prev) => ({
                ...prev,
                body: { ...prev.body, headerName: e.target.value },
              }))
            }
            placeholder="Kennedy Sithole"
            className="h-11"
          />
        </Field>
        <Field label="Contact line" htmlFor="letter-header-meta">
          <Input
            id="letter-header-meta"
            value={document.body.headerMeta}
            onChange={(e) =>
              updateDocument((prev) => ({
                ...prev,
                body: { ...prev.body, headerMeta: e.target.value },
              }))
            }
            placeholder="email · phone · city"
            className="h-11"
          />
        </Field>
        <Field label="Date" htmlFor="letter-date">
          <Input
            id="letter-date"
            value={document.body.date}
            onChange={(e) =>
              updateDocument((prev) => ({
                ...prev,
                body: { ...prev.body, date: e.target.value },
              }))
            }
            placeholder="21 August 2026"
            className="h-11"
          />
        </Field>
      </div>
      <div className="mt-6">
        <CandidateProfileCard />
      </div>
      <SectionSaveBar
        dirty={dirty}
        status={saveBarStatus}
        onSave={onSave}
        label="Save letter"
      />
    </section>
  );
}

function StylePane({
  saveBarStatus,
  dirty,
  onSave,
}: {
  saveBarStatus: SectionSaveStatus;
  dirty: boolean;
  onSave: () => void;
}) {
  const { document, updateDocument } = useCoverLetter();
  return (
    <section className="px-5 py-5 sm:px-7 sm:py-6">
      <PaneHeading
        title="Tone & length"
        description="These settings guide AI writing. They don’t rewrite your letter on their own."
      />
      <div className="mt-5 space-y-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Tone
          </p>
          <ToneSelector
            value={document.tone}
            onChange={(tone) => updateDocument((prev) => ({ ...prev, tone }))}
          />
        </div>
        <div className="space-y-2">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Length
          </p>
          <LengthSelector
            value={document.length}
            onChange={(length) =>
              updateDocument((prev) => ({ ...prev, length }))
            }
          />
        </div>
      </div>
      <SectionSaveBar
        dirty={dirty}
        status={saveBarStatus}
        onSave={onSave}
        label="Save letter"
      />
    </section>
  );
}

function BodySectionPane({
  sectionKey,
  value,
  onChange,
  onAi,
  aiBusy,
  saveStatus,
  dirty,
  onSave,
}: {
  sectionKey: LetterSectionKey;
  value: string;
  onChange: (value: string) => void;
  onAi: (action: string) => void;
  aiBusy: boolean;
  saveStatus: SectionSaveStatus;
  dirty: boolean;
  onSave: () => void;
}) {
  const meta = SECTION_META[sectionKey];
  return (
    <section className="px-5 py-5 sm:px-7 sm:py-6">
      <PaneHeading
        title={LETTER_PANE_LABELS[sectionKey]}
        description="Write in your own words. Use AI to improve — suggestions never replace your text until you accept them."
      />
      <div className="mt-4 flex flex-wrap gap-1.5">
        {AI_ACTIONS.map((item) => (
          <AIActionButton
            key={item.action}
            label={item.label}
            disabled={aiBusy}
            onClick={() => onAi(item.action)}
          />
        ))}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={meta.rows}
        placeholder={meta.placeholder}
        aria-label={LETTER_PANE_LABELS[sectionKey]}
        className="mt-4 min-h-32 bg-paper text-[0.98rem] leading-relaxed sm:min-h-40"
      />
      <SectionSaveBar
        dirty={dirty}
        status={saveStatus}
        onSave={onSave}
        label="Save letter"
      />
    </section>
  );
}

function PaneHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-line pb-4">
      <h3 className="font-sans text-[0.92rem] font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function PendingGenerationCard({
  preview,
  onApply,
  onDiscard,
}: {
  preview: string;
  onApply: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line-strong bg-surface shadow-s">
      <div className="border-b border-line px-4 py-3">
        <p className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
          <Sparkles className="size-3.5" aria-hidden />
          AI draft ready
        </p>
      </div>
      <div className="space-y-3 p-4">
        <p className="text-sm text-ink-soft">
          A full letter was generated. Your current writing is unchanged until
          you apply this draft.
        </p>
        {preview ? (
          <p className="line-clamp-4 rounded-[8px] bg-emerald-wash p-3 text-sm leading-relaxed text-ink">
            {preview}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2 border-t border-line p-3">
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={onDiscard}
        >
          Keep mine
        </Button>
        <Button
          type="button"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={onApply}
        >
          Apply draft
        </Button>
      </div>
    </div>
  );
}

function CoverLetterAiCard() {
  const {
    aiSuggestion,
    applyAiSuggestion,
    discardAiSuggestion,
    regenerateAi,
  } = useCoverLetter();

  if (!aiSuggestion) return null;

  return (
    <div className="overflow-hidden rounded-[14px] border border-line-strong bg-surface shadow-s">
      <div className="border-b border-line px-4 py-3">
        <p className="text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
          AI suggestion · {aiSuggestion.action}
        </p>
      </div>
      <div className="space-y-3 p-4">
        {aiSuggestion.original ? (
          <div>
            <p className="mb-1 text-[0.7rem] font-semibold text-ink-faint uppercase">
              Original
            </p>
            <p className="whitespace-pre-wrap text-sm text-ink-soft line-through">
              {aiSuggestion.original}
            </p>
          </div>
        ) : null}
        <div>
          <p className="mb-1 text-[0.7rem] font-semibold text-ink-faint uppercase">
            Suggestion
          </p>
          <p className="whitespace-pre-wrap rounded-[8px] bg-emerald-wash p-3 text-sm leading-relaxed text-ink">
            {aiSuggestion.suggestion}
          </p>
        </div>
        <p className="text-[0.78rem] text-ink-soft">
          <span className="font-semibold text-ink">Why: </span>
          {aiSuggestion.explanation}
        </p>
      </div>
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
          variant="outline"
          shape="soft"
          className="rounded-[8px]"
          onClick={discardAiSuggestion}
        >
          Reject
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
    </div>
  );
}
