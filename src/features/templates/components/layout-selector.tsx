"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { LayoutMode } from "@/features/templates/types";

const LAYOUTS: { id: LayoutMode; label: string; hint: string }[] = [
  { id: "single", label: "Single column", hint: "Classic single column" },
  { id: "two-column", label: "Two column", hint: "Skills + body" },
  { id: "sidebar", label: "Sidebar layout", hint: "Accent rail" },
];

export function LayoutSelector({
  layout,
  sectionSpacing,
  margins,
  onLayoutChange,
  onSectionSpacingChange,
  onMarginsChange,
}: {
  layout: LayoutMode;
  sectionSpacing: number;
  margins: number;
  onLayoutChange: (l: LayoutMode) => void;
  onSectionSpacingChange: (n: number) => void;
  onMarginsChange: (n: number) => void;
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

      <p className="text-[0.78rem] text-ink-soft">
        PDF export uses <span className="font-semibold text-ink">A4</span> page
        size.
      </p>
    </div>
  );
}
