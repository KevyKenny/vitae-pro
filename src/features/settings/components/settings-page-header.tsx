"use client";

import { SaveIndicator } from "@/features/cv-editor/components/save-indicator";
import type { SaveStatus } from "@/features/settings/types";
import { Button } from "@/components/ui/button";

export function SettingsPageHeader({
  title,
  description,
  saveStatus,
  onRetry,
  onSave,
}: {
  title: string;
  description?: string;
  saveStatus?: SaveStatus;
  onRetry?: () => void;
  onSave?: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-serif text-[1.65rem] font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm text-ink-soft">{description}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {saveStatus ? (
          <SaveIndicator status={saveStatus} onRetry={onRetry} />
        ) : null}
        {onSave ? (
          <Button type="button" shape="soft" className="rounded-[8px]" onClick={onSave}>
            Save changes
          </Button>
        ) : null}
      </div>
    </div>
  );
}
