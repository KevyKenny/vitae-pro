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
import { Button } from "@/components/ui/button";
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
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type {
  EducationEntry,
  EducationQualificationType,
} from "@/features/cv-editor/types";

export function EducationSection() {
  const { document, updateDocument } = useEditor();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function setEducation(education: EducationEntry[]) {
    updateDocument((prev) => ({ ...prev, education }));
  }

  function addOfType(type: EducationQualificationType) {
    const entry = createEducationEntry(type);
    setEducation([...document.education, entry]);
    setNewEntryId(entry.id);
    setPickerOpen(false);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = document.education.findIndex((e) => e.id === active.id);
    const newIndex = document.education.findIndex((e) => e.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setEducation(arrayMove(document.education, oldIndex, newIndex));
  }

  return (
    <EditorSectionCard sectionId="sec_education" title="Education">
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
                    setEducation(
                      document.education.map((e) =>
                        e.id === entry.id ? next : e,
                      ),
                    );
                  }}
                  onRemove={() =>
                    setEducation(
                      document.education.filter((e) => e.id !== entry.id),
                    )
                  }
                  onDuplicate={() => {
                    const copy = structuredClone(entry) as EducationEntry;
                    copy.id = `edu_${Date.now()}`;
                    if ("subjects" in copy) {
                      copy.subjects = copy.subjects.map((s) => ({
                        ...s,
                        id: `subj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                      }));
                    }
                    setEducation([...document.education, copy]);
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
            <Plus className="size-4" /> Add education
          </Button>
        </div>
      )}

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
