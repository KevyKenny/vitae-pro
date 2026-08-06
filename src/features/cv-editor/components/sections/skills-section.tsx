"use client";

import { Gauge, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type { SkillCategory, SkillEntry } from "@/features/cv-editor/types";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const categories: { id: SkillCategory; label: string }[] = [
  { id: "technical", label: "Technical Skills" },
  { id: "soft", label: "Soft Skills" },
  { id: "tools", label: "Tools" },
  { id: "languages", label: "Languages" },
  { id: "frameworks", label: "Frameworks" },
];

export function SkillSelector() {
  const { document, updateDocument, requestAi } = useEditor();
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState<SkillCategory>("technical");

  function addSkill() {
    if (!draft.trim()) return;
    const skill: SkillEntry = {
      id: `sk_${Date.now()}`,
      name: draft.trim(),
      category,
      level: 3,
    };
    updateDocument((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setDraft("");
  }

  function removeSkill(id: string) {
    updateDocument((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }

  function setLevel(id: string, level: number) {
    updateDocument((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, level } : s)),
    }));
  }

  if (document.skills.length === 0 && !draft) {
    return (
      <EmptyState
        icon={Gauge}
        title="No skills added"
        description="Organize skills by category and strength."
        actionLabel="Add a skill"
        onAction={() => setDraft("Product Design")}
        className="border-0 bg-transparent py-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
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
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a skill"
          className="bg-paper"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <Button type="button" shape="soft" className="rounded-[8px]" onClick={addSkill}>
          <Plus className="size-4" /> Add
        </Button>
        <AIActionButton label="Recommend" onClick={() => requestAi("skills_gap")} />
      </div>
      <div className="space-y-3">
        {categories.map((c) => {
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
                    <div className="flex gap-0.5" aria-label={`${skill.name} level`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`size-1.5 rounded-full ${
                            i < skill.level ? "bg-emerald" : "bg-line-strong"
                          }`}
                          onClick={() => setLevel(skill.id, i + 1)}
                          aria-label={`Set level ${i + 1}`}
                        />
                      ))}
                    </div>
                    <Badge variant="muted" className="px-1.5">
                      {skill.level}/5
                    </Badge>
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
  return (
    <EditorSectionCard sectionId="sec_skills" title="Skills">
      <SkillSelector />
    </EditorSectionCard>
  );
}
