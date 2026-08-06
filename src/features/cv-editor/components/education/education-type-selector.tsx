"use client";

import { QUALIFICATION_OPTIONS } from "@/features/cv-editor/components/education/education-helpers";
import type { EducationQualificationType } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

export function EducationTypeSelector({
  onSelect,
  className,
}: {
  onSelect: (type: EducationQualificationType) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("space-y-3", className)}
      role="listbox"
      aria-label="Select qualification type"
    >
      <div>
        <p className="font-serif text-lg font-semibold text-ink">
          Select qualification type
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Choose the pathway that matches your credential. You can mix O Level,
          A Level, diplomas, degrees, and professional training on one CV.
        </p>
      </div>
      <div className="grid max-h-[min(60vh,420px)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {QUALIFICATION_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="option"
            className="rounded-[12px] border border-line bg-surface px-3.5 py-3 text-left shadow-s transition hover:border-emerald/40 hover:bg-emerald-wash/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40"
            onClick={() => onSelect(option.id)}
          >
            <span className="block text-sm font-semibold text-ink">
              {option.label}
            </span>
            <span className="mt-0.5 block text-[0.78rem] text-ink-soft">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
