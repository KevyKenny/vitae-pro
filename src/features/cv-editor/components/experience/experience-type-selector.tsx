"use client";

import { EXPERIENCE_TYPE_OPTIONS } from "@/features/cv-editor/components/experience/experience-helpers";
import type { ExperienceTypeId } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

export function ExperienceTypeSelector({
  onSelect,
  className,
}: {
  onSelect: (type: ExperienceTypeId) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("space-y-3", className)}
      role="listbox"
      aria-label="Select experience type"
    >
      <div>
        <p className="font-serif text-lg font-semibold text-ink">
          Select experience type
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Choose employment, attachment, internship, freelance, volunteer, or
          another pathway — mix what reflects your journey.
        </p>
      </div>
      <div className="grid max-h-[min(60vh,420px)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {EXPERIENCE_TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              role="option"
              className="flex gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-3 text-left shadow-s transition hover:border-emerald/40 hover:bg-emerald-wash/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40"
              onClick={() => onSelect(option.id)}
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-wash text-emerald">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[0.78rem] text-ink-soft">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
