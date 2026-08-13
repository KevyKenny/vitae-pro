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
import { GraduationCap, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { EducationCard } from "@/features/cv-editor/components/education/education-card";
import { EducationTypeSelector } from "@/features/cv-editor/components/education/education-type-selector";
import { createEducationEntry } from "@/features/cv-editor/components/education/education-helpers";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useSectionId } from "@/features/cv-editor/hooks/use-section-id";
import { useSectionSave } from "@/features/cv-editor/hooks/use-section-save";
import type {
  EducationEntry,
  EducationQualificationType,
} from "@/features/cv-editor/types";

export function EducationSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("education");
  const { dirty, status, onSave } = useSectionSave("education");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function patchEducation(
    updater: (education: EducationEntry[]) => EducationEntry[],
  ) {
    updateDocument(
      (prev) => ({ ...prev, education: updater(prev.education) }),
      { sectionKey: "education" },
    );
  }

  function addOfType(type: EducationQualificationType) {
    const entry = createEducationEntry(type);
    patchEducation((education) => [...education, entry]);
    setNewEntryId(entry.id);
    setPickerOpen(false);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    patchEducation((education) => {
      const oldIndex = education.findIndex((e) => e.id === active.id);
      const newIndex = education.findIndex((e) => e.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return education;
      return arrayMove(education, oldIndex, newIndex);
    });
  }

  return (
    <EditorSectionCard sectionId={sectionId} title="Education">
      {document.education.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education added"
          description="Add O Level, A Level, certificates, diplomas, degrees, or vocational training — mix what fits your path."
          actionLabel="Add education"
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
              items={document.education.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {document.education.map((entry) => (
                <EducationCard
                  key={entry.id}
                  entry={entry}
                  defaultExpanded={entry.id === newEntryId}
                  onChange={(next) => {
                    patchEducation((education) =>
                      education.map((e) => (e.id === entry.id ? next : e)),
                    );
                  }}
                  onRemove={() =>
                    patchEducation((education) =>
                      education.filter((e) => e.id !== entry.id),
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
            Add education
          </button>
        </div>
      )}

      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Education"
      />

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="sr-only">
              Select qualification type
            </DialogTitle>
          </DialogHeader>
          <EducationTypeSelector onSelect={addOfType} />
        </DialogContent>
      </Dialog>
    </EditorSectionCard>
  );
}
