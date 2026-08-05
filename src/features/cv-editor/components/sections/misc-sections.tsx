"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";

export function CertificationsSection() {
  const { document, updateDocument } = useEditor();
  return (
    <EditorSectionCard sectionId="sec_certifications" title="Certifications">
      <div className="space-y-4">
        {document.certifications.map((c, index) => (
          <div key={c.id} className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["name", "Certificate name"],
                ["provider", "Provider"],
                ["date", "Date"],
                ["credentialUrl", "Credential link"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
                <Input
                  value={c[key]}
                  onChange={(e) => {
                    const certifications = [...document.certifications];
                    certifications[index] = { ...c, [key]: e.target.value };
                    updateDocument((prev) => ({ ...prev, certifications }));
                  }}
                  className="bg-paper"
                />
              </div>
            ))}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="w-full rounded-[8px] border-dashed"
          onClick={() =>
            updateDocument((prev) => ({
              ...prev,
              certifications: [
                ...prev.certifications,
                {
                  id: `cert_${Date.now()}`,
                  name: "",
                  provider: "",
                  date: "",
                  credentialUrl: "",
                },
              ],
            }))
          }
        >
          <Plus className="size-4" /> Add certification
        </Button>
      </div>
    </EditorSectionCard>
  );
}

export function LanguagesSection() {
  const { document, updateDocument } = useEditor();
  return (
    <EditorSectionCard sectionId="sec_languages" title="Languages">
      <div className="space-y-3">
        {document.languages.map((lang, index) => (
          <div key={lang.id} className="grid gap-3 sm:grid-cols-2">
            <Input
              value={lang.name}
              onChange={(e) => {
                const languages = [...document.languages];
                languages[index] = { ...lang, name: e.target.value };
                updateDocument((prev) => ({ ...prev, languages }));
              }}
              placeholder="Language"
              className="bg-paper"
            />
            <Input
              value={lang.proficiency}
              onChange={(e) => {
                const languages = [...document.languages];
                languages[index] = { ...lang, proficiency: e.target.value };
                updateDocument((prev) => ({ ...prev, languages }));
              }}
              placeholder="Proficiency"
              className="bg-paper"
            />
          </div>
        ))}
      </div>
    </EditorSectionCard>
  );
}

export function AchievementsSection() {
  const { document, updateDocument } = useEditor();
  return (
    <EditorSectionCard sectionId="sec_achievements" title="Achievements">
      <div className="space-y-3">
        {document.achievements.map((a, index) => (
          <div key={a.id} className="space-y-2">
            <Input
              value={a.title}
              onChange={(e) => {
                const achievements = [...document.achievements];
                achievements[index] = { ...a, title: e.target.value };
                updateDocument((prev) => ({ ...prev, achievements }));
              }}
              className="bg-paper"
            />
            <Textarea
              rows={2}
              value={a.description}
              onChange={(e) => {
                const achievements = [...document.achievements];
                achievements[index] = { ...a, description: e.target.value };
                updateDocument((prev) => ({ ...prev, achievements }));
              }}
              className="bg-paper"
            />
          </div>
        ))}
      </div>
    </EditorSectionCard>
  );
}

export function ReferencesSection() {
  const { document, updateDocument } = useEditor();
  return (
    <EditorSectionCard sectionId="sec_references" title="References">
      <div className="space-y-3">
        {document.references.map((r, index) => (
          <div key={r.id} className="grid gap-3 sm:grid-cols-3">
            <Input
              value={r.name}
              onChange={(e) => {
                const references = [...document.references];
                references[index] = { ...r, name: e.target.value };
                updateDocument((prev) => ({ ...prev, references }));
              }}
              placeholder="Name"
              className="bg-paper"
            />
            <Input
              value={r.relationship}
              onChange={(e) => {
                const references = [...document.references];
                references[index] = { ...r, relationship: e.target.value };
                updateDocument((prev) => ({ ...prev, references }));
              }}
              placeholder="Relationship"
              className="bg-paper"
            />
            <Input
              value={r.contact}
              onChange={(e) => {
                const references = [...document.references];
                references[index] = { ...r, contact: e.target.value };
                updateDocument((prev) => ({ ...prev, references }));
              }}
              placeholder="Contact"
              className="bg-paper"
            />
          </div>
        ))}
      </div>
    </EditorSectionCard>
  );
}

export function CustomSection({ sectionId, label }: { sectionId: string; label: string }) {
  return (
    <EditorSectionCard sectionId={sectionId} title={label}>
      <Textarea
        rows={4}
        placeholder="Add custom content for this section…"
        className="bg-paper"
        defaultValue=""
      />
    </EditorSectionCard>
  );
}
