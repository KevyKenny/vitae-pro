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
import { Button } from "@/components/ui/button";
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
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type {
  ExperienceEntry,
  ExperienceTypeId,
} from "@/features/cv-editor/types";

export function ExperienceSection() {
  const { document, updateDocument } = useEditor();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function setExperience(experience: ExperienceEntry[]) {
    updateDocument((prev) => ({ ...prev, experience }));
  }

  function addOfType(type: ExperienceTypeId) {
    const entry = createExperienceEntry(type);
    setExperience([...document.experience, entry]);
    setNewEntryId(entry.id);
    setPickerOpen(false);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = document.experience.findIndex((e) => e.id === active.id);
    const newIndex = document.experience.findIndex((e) => e.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setExperience(arrayMove(document.experience, oldIndex, newIndex));
  }

  return (
    <EditorSectionCard sectionId="sec_experience" title="Work Experience">
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
                    setExperience(
                      document.experience.map((e) =>
                        e.id === entry.id ? next : e,
                      ),
                    );
                  }}
                  onRemove={() =>
                    setExperience(
                      document.experience.filter((e) => e.id !== entry.id),
                    )
                  }
                  onDuplicate={() => {
                    const copy = structuredClone(entry) as ExperienceEntry;
                    copy.id = `exp_${Date.now()}`;
                    setExperience([...document.experience, copy]);
                    setNewEntryId(copy.id);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="w-full rounded-[8px] border-dashed"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="size-4" /> Add experience
          </Button>
        </div>
      )}

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
