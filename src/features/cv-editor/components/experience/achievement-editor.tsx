"use client";

import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { aiTipForExperienceType } from "@/features/cv-editor/components/experience/experience-helpers";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type { ExperienceTypeId } from "@/features/cv-editor/types";

export function AchievementEditor({
  items,
  onChange,
  label = "Achievements",
  experienceType,
  showAi = true,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  label?: string;
  experienceType: ExperienceTypeId;
  showAi?: boolean;
}) {
  const { requestAi } = useEditor();

  function tip() {
    toast.message(aiTipForExperienceType(experienceType));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
        {showAi ? (
          <div className="flex flex-wrap gap-1">
            <AIActionButton
              label="Improve"
              onClick={() => {
                tip();
                requestAi("bullet_rewrite");
              }}
            />
            <AIActionButton
              label="Rewrite"
              onClick={() => {
                tip();
                requestAi("bullet_rewrite");
              }}
            />
            <AIActionButton
              label="Add measurable achievements"
              onClick={() => {
                tip();
                toast.message("Generate metrics (mock)");
              }}
            />
            <AIActionButton
              label="Professional wording"
              onClick={() => {
                tip();
                requestAi("bullet_rewrite");
              }}
            />
          </div>
        ) : null}
      </div>
      {(items.length ? items : [""]).map((item, i) => (
        <div key={i} className="flex gap-2">
          <span className="mt-3 text-ink-faint" aria-hidden>
            —
          </span>
          <Textarea
            rows={2}
            value={item}
            onChange={(e) => {
              const next = [...(items.length ? items : [""])];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="bg-surface"
            aria-label={`${label} ${i + 1}`}
          />
          {(items.length ? items : [""]).length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              shape="soft"
              className="mt-1"
              aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
              onClick={() =>
                onChange(items.filter((_, idx) => idx !== i))
              }
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null}
        </div>
      ))}
      <Button
        type="button"
        variant="link"
        className="h-auto px-0"
        onClick={() => onChange([...(items.length ? items : [""]), ""])}
      >
        <Plus className="size-3.5" /> Add {label.toLowerCase().replace(/s$/, "")}
      </Button>
    </div>
  );
}
