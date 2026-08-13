"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { SingleMonthYearFields } from "@/features/cv-editor/components/experience/month-year-fields";
import { QuillEditor } from "@/features/cv-editor/components/quill-editor";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useSectionId } from "@/features/cv-editor/hooks/use-section-id";
import { useSectionSave } from "@/features/cv-editor/hooks/use-section-save";
import type { CertificationEntry } from "@/features/cv-editor/types";
import {
  composeEducationDate,
  parseEducationDateParts,
} from "@/lib/cvs/education-dates";

const PROFICIENCY = [
  "Native",
  "Fluent",
  "Professional",
  "Intermediate",
  "Basic",
] as const;

function CertificationCard({
  entry,
  onChange,
  onDelete,
}: {
  entry: CertificationEntry;
  onChange: (next: CertificationEntry) => void;
  onDelete: () => void;
}) {
  const { month, year } = parseEducationDateParts(entry.date);

  function updateDate(patch: { month?: string; year?: string }) {
    const nextMonth = patch.month ?? month;
    const nextYear = patch.year ?? year;
    onChange({
      ...entry,
      date: composeEducationDate(nextMonth, nextYear),
    });
  }

  return (
    <div className="relative space-y-4 rounded-[12px] border border-line bg-paper-dim/30 p-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        shape="soft"
        className="absolute top-2 right-2 text-ink-faint hover:text-destructive"
        aria-label="Delete certification"
        onClick={onDelete}
      >
        <Trash2 className="size-3.5" />
      </Button>

      <div className="space-y-1.5 pr-8">
        <Label className="text-[0.76rem] uppercase text-ink-soft">
          Certificate name
        </Label>
        <Input
          value={entry.name}
          onChange={(e) => onChange({ ...entry, name: e.target.value })}
          placeholder="e.g. AWS Certified Developer"
          className="bg-paper"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Provider
          </Label>
          <Input
            value={entry.provider}
            onChange={(e) => onChange({ ...entry, provider: e.target.value })}
            placeholder="e.g. Amazon Web Services"
            className="bg-paper"
          />
        </div>
        <SingleMonthYearFields
          month={month}
          year={year}
          onChange={updateDate}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[0.76rem] uppercase text-ink-soft">
          Credential link
        </Label>
        <Input
          value={entry.credentialUrl}
          onChange={(e) =>
            onChange({ ...entry, credentialUrl: e.target.value })
          }
          placeholder="https://credly.com/badges/your-credential"
          className="bg-paper"
        />
      </div>
    </div>
  );
}

export function CertificationsSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("certifications");
  const { dirty, status, onSave } = useSectionSave("certifications");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function patchCertifications(
    updater: (rows: CertificationEntry[]) => CertificationEntry[],
  ) {
    updateDocument(
      (prev) => ({ ...prev, certifications: updater(prev.certifications) }),
      { sectionKey: "certifications" },
    );
  }

  return (
    <EditorSectionCard sectionId={sectionId} title="Certifications">
      <div className="space-y-4">
        {document.certifications.length === 0 ? (
          <p className="text-sm text-ink-faint">No certifications yet.</p>
        ) : null}
        {document.certifications.map((entry) => (
          <CertificationCard
            key={entry.id}
            entry={entry}
            onChange={(next) =>
              patchCertifications((rows) =>
                rows.map((row) => (row.id === entry.id ? next : row)),
              )
            }
            onDelete={() => setDeleteId(entry.id)}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="w-full rounded-[8px] border-dashed"
          onClick={() =>
            patchCertifications((rows) => [
              ...rows,
              {
                id: crypto.randomUUID(),
                name: "",
                provider: "",
                date: "",
                credentialUrl: "",
              },
            ])
          }
        >
          <Plus className="size-4" /> Add certification
        </Button>
      </div>
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Certifications"
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete this certification?"
        description="This removes the certification from your CV."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!deleteId) return;
          updateDocument(
            (prev) => ({
              ...prev,
              certifications: prev.certifications.filter((row) => row.id !== deleteId),
            }),
            { sectionKey: "certifications" },
          );
          setDeleteId(null);
        }}
      />
    </EditorSectionCard>
  );
}

