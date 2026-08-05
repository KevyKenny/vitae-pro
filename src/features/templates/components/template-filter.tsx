"use client";

import { cn } from "@/lib/utils";
import type {
  AtsLevel,
  CareerLevel,
  Industry,
  TemplateStyle,
} from "@/features/templates/types";

export type TemplateFiltersState = {
  style: TemplateStyle | "all";
  careerLevel: CareerLevel | "all";
  industry: Industry | "all";
  ats: AtsLevel | "all" | "any";
};

const STYLES: { id: TemplateStyle | "all"; label: string }[] = [
  { id: "all", label: "All styles" },
  { id: "modern", label: "Modern" },
  { id: "professional", label: "Professional" },
  { id: "minimal", label: "Minimal" },
  { id: "executive", label: "Executive" },
  { id: "creative", label: "Creative" },
  { id: "academic", label: "Academic" },
];

const LEVELS: { id: CareerLevel | "all"; label: string }[] = [
  { id: "all", label: "All levels" },
  { id: "student", label: "Student" },
  { id: "graduate", label: "Graduate" },
  { id: "junior", label: "Junior" },
  { id: "mid-level", label: "Mid-Level" },
  { id: "senior", label: "Senior" },
  { id: "executive", label: "Executive" },
];

const INDUSTRIES: { id: Industry | "all"; label: string }[] = [
  { id: "all", label: "All industries" },
  { id: "technology", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "healthcare", label: "Healthcare" },
  { id: "marketing", label: "Marketing" },
  { id: "engineering", label: "Engineering" },
  { id: "design", label: "Design" },
];

const ATS: { id: TemplateFiltersState["ats"]; label: string }[] = [
  { id: "any", label: "Any ATS" },
  { id: "friendly", label: "ATS Friendly" },
  { id: "highly-optimized", label: "Highly Optimized" },
];

export function TemplateFilter({
  filters,
  onChange,
}: {
  filters: TemplateFiltersState;
  onChange: (next: TemplateFiltersState) => void;
}) {
  return (
    <div className="space-y-4">
      <FilterRow
        label="Style"
        options={STYLES}
        value={filters.style}
        onSelect={(style) => onChange({ ...filters, style })}
      />
      <FilterRow
        label="Career level"
        options={LEVELS}
        value={filters.careerLevel}
        onSelect={(careerLevel) => onChange({ ...filters, careerLevel })}
      />
      <FilterRow
        label="Industry"
        options={INDUSTRIES}
        value={filters.industry}
        onSelect={(industry) => onChange({ ...filters, industry })}
      />
      <FilterRow
        label="ATS compatibility"
        options={ATS}
        value={filters.ats}
        onSelect={(ats) => onChange({ ...filters, ats })}
      />
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(opt.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors",
                active
                  ? "border-emerald bg-emerald text-paper"
                  : "border-line-strong bg-surface text-ink-soft hover:border-emerald/50 hover:text-emerald",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
