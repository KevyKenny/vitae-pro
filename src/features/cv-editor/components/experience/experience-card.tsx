"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  GripVertical,
  Trash2,
} from "lucide-react";
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
  EXPERIENCE_TYPE_OPTIONS,
  experienceCardSummary,
  validateExperienceEntry,
} from "@/features/cv-editor/components/experience/experience-helpers";
import type { ExperienceEntry } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

export function ExperienceCard({
  entry,
  onChange,
  onRemove,
  onDuplicate,
  defaultExpanded = false,
}: {
  entry: ExperienceEntry;
  onChange: (next: ExperienceEntry) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showErrors, setShowErrors] = useState(false);
  const summary = experienceCardSummary(entry);
  const errors = useMemo(
    () => (showErrors || expanded ? validateExperienceEntry(entry) : {}),
    [entry, expanded, showErrors],
  );
  const Icon =
    EXPERIENCE_TYPE_OPTIONS.find((o) => o.id === entry.experienceType)?.icon ??
    EXPERIENCE_TYPE_OPTIONS[0].icon;

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
      className="rounded-[14px] border border-line bg-paper-dim/40 shadow-s"
      aria-labelledby={`exp-title-${entry.id}`}
    >
      <div className="flex items-start gap-2 p-3 sm:p-4">
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
          className="min-w-0 flex-1 rounded-[10px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40"
          aria-expanded={expanded}
          aria-controls={`exp-panel-${entry.id}`}
          onClick={() => {
            setExpanded((v) => !v);
            setShowErrors(true);
          }}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-wash text-emerald">
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="mb-1 inline-block rounded-full bg-surface px-2 py-0.5 text-[0.68rem] font-semibold text-ink-soft">
                {summary.badge}
              </span>
              <span
                id={`exp-title-${entry.id}`}
                className="block font-semibold text-ink"
              >
                {summary.title}
              </span>
              <span className="mt-0.5 block text-sm text-ink-soft">
                {summary.subtitle}
              </span>
              <span className="mt-1 block text-[0.78rem] text-ink-faint">
                {summary.meta}
              </span>
            </span>
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label="Duplicate experience"
            onClick={onDuplicate}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label="Delete experience"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
            onClick={() => {
              setExpanded((v) => !v);
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
      </div>

      {expanded ? (
        <div
          id={`exp-panel-${entry.id}`}
          className="border-t border-line px-3 pt-3 pb-4 sm:px-4"
        >
          {renderForm()}
        </div>
      ) : null}
    </article>
  );
}