export function LanguagesSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("languages");
  const { dirty, status, onSave } = useSectionSave("languages");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <EditorSectionCard sectionId={sectionId} title="Languages">
      <div className="space-y-3">
        {document.languages.length === 0 ? (
          <p className="text-sm text-ink-faint">
            Add languages you speak — e.g. English, Shona, Ndebele.
          </p>
        ) : null}
        {document.languages.map((lang) => (
          <div
            key={lang.id}
            className="grid gap-3 rounded-[12px] border border-line bg-paper-dim/30 p-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div className="space-y-1.5">
              <Label htmlFor={`lang-name-${lang.id}`} className="text-[0.76rem] uppercase text-ink-soft">
                Language
              </Label>
              <Input
                id={`lang-name-${lang.id}`}
                value={lang.name}
                onChange={(e) => {
                  const value = e.target.value;
                  updateDocument(
                    (prev) => ({
                      ...prev,
                      languages: prev.languages.map((row) =>
                        row.id === lang.id ? { ...row, name: value } : row,
                      ),
                    }),
                    { sectionKey: "languages" },
                  );
                }}
                placeholder="Language"
                className="bg-paper"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.76rem] uppercase text-ink-soft">
                Proficiency
              </Label>
              <Select
                value={lang.proficiency || undefined}
                onValueChange={(value) =>
                  updateDocument(
                    (prev) => ({
                      ...prev,
                      languages: prev.languages.map((row) =>
                        row.id === lang.id ? { ...row, proficiency: value } : row,
                      ),
                    }),
                    { sectionKey: "languages" },
                  )
                }
              >
                <SelectTrigger className="bg-paper" aria-label="Proficiency">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                shape="soft"
                aria-label="Delete language"
                className="text-ink-faint hover:text-destructive"
                onClick={() => setDeleteId(lang.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="w-full rounded-[8px] border-dashed"
          onClick={() =>
            updateDocument(
              (prev) => ({
                ...prev,
                languages: [
                  ...prev.languages,
                  { id: crypto.randomUUID(), name: "", proficiency: "" },
                ],
              }),
              { sectionKey: "languages" },
            )
          }
        >
          <Plus className="size-4" /> Add language
        </Button>
      </div>
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Languages"
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete this language?"
        description="This removes the language entry from your CV."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!deleteId) return;
          updateDocument(
            (prev) => ({
              ...prev,
              languages: prev.languages.filter((row) => row.id !== deleteId),
            }),
            { sectionKey: "languages" },
          );
          setDeleteId(null);
        }}
      />
    </EditorSectionCard>
  );
}

export function AchievementsSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("achievements");
  const { dirty, status, onSave } = useSectionSave("achievements");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <EditorSectionCard sectionId={sectionId} title="Achievements">
      <div className="space-y-3">
        {document.achievements.length === 0 ? (
          <p className="text-sm text-ink-faint">
            Highlight awards, recognition, or notable accomplishments.
          </p>
        ) : null}
        {document.achievements.map((a) => (
          <div
            key={a.id}
            className="space-y-2 rounded-[12px] border border-line bg-paper-dim/30 p-3"
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label
                  htmlFor={`ach-title-${a.id}`}
                  className="text-[0.76rem] uppercase text-ink-soft"
                >
                  Achievement title
                </Label>
                <Input
                  id={`ach-title-${a.id}`}
                  value={a.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateDocument(
                      (prev) => ({
                        ...prev,
                        achievements: prev.achievements.map((row) =>
                          row.id === a.id ? { ...row, title: value } : row,
                        ),
                      }),
                      { sectionKey: "achievements" },
                    );
                  }}
                  className="bg-paper"
                  placeholder="e.g. Employee of the Year"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                shape="soft"
                className="mt-6 text-ink-faint hover:text-destructive"
                aria-label="Delete achievement"
                onClick={() => setDeleteId(a.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor={`ach-desc-${a.id}`}
                className="text-[0.76rem] uppercase text-ink-soft"
              >
                Description
              </Label>
              <Textarea
                id={`ach-desc-${a.id}`}
                rows={2}
                value={a.description}
                onChange={(e) => {
                  const value = e.target.value;
                  updateDocument(
                    (prev) => ({
                      ...prev,
                      achievements: prev.achievements.map((row) =>
                        row.id === a.id ? { ...row, description: value } : row,
                      ),
                    }),
                    { sectionKey: "achievements" },
                  );
                }}
                className="bg-paper"
                placeholder="What made this achievement meaningful?"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="w-full rounded-[8px] border-dashed"
          onClick={() =>
            updateDocument(
              (prev) => ({
                ...prev,
                achievements: [
                  ...prev.achievements,
                  { id: crypto.randomUUID(), title: "", description: "" },
                ],
              }),
              { sectionKey: "achievements" },
            )
          }
        >
          <Plus className="size-4" /> Add achievement
        </Button>
      </div>
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Achievements"
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete this achievement?"
        description="This removes the achievement from your CV."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!deleteId) return;
          updateDocument(
            (prev) => ({
              ...prev,
              achievements: prev.achievements.filter((row) => row.id !== deleteId),
            }),
            { sectionKey: "achievements" },
          );
          setDeleteId(null);
        }}
      />
    </EditorSectionCard>
  );
}

