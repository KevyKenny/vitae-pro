"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { mockCvDocument } from "@/mocks/cv-editor";
import { useState } from "react";

export function CandidateProfileCard() {
  const { document, updateCandidate, toggleExperienceHighlight } =
    useCoverLetter();
  const { candidate } = document;
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-4 rounded-[14px] border border-line-strong bg-surface p-4 shadow-s">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            From your CV
          </p>
          {editing ? (
            <div className="mt-2 space-y-2">
              <div>
                <Label htmlFor="cand-name">Name</Label>
                <Input
                  id="cand-name"
                  value={candidate.name}
                  onChange={(e) => updateCandidate({ name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cand-role">Current role</Label>
                <Input
                  id="cand-role"
                  value={candidate.currentRole}
                  onChange={(e) =>
                    updateCandidate({ currentRole: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 font-serif text-lg font-semibold text-ink">
                {candidate.name}
              </p>
              <p className="text-sm text-ink-soft">
                {candidate.currentRole} · {candidate.yearsExperience} yrs
              </p>
            </>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => setEditing((v) => !v)}
        >
          <Pencil className="size-3.5" />
          {editing ? "Done" : "Edit"}
        </Button>
      </div>

      <div>
        <p className="mb-1.5 text-[0.7rem] font-semibold text-ink-faint uppercase">
          Top skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {candidate.topSkills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[0.7rem] font-semibold text-ink-faint uppercase">
          Key achievements
        </p>
        <ul className="space-y-1.5 text-sm text-ink-soft">
          {candidate.keyAchievements.map((a) => (
            <li key={a} className="leading-snug">
              · {a}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-[0.7rem] font-semibold text-ink-faint uppercase">
          Experiences to highlight
        </p>
        <ul className="space-y-2">
          {mockCvDocument.experience.map((exp) => {
            const checked = candidate.highlightedExperienceIds.includes(exp.id);
            return (
              <li key={exp.id} className="flex items-start gap-2.5">
                <Checkbox
                  id={exp.id}
                  checked={checked}
                  onCheckedChange={() => toggleExperienceHighlight(exp.id)}
                  className="mt-0.5"
                />
                <label htmlFor={exp.id} className="cursor-pointer text-sm">
                  <span className="font-semibold text-ink">{exp.position}</span>
                  <span className="text-ink-soft"> · {exp.company}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
