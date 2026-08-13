"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Check,
  GripVertical,
  Trash2,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  ALevelForm,
  OLevelForm,
} from "@/features/cv-editor/components/education/exam-forms";
import {
  CertificateForm,
  ProfessionalForm,
  TertiaryForm,
  VocationalForm,
} from "@/features/cv-editor/components/education/qualification-forms";
import {
  educationCardSummary,
  validateEducationEntry,
} from "@/features/cv-editor/components/education/education-helpers";
import type { EducationEntry } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

export function EducationCard({
  entry,
  onChange,
  onRemove,
  defaultExpanded = false,
}: {
  entry: EducationEntry;
  onChange: (next: EducationEntry) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showErrors, setShowErrors] = useState(false);
  const summary = educationCardSummary(entry);
  const errors = useMemo(
    () => (showErrors || expanded ? validateEducationEntry(entry) : {}),
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
    switch (entry.qualificationType) {
      case "o-level":
        return (
          <OLevelForm
            entry={entry}
            onChange={onChange}
            errors={showErrors || expanded ? errors : {}}
          />
        );
      case "a-level":
        return (
          <ALevelForm
            entry={entry}
            onChange={onChange}
            errors={showErrors || expanded ? errors : {}}
          />
        );
      case "certificate":
        return (
          <CertificateForm
            entry={entry}
            onChange={onChange}
            errors={showErrors || expanded ? errors : {}}
          />
        );
      case "professional":
        return (
          <ProfessionalForm
            entry={entry}
            onChange={onChange}
            errors={showErrors || expanded ? errors : {}}
          />
        );
      case "vocational":
      case "short-course":
      case "apprenticeship":
        return (
          <VocationalForm
            entry={entry}
            onChange={onChange}
            errors={showErrors || expanded ? errors : {}}
          />
        );
      default:
        return (
          <TertiaryForm
            entry={entry}
            onChange={onChange}
            errors={showErrors || expanded ? errors : {}}
          />
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
      aria-labelledby={`edu-title-${entry.id}`}
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
          aria-controls={`edu-panel-${entry.id}`}
          onClick={() => {
            setExpanded((value) => !value);
            setShowErrors(true);
          }}
        >
          <span
            id={`edu-title-${entry.id}`}
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
          aria-label={expanded ? "Collapse education entry" : "Expand education entry"}
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
        <div id={`edu-panel-${entry.id}`} className="px-3 py-4 sm:px-4">
          {renderForm()}
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              shape="soft"
              aria-label="Delete education entry"
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

/** Alias requested in the brief */
export const QualificationCard = EducationCard;
