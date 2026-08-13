"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Briefcase, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { ExperienceCard } from "@/features/cv-editor/components/experience/experience-card";
import { ExperienceTypeSelector } from "@/features/cv-editor/components/experience/experience-type-selector";
import { createExperienceEntry } from "@/features/cv-editor/components/experience/experience-helpers";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useSectionId } from "@/features/cv-editor/hooks/use-section-id";
import { useSectionSave } from "@/features/cv-editor/hooks/use-section-save";
import type {
  ExperienceEntry,
  ExperienceTypeId,
} from "@/features/cv-editor/types";

export function ExperienceSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("experience");
  const { dirty, status, onSave } = useSectionSave("experience");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function patchExperience(
    updater: (experience: ExperienceEntry[]) => ExperienceEntry[],
  ) {
    updateDocument(
      (prev) => ({ ...prev, experience: updater(prev.experience) }),
      { sectionKey: "experience" },
    );
  }

  function addOfType(type: ExperienceTypeId) {
    const entry = createExperienceEntry(type);
    patchExperience((experience) => [...experience, entry]);
    setNewEntryId(entry.id);
    setPickerOpen(false);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    patchExperience((experience) => {
      const oldIndex = experience.findIndex((e) => e.id === active.id);
      const newIndex = experience.findIndex((e) => e.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return experience;
      return arrayMove(experience, oldIndex, newIndex);
    });
  }

  return (
    <EditorSectionCard sectionId={sectionId} title="Employment">
      {document.experience.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience added"
          description="Add full-time roles, industrial attachments, internships, freelance work, volunteer experience, and more."
          actionLabel="Add experience"
          onAction={() => setPickerOpen(true)}
          className="border-0 bg-transparent py-8"
        />
      ) : (
        <div className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={document.experience.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {document.experience.map((entry) => (
                <ExperienceCard
                  key={entry.id}
                  entry={entry}
                  defaultExpanded={entry.id === newEntryId}
                  onChange={(next) => {
                    patchExperience((experience) =>
                      experience.map((e) => (e.id === entry.id ? next : e)),
                    );
                  }}
                  onRemove={() =>
                    patchExperience((experience) =>
                      experience.filter((e) => e.id !== entry.id),
                    )
                  }
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-[0.82rem] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="size-3.5" aria-hidden />
            Add experience
          </button>
        </div>
      )}

      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Experience"
      />

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="sr-only">
              Select experience type
            </DialogTitle>
          </DialogHeader>
          <ExperienceTypeSelector onSelect={addOfType} />
        </DialogContent>
      </Dialog>
    </EditorSectionCard>
  );
}
