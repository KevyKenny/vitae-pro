"use client";

import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";
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
        <p className="text-sm font-semibold text-ink">{entry.name || "Untitled project"}</p>
        <Button type="button" variant="ghost" size="icon-sm" shape="soft" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">Project name</Label>
          <Input
            value={entry.name}
            onChange={(e) => onChange({ ...entry, name: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[0.76rem] uppercase text-ink-soft">Description</Label>
            <div className="flex gap-1">
              <AIActionButton
                label="Improve"
                onClick={() => toast.message("Improve project description (mock)")}
              />
              <AIActionButton
                label="Highlight achievements"
                onClick={() => toast.message("Highlight achievements (mock)")}
              />
            </div>
          </div>
          <Textarea
            rows={3}
            value={entry.description}
            onChange={(e) => onChange({ ...entry, description: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">Technologies</Label>
            <Input
              value={entry.technologies.join(", ")}
              onChange={(e) =>
                onChange({
                  ...entry,
                  technologies: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              className="bg-surface"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">Link</Label>
            <Input
              value={entry.link}
              onChange={(e) => onChange({ ...entry, link: e.target.value })}
              className="bg-surface"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { document, updateDocument } = useEditor();

  function setProjects(projects: ProjectEntry[]) {
    updateDocument((prev) => ({ ...prev, projects }));
  }

  return (
    <EditorSectionCard sectionId="sec_projects" title="Projects">
      {document.projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects added"
          description="Showcase portfolio work with tech stack and outcomes."
          actionLabel="Add project"
          onAction={() =>
            setProjects([
              {
                id: `pr_${Date.now()}`,
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
          {document.projects.map((entry, index) => (
            <ProjectCard
              key={entry.id}
              entry={entry}
              onChange={(next) => {
                const projects = [...document.projects];
                projects[index] = next;
                setProjects(projects);
              }}
              onRemove={() =>
                setProjects(document.projects.filter((p) => p.id !== entry.id))
              }
            />
          ))}
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="w-full rounded-[8px] border-dashed"
            onClick={() =>
              setProjects([
                ...document.projects,
                {
                  id: `pr_${Date.now()}`,
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
    </EditorSectionCard>
  );
}
