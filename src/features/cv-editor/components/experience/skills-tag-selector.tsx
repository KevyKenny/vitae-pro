"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUGGESTED_SKILLS } from "@/features/cv-editor/components/experience/experience-helpers";
import { cn } from "@/lib/utils";

export function SkillsTagSelector({
  value,
  onChange,
  label = "Skills gained",
  suggestions = SUGGESTED_SKILLS,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  suggestions?: readonly string[];
}) {
  const [draft, setDraft] = useState("");

  function add(skill: string) {
    const next = skill.trim();
    if (!next) return;
    if (value.some((s) => s.toLowerCase() === next.toLowerCase())) return;
    onChange([...value, next]);
    setDraft("");
  }

  return (
    <div className="space-y-2">
      <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {value.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-wash px-2.5 py-1 text-[0.78rem] font-medium text-emerald"
          >
            {skill}
            <button
              type="button"
              className="rounded-full p-0.5 hover:bg-emerald/20"
              aria-label={`Remove ${skill}`}
              onClick={() => onChange(value.filter((s) => s !== skill))}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            }
          }}
          placeholder="Add a skill"
          className="bg-surface"
          aria-label="Add custom skill"
        />
        <Button
          type="button"
          variant="outline"
          shape="soft"
          onClick={() => add(draft)}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions
          .filter(
            (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()),
          )
          .slice(0, 10)
          .map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => add(skill)}
              className={cn(
                "rounded-full border border-line bg-surface px-2.5 py-1 text-[0.74rem] text-ink-soft",
                "hover:border-emerald/40 hover:text-ink",
              )}
            >
              + {skill}
            </button>
          ))}
      </div>
    </div>
  );
}
