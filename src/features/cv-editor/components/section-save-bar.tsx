"use client";

import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionSaveStatus } from "@/features/cv-editor/hooks/use-section-save";
import { cn } from "@/lib/utils";

type SectionSaveBarProps = {
  status: SectionSaveStatus;
  dirty: boolean;
  onSave: () => void;
  label?: string;
  className?: string;
};

export function SectionSaveBar({
  status,
  dirty,
  onSave,
  label = "Save Changes",
  className,
}: SectionSaveBarProps) {
  const saving = status === "saving";
  const failed = status === "error";
  const saved = status === "saved" && !dirty;

  return (
    <div
      className={cn(
        "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4",
        className,
      )}
    >
      <p className="text-[0.78rem] text-ink-faint" aria-live="polite">
        {saving ? (
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            Saving…
          </span>
        ) : failed ? (
          <span className="inline-flex items-center gap-1.5 text-destructive">
            <AlertCircle className="size-3.5" aria-hidden />
            Unable to save your changes.
          </span>
        ) : saved ? (
          <span className="inline-flex items-center gap-1.5 text-emerald">
            <Check className="size-3.5" aria-hidden />
            Saved
          </span>
        ) : dirty ? (
          <span className="text-ink-soft">Unsaved changes</span>
        ) : (
          <span>All changes saved</span>
        )}
      </p>
      <Button
        type="button"
        shape="soft"
        className="rounded-[8px]"
        disabled={saving || (!dirty && !failed)}
        onClick={onSave}
      >
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : failed ? (
          "Retry"
        ) : saved ? (
          <>
            <Check className="size-4" aria-hidden />
            Saved
          </>
        ) : (
          label
        )}
      </Button>
    </div>
  );
}
