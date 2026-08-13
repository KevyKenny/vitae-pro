"use client";

import { Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import {
  SKILL_CATEGORIES,
  SKILL_PLACEHOLDERS,
} from "@/features/cv-editor/constants/skills";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useSectionId } from "@/features/cv-editor/hooks/use-section-id";
import { useSectionSave } from "@/features/cv-editor/hooks/use-section-save";
import type { SkillCategory, SkillEntry } from "@/features/cv-editor/types";
import { useState } from "react";

export function SkillSelector() {
  const { document, updateDocument, requestAi } = useEditor();
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState<SkillCategory>("technical");
  const placeholder = SKILL_PLACEHOLDERS[category];

  function addSkill() {
    if (!draft.trim()) return;
    const skill: SkillEntry = {
      id: crypto.randomUUID(),
      name: draft.trim(),
      category,
      level: null,
    };
    updateDocument((prev) => ({ ...prev, skills: [...prev.skills, skill] }), {
      sectionKey: "skills",
    });
    setDraft("");
  }

  function removeSkill(id: string) {
    updateDocument(
      (prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      }),
      { sectionKey: "skills" },
    );
  }

  if (document.skills.length === 0 && !draft) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No skills added"
        description="Add technical and soft skills — each category appears as its own section on your CV."
        actionLabel="Add a skill"
        onAction={() => setDraft(SKILL_PLACEHOLDERS.technical)}
        className="border-0 bg-transparent py-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SKILL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              category === c.id
                ? "border-emerald bg-emerald text-paper"
                : "border-line-strong text-ink-soft"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="bg-paper"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            shape="soft"
            className="rounded-[8px]"
            onClick={addSkill}
          >
            <Plus className="size-4" /> Add
          </Button>
          <AIActionButton
            label="Recommend"
            onClick={() => requestAi({ feature: "skills", action: "Recommend" })}
          />
        </div>
      </div>
      <div className="space-y-3">
        {SKILL_CATEGORIES.map((c) => {
          const skills = document.skills.filter((s) => s.category === c.id);
          if (skills.length === 0) return null;
          return (
            <div key={c.id}>
              <p className="mb-2 text-xs font-semibold tracking-[0.04em] text-ink-faint uppercase">
                {c.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5"
                  >
                    <span className="text-sm font-medium text-ink">{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      aria-label={`Remove ${skill.name}`}
                      className="text-ink-faint hover:text-ink"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const sectionId = useSectionId("skills");
  const { dirty, status, onSave } = useSectionSave("skills");
  return (
    <EditorSectionCard sectionId={sectionId} title="Skills">
      <SkillSelector />
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Skills"
      />
    </EditorSectionCard>
  );
}
