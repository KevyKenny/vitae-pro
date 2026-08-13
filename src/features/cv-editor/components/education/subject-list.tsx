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
  showHeaders,
}: {
  subject: SubjectGrade;
  onChange: (next: SubjectGrade) => void;
  onRemove: () => void;
  errorName?: string;
  errorGrade?: string;
  canRemove: boolean;
  showHeaders?: boolean;
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
        showHeaders={showHeaders}
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
                showHeaders={index === 0}
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
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-[0.82rem] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
        onClick={() => onChange([...subjects, createSubject()])}
      >
        <Plus className="size-3.5" aria-hidden />
        Add subject
      </button>
    </div>
  );
}
