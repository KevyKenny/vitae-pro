"use client";

import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import { TagListInput } from "@/features/cv-editor/components/tag-list-input";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useSectionId } from "@/features/cv-editor/hooks/use-section-id";
import { useSectionSave } from "@/features/cv-editor/hooks/use-section-save";
import type { ProjectEntry } from "@/features/cv-editor/types";

export function ProjectCard({
  entry,
  onChange,
  onRemove,
}: {
  entry: ProjectEntry;
  onChange: (entry: ProjectEntry) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-[12px] border border-line bg-paper-dim/40 p-4">
      <div className="mb-3 flex justify-between">
        <p className="text-sm font-semibold text-ink">
          {entry.name || "Untitled project"}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          onClick={onRemove}
          aria-label="Remove project"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Project name
          </Label>
          <Input
            value={entry.name}
            onChange={(e) => onChange({ ...entry, name: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Description
          </Label>
          <Textarea
            rows={3}
            value={entry.description}
            onChange={(e) =>
              onChange({ ...entry, description: e.target.value })
            }
            className="bg-surface"
          />
        </div>
        <TagListInput
          label="Tech used"
          placeholder="JavaScript"
          value={entry.technologies}
          onChange={(technologies) => onChange({ ...entry, technologies })}
        />
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">Link</Label>
          <Input
            value={entry.link}
            onChange={(e) => onChange({ ...entry, link: e.target.value })}
            placeholder="https://github.com/yourname/project"
            className="bg-surface"
          />
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("projects");
  const { dirty, status, onSave } = useSectionSave("projects");

  function patchProjects(
    updater: (projects: ProjectEntry[]) => ProjectEntry[],
  ) {
    updateDocument(
      (prev) => ({ ...prev, projects: updater(prev.projects) }),
      { sectionKey: "projects" },
    );
  }

  return (
    <EditorSectionCard sectionId={sectionId} title="Projects">
      {document.projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects added"
          description="Showcase portfolio work with tech stack and outcomes."
          actionLabel="Add project"
          onAction={() =>
            patchProjects(() => [
              {
                id: crypto.randomUUID(),
                name: "",
                description: "",
                technologies: [],
                link: "",
              },
            ])
          }
          className="border-0 bg-transparent py-8"
        />
      ) : (
        <div className="space-y-4">
          {document.projects.map((entry) => (
            <ProjectCard
              key={entry.id}
              entry={entry}
              onChange={(next) => {
                patchProjects((projects) =>
                  projects.map((p) => (p.id === entry.id ? next : p)),
                );
              }}
              onRemove={() =>
                patchProjects((projects) =>
                  projects.filter((p) => p.id !== entry.id),
                )
              }
            />
          ))}
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="w-full rounded-[8px] border-dashed"
            onClick={() =>
              patchProjects((projects) => [
                ...projects,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  description: "",
                  technologies: [],
                  link: "",
                },
              ])
            }
          >
            <Plus className="size-4" /> Add project
          </Button>
        </div>
      )}
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Projects"
      />
    </EditorSectionCard>
  );
}
