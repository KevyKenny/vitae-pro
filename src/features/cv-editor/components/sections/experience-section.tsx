"use client";

import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type { ExperienceEntry } from "@/features/cv-editor/types";
import { Briefcase } from "lucide-react";

export function ExperienceCard({
  entry,
  index,
  onChange,
  onRemove,
}: {
  entry: ExperienceEntry;
  index: number;
  onChange: (entry: ExperienceEntry) => void;
  onRemove: () => void;
}) {
  const { requestAi } = useEditor();

  function updateBullet(i: number, value: string) {
    const bullets = [...entry.bullets];
    bullets[i] = value;
    onChange({ ...entry, bullets });
  }

  return (
    <div className="rounded-[12px] border border-line bg-paper-dim/40 p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-ink">
          Role {index + 1}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          aria-label="Remove experience"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">Company</Label>
          <Input
            value={entry.company}
            onChange={(e) => onChange({ ...entry, company: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">Position</Label>
          <Input
            value={entry.position}
            onChange={(e) => onChange({ ...entry, position: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">Start</Label>
          <Input
            value={entry.startDate}
            onChange={(e) => onChange({ ...entry, startDate: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">End</Label>
          <Input
            value={entry.current ? "Present" : entry.endDate}
            disabled={entry.current}
            onChange={(e) => onChange({ ...entry, endDate: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[0.76rem] uppercase text-ink-soft">Location</Label>
          <Input
            value={entry.location}
            onChange={(e) => onChange({ ...entry, location: e.target.value })}
            className="bg-surface"
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Achievements
          </Label>
          <div className="flex flex-wrap gap-1">
            <AIActionButton label="Improve Bullet" onClick={() => requestAi("bullet_rewrite")} />
            <AIActionButton
              label="Generate Metrics"
              onClick={() => toast.message("Generate metrics (mock)")}
            />
            <AIActionButton label="Rewrite" onClick={() => requestAi("bullet_rewrite")} />
          </div>
        </div>
        {entry.bullets.map((bullet, i) => (
          <div key={i} className="flex gap-2">
            <span className="mt-3 text-ink-faint">—</span>
            <Textarea
              rows={2}
              value={bullet}
              onChange={(e) => updateBullet(i, e.target.value)}
              className="bg-surface"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="link"
          className="h-auto px-0"
          onClick={() =>
            onChange({ ...entry, bullets: [...entry.bullets, ""] })
          }
        >
          <Plus className="size-3.5" /> Add achievement
        </Button>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { document, updateDocument } = useEditor();

  function setExperience(experience: ExperienceEntry[]) {
    updateDocument((prev) => ({ ...prev, experience }));
  }

  if (document.experience.length === 0) {
    return (
      <EditorSectionCard sectionId="sec_experience" title="Work Experience">
        <EmptyState
          icon={Briefcase}
          title="No experience added"
          description="Add roles and AI will help turn responsibilities into measurable achievements."
          actionLabel="Add experience"
          onAction={() =>
            setExperience([
              {
                id: `exp_${Date.now()}`,
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                current: false,
                location: "",
                bullets: [""],
              },
            ])
          }
          className="border-0 bg-transparent py-8"
        />
      </EditorSectionCard>
    );
  }

  return (
    <EditorSectionCard sectionId="sec_experience" title="Work Experience">
      <div className="space-y-4">
        {document.experience.map((entry, index) => (
          <ExperienceCard
            key={entry.id}
            entry={entry}
            index={index}
            onChange={(next) => {
              const experience = [...document.experience];
              experience[index] = next;
              setExperience(experience);
            }}
            onRemove={() =>
              setExperience(document.experience.filter((e) => e.id !== entry.id))
            }
          />
        ))}
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="w-full rounded-[8px] border-dashed"
          onClick={() =>
            setExperience([
              ...document.experience,
              {
                id: `exp_${Date.now()}`,
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                current: false,
                location: "",
                bullets: [""],
              },
            ])
          }
        >
          <Plus className="size-4" /> Add experience
        </Button>
      </div>
    </EditorSectionCard>
  );
}
