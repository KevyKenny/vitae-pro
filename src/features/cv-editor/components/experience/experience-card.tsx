"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  EmploymentForm,
  FreelanceForm,
  GraduateTraineeForm,
  IndustrialAttachmentForm,
  VolunteerForm,
} from "@/features/cv-editor/components/experience/experience-forms";
import {
  experienceCardSummary,
  validateExperienceEntry,
} from "@/features/cv-editor/components/experience/experience-helpers";
import type { ExperienceEntry } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

export function ExperienceCard({
  entry,
  onChange,
  onRemove,
  defaultExpanded = false,
}: {
  entry: ExperienceEntry;
  onChange: (next: ExperienceEntry) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showErrors, setShowErrors] = useState(false);
  const summary = experienceCardSummary(entry);
  const errors = useMemo(
    () => (showErrors || expanded ? validateExperienceEntry(entry) : {}),
    [entry, expanded, showErrors],
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  function renderForm() {
    const err = showErrors || expanded ? errors : {};
    switch (entry.experienceType) {
      case "industrial-attachment":
      case "internship":
        return (
          <IndustrialAttachmentForm
            entry={entry}
            onChange={onChange}
            errors={err}
          />
        );
      case "graduate-trainee":
        return (
          <GraduateTraineeForm entry={entry} onChange={onChange} errors={err} />
        );
      case "volunteer":
        return (
          <VolunteerForm entry={entry} onChange={onChange} errors={err} />
        );
      case "freelance":
        return (
          <FreelanceForm entry={entry} onChange={onChange} errors={err} />
        );
      default:
        return (
          <EmploymentForm entry={entry} onChange={onChange} errors={err} />
        );
    }
  }

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.72 : 1,
      }}
      className="rounded-lg border border-line bg-surface shadow-s"
      aria-labelledby={`exp-title-${entry.id}`}
    >
      <div className="flex items-start gap-2 border-b border-line px-3 py-3 sm:px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          className="mt-0.5 cursor-grab text-ink-faint"
          aria-label={`Reorder ${summary.title}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </Button>

        <button
          type="button"
          className="min-w-0 flex-1 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40"
          aria-expanded={expanded}
          aria-controls={`exp-panel-${entry.id}`}
          onClick={() => {
            setExpanded((value) => !value);
            setShowErrors(true);
          }}
        >
          <span
            id={`exp-title-${entry.id}`}
            className="block text-[0.92rem] font-semibold text-ink"
          >
            {summary.title}
          </span>
          <span className="mt-0.5 block text-sm text-ink-soft">
            {summary.subtitle}
          </span>
          {summary.meta ? (
            <span className="mt-1 block text-[0.78rem] text-ink-faint">
              {summary.meta}
            </span>
          ) : null}
        </button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          aria-label={
            expanded ? "Collapse experience entry" : "Expand experience entry"
          }
          aria-expanded={expanded}
          onClick={() => {
            setExpanded((value) => !value);
            setShowErrors(true);
          }}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </Button>
      </div>

      {expanded ? (
        <div id={`exp-panel-${entry.id}`} className="px-3 py-4 sm:px-4">
          {renderForm()}
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              shape="soft"
              aria-label="Delete experience entry"
              onClick={onRemove}
              className="rounded-md"
            >
              <Trash2 className="size-4" />
            </Button>
            <Button
              type="button"
              className="rounded-md bg-[#7c3aed] px-4 text-white hover:bg-[#6d28d9]"
              onClick={() => setExpanded(false)}
            >
              <Check className="size-4" />
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
