"use client";

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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubjectInput } from "@/features/cv-editor/components/education/subject-input";
import { createSubject } from "@/features/cv-editor/components/education/education-helpers";
import type { SubjectGrade } from "@/features/cv-editor/types";

function SortableSubjectRow({
  subject,
  onChange,
  onRemove,
  errorName,
  errorGrade,
  canRemove,
}: {
  subject: SubjectGrade;
  onChange: (next: SubjectGrade) => void;
  onRemove: () => void;
  errorName?: string;
  errorGrade?: string;
  canRemove: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: subject.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.75 : 1,
      }}
    >
      <SubjectInput
        subject={subject}
        onChange={onChange}
        onRemove={onRemove}
        canRemove={canRemove}
        errorName={errorName}
        errorGrade={errorGrade}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function SubjectList({
  subjects,
  onChange,
  errors = {},
}: {
  subjects: SubjectGrade[];
  onChange: (next: SubjectGrade[]) => void;
  errors?: Record<string, string>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = subjects.findIndex((s) => s.id === active.id);
    const newIndex = subjects.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(subjects, oldIndex, newIndex));
  }

  return (
    <div className="space-y-2" role="list" aria-label="Subjects">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={subjects.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {subjects.map((subject, index) => (
            <div key={subject.id} role="listitem">
              <SortableSubjectRow
                subject={subject}
                onChange={(next) => {
                  const copy = [...subjects];
                  copy[index] = next;
                  onChange(copy);
                }}
                onRemove={() =>
                  onChange(subjects.filter((s) => s.id !== subject.id))
                }
                canRemove={subjects.length > 1}
                errorName={errors[`subjects.${index}.name`]}
                errorGrade={errors[`subjects.${index}.grade`]}
              />
            </div>
          ))}
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        shape="soft"
        className="w-full rounded-[8px] border-dashed"
        onClick={() => onChange([...subjects, createSubject()])}
      >
        <Plus className="size-4" /> Add subject
      </Button>
    </div>
  );
}
