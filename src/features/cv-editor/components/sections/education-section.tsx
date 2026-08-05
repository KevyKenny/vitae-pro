"use client";

import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type { EducationEntry } from "@/features/cv-editor/types";

export function EducationSection() {
  const { document, updateDocument } = useEditor();

  function setEducation(education: EducationEntry[]) {
    updateDocument((prev) => ({ ...prev, education }));
  }

  return (
    <EditorSectionCard sectionId="sec_education" title="Education">
      {document.education.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education added"
          description="Add degrees and coursework your target roles expect."
          actionLabel="Add education"
          onAction={() =>
            setEducation([
              {
                id: `edu_${Date.now()}`,
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                achievements: "",
                description: "",
              },
            ])
          }
          className="border-0 bg-transparent py-8"
        />
      ) : (
        <div className="space-y-4">
          {document.education.map((entry, index) => (
            <div
              key={entry.id}
              className="rounded-[12px] border border-line bg-paper-dim/40 p-4"
            >
              <div className="mb-3 flex justify-between">
                <p className="text-sm font-semibold">Entry {index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  shape="soft"
                  onClick={() =>
                    setEducation(
                      document.education.filter((e) => e.id !== entry.id),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["institution", "Institution"],
                    ["degree", "Degree"],
                    ["field", "Field"],
                    ["startDate", "Start"],
                    ["endDate", "End"],
                    ["achievements", "Achievements"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-[0.76rem] uppercase text-ink-soft">
                      {label}
                    </Label>
                    <Input
                      value={entry[key]}
                      onChange={(e) => {
                        const education = [...document.education];
                        education[index] = { ...entry, [key]: e.target.value };
                        setEducation(education);
                      }}
                      className="bg-surface"
                    />
                  </div>
                ))}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-[0.76rem] uppercase text-ink-soft">
                    Description
                  </Label>
                  <Textarea
                    rows={2}
                    value={entry.description}
                    onChange={(e) => {
                      const education = [...document.education];
                      education[index] = {
                        ...entry,
                        description: e.target.value,
                      };
                      setEducation(education);
                    }}
                    className="bg-surface"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="w-full rounded-[8px] border-dashed"
            onClick={() =>
              setEducation([
                ...document.education,
                {
                  id: `edu_${Date.now()}`,
                  institution: "",
                  degree: "",
                  field: "",
                  startDate: "",
                  endDate: "",
                  achievements: "",
                  description: "",
                },
              ])
            }
          >
            <Plus className="size-4" /> Add education
          </Button>
        </div>
      )}
    </EditorSectionCard>
  );
}
