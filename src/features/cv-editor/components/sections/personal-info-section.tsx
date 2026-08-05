"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";

export function PersonalInfoSection() {
  const { document, updateDocument } = useEditor();
  const { personal } = document;

  function patch<K extends keyof typeof personal>(key: K, value: (typeof personal)[K]) {
    updateDocument((prev) => ({
      ...prev,
      personal: { ...prev.personal, [key]: value },
    }));
  }

  return (
    <EditorSectionCard sectionId="sec_personal" title="Personal Information">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-gold-wash font-serif text-xl font-semibold text-gold">
          {personal.fullName
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Profile photo</p>
          <p className="text-xs text-ink-faint">Upload is UI-only in Phase 4.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["fullName", "Full name"],
            ["title", "Professional title"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["linkedin", "LinkedIn"],
            ["portfolio", "Portfolio website"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[0.76rem] font-semibold tracking-[0.04em] text-ink-soft uppercase">
              {label}
            </Label>
            <Input
              value={personal[key]}
              onChange={(e) => patch(key, e.target.value)}
              className="bg-paper"
            />
          </div>
        ))}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[0.76rem] font-semibold tracking-[0.04em] text-ink-soft uppercase">
            Social links
          </Label>
          <Input
            value={personal.socialLinks.join(", ")}
            onChange={(e) =>
              patch(
                "socialLinks",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            className="bg-paper"
            placeholder="Comma-separated URLs"
          />
        </div>
      </div>
    </EditorSectionCard>
  );
}
