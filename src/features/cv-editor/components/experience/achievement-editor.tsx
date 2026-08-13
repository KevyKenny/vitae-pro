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
  experienceId,
  field = "responsibilities",
  jobTitle,
  company,
  showAi = true,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  label?: string;
  experienceType: ExperienceTypeId;
  experienceId?: string;
  field?: "responsibilities" | "achievements";
  jobTitle?: string;
  company?: string;
  showAi?: boolean;
}) {
  const { requestAi, aiLoading } = useEditor();

  function tip() {
    toast.message(aiTipForExperienceType(experienceType));
  }

  function firstActiveIndex() {
    const idx = items.findIndex((item) => item.trim());
    return idx >= 0 ? idx : 0;
  }

  function runAi(action: string, mode?: "single" | "bullets") {
    tip();
    const bulletIndex = firstActiveIndex();
    void requestAi({
      feature: "experience",
      action,
      mode,
      experienceId,
      bulletIndex,
      field,
      text: items[bulletIndex] ?? "",
      jobTitle,
      company,
      description: items.filter((item) => item.trim()).join("\n"),
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
        {showAi ? (
          <div className="flex flex-wrap gap-1">
            <AIActionButton
              label={aiLoading ? "Generating…" : "Improve"}
              onClick={() => runAi("Improve")}
              disabled={aiLoading}
            />
            <AIActionButton
              label="Rewrite"
              onClick={() => runAi("Rewrite")}
              disabled={aiLoading}
            />
            <AIActionButton
              label="Add measurable achievements"
              onClick={() => runAi("Generate bullets", "bullets")}
              disabled={aiLoading}
            />
            <AIActionButton
              label="Professional wording"
              onClick={() => runAi("Professional wording")}
              disabled={aiLoading}
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