export function ReferencesSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("references");
  const { dirty, status, onSave } = useSectionSave("references");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const availableUponRequest =
    document.references.length === 1 &&
    document.references[0]?.name.toLowerCase().includes("available upon request");

  return (
    <EditorSectionCard sectionId={sectionId} title="References">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="soft"
            className="rounded-[8px]"
            onClick={() => {
              updateDocument(
                (prev) => ({
                  ...prev,
                  references: [
                    {
                      id: crypto.randomUUID(),
                      name: "References available upon request",
                      relationship: "",
                      contact: "",
                    },
                  ],
                }),
                { sectionKey: "references" },
              );
              toast.message("You can still add named references later.");
            }}
          >
            Use “available upon request”
          </Button>
        </div>

        {document.references.length === 0 ? (
          <p className="text-sm text-ink-faint">
            Add professional references, or note that they are available upon request.
          </p>
        ) : null}

        {document.references.map((r) => (
          <div
            key={r.id}
            className="grid gap-3 rounded-[12px] border border-line bg-paper-dim/30 p-3 sm:grid-cols-2"
          >
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor={`ref-name-${r.id}`}
                  className="text-[0.76rem] uppercase text-ink-soft"
                >
                  Full name
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  shape="soft"
                  aria-label="Delete reference"
                  className="text-ink-faint hover:text-destructive"
                  onClick={() => setDeleteId(r.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <Input
                id={`ref-name-${r.id}`}
                value={r.name}
                onChange={(e) => {
                  const value = e.target.value;
                  updateDocument(
                    (prev) => ({
                      ...prev,
                      references: prev.references.map((row) =>
                        row.id === r.id ? { ...row, name: value } : row,
                      ),
                    }),
                    { sectionKey: "references" },
                  );
                }}
                placeholder="Name"
                className="bg-paper"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.76rem] uppercase text-ink-soft">
                Relationship
              </Label>
              <Input
                value={r.relationship}
                onChange={(e) => {
                  const value = e.target.value;
                  updateDocument(
                    (prev) => ({
                      ...prev,
                      references: prev.references.map((row) =>
                        row.id === r.id ? { ...row, relationship: value } : row,
                      ),
                    }),
                    { sectionKey: "references" },
                  );
                }}
                placeholder="e.g. Former Manager"
                className="bg-paper"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.76rem] uppercase text-ink-soft">
                Contact
              </Label>
              <Input
                value={r.contact}
                onChange={(e) => {
                  const value = e.target.value;
                  updateDocument(
                    (prev) => ({
                      ...prev,
                      references: prev.references.map((row) =>
                        row.id === r.id ? { ...row, contact: value } : row,
                      ),
                    }),
                    { sectionKey: "references" },
                  );
                }}
                placeholder="Email or phone"
                className="bg-paper"
              />
            </div>
          </div>
        ))}

        {!availableUponRequest ? (
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="w-full rounded-[8px] border-dashed"
            onClick={() =>
              updateDocument(
                (prev) => ({
                  ...prev,
                  references: [
                    ...prev.references,
                    {
                      id: crypto.randomUUID(),
                      name: "",
                      relationship: "",
                      contact: "",
                    },
                  ],
                }),
                { sectionKey: "references" },
              )
            }
          >
            <Plus className="size-4" /> Add reference
          </Button>
        ) : null}
      </div>
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save References"
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete this reference?"
        description="This removes the reference from your CV."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!deleteId) return;
          updateDocument(
            (prev) => ({
              ...prev,
              references: prev.references.filter((row) => row.id !== deleteId),
            }),
            { sectionKey: "references" },
          );
          setDeleteId(null);
        }}
      />
    </EditorSectionCard>
  );
}

export function CustomSection({
  sectionId,
  label,
}: {
  sectionId: string;
  label: string;
}) {
  const { document, updateDocument, removeSection } = useEditor();
  const section = document.sections.find((s) => s.id === sectionId);
  const content = section?.content ?? "";
  const heading = section?.label ?? label;
  const { dirty, status, onSave } = useSectionSave(sectionId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <EditorSectionCard sectionId={sectionId} title={heading || "Custom Section"}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={`custom-heading-${sectionId}`}>Heading</Label>
          <Input
            id={`custom-heading-${sectionId}`}
            value={heading}
            onChange={(e) => {
              const value = e.target.value;
              updateDocument(
                (prev) => ({
                  ...prev,
                  sections: prev.sections.map((s) =>
                    s.id === sectionId ? { ...s, label: value } : s,
                  ),
                }),
                { sectionKey: sectionId },
              );
            }}
            placeholder="e.g. Professional Memberships"
            className="bg-paper"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <QuillEditor
            value={content}
            onChange={(html) =>
              updateDocument(
                (prev) => ({
                  ...prev,
                  sections: prev.sections.map((s) =>
                    s.id === sectionId ? { ...s, content: html } : s,
                  ),
                }),
                { sectionKey: sectionId },
              )
            }
            placeholder="Describe this section…"
            label={`${heading || "Custom"} description`}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="rounded-[8px] text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <X className="size-4" /> Delete section
          </Button>
        </div>
      </div>
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Section"
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this custom section?"
        description="The heading and description will be removed from your CV."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          removeSection(sectionId);
          setConfirmDelete(false);
        }}
      />
    </EditorSectionCard>
  );
}
