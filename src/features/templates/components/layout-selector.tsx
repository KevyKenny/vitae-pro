"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { LayoutMode, PageSize } from "@/features/templates/types";

const LAYOUTS: { id: LayoutMode; label: string; hint: string }[] = [
  { id: "single", label: "Single column", hint: "ATS-safe classic" },
  { id: "two-column", label: "Two column", hint: "Skills + body" },
  { id: "sidebar", label: "Sidebar layout", hint: "Accent rail" },
];

export function LayoutSelector({
  layout,
  sectionSpacing,
  margins,
  pageSize,
  onLayoutChange,
  onSectionSpacingChange,
  onMarginsChange,
  onPageSizeChange,
}: {
  layout: LayoutMode;
  sectionSpacing: number;
  margins: number;
  pageSize: PageSize;
  onLayoutChange: (l: LayoutMode) => void;
  onSectionSpacingChange: (n: number) => void;
  onMarginsChange: (n: number) => void;
  onPageSizeChange: (s: PageSize) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {LAYOUTS.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={layout === l.id}
            onClick={() => onLayoutChange(l.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-[10px] border px-3.5 py-3 text-left",
              layout === l.id
                ? "border-emerald bg-emerald-wash"
                : "border-line-strong hover:border-emerald/40",
            )}
          >
            <span className="font-semibold text-ink">{l.label}</span>
            <span className="text-[0.74rem] text-ink-faint">{l.hint}</span>
          </button>
        ))}
      </div>

      <div>
        <Label htmlFor="section-spacing">
          Section spacing · {sectionSpacing}px
        </Label>
        <input
          id="section-spacing"
          type="range"
          min={8}
          max={28}
          value={sectionSpacing}
          onChange={(e) => onSectionSpacingChange(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--emerald)]"
        />
      </div>

      <div>
        <Label htmlFor="margins">Margins · {margins}px</Label>
        <input
          id="margins"
          type="range"
          min={28}
          max={64}
          value={margins}
          onChange={(e) => onMarginsChange(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--emerald)]"
        />
      </div>

      <div>
        <p className="mb-2 text-[0.7rem] font-semibold text-ink-faint uppercase">
          Page size
        </p>
        <div className="flex gap-2">
          {(["a4", "letter"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={pageSize === s}
              onClick={() => onPageSizeChange(s)}
              className={cn(
                "flex-1 rounded-[8px] border py-2 text-sm font-semibold uppercase",
                pageSize === s
                  ? "border-emerald bg-emerald text-paper"
                  : "border-line-strong text-ink-soft",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
