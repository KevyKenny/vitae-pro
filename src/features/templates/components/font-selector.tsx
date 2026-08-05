"use client";

import { templateFonts } from "@/mocks/templates-gallery";
import type { FontFamilyId } from "@/features/templates/types";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export function FontSelector({
  value,
  fontSize,
  headingStyle,
  bodySpacing,
  onFontChange,
  onFontSizeChange,
  onHeadingStyleChange,
  onBodySpacingChange,
}: {
  value: FontFamilyId;
  fontSize: number;
  headingStyle: "serif" | "sans" | "mixed";
  bodySpacing: number;
  onFontChange: (id: FontFamilyId) => void;
  onFontSizeChange: (n: number) => void;
  onHeadingStyleChange: (s: "serif" | "sans" | "mixed") => void;
  onBodySpacingChange: (n: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-[0.7rem] font-semibold text-ink-faint uppercase">
          Font family
        </p>
        <div className="grid grid-cols-2 gap-2">
          {templateFonts.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={value === f.id}
              onClick={() => onFontChange(f.id)}
              className={cn(
                "rounded-[10px] border px-3 py-2.5 text-left text-sm transition-colors",
                value === f.id
                  ? "border-emerald bg-emerald-wash"
                  : "border-line-strong hover:border-emerald/40",
              )}
              style={{ fontFamily: f.stack }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="font-size">Font size · {fontSize}pt</Label>
        <input
          id="font-size"
          type="range"
          min={9}
          max={14}
          step={0.5}
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--emerald)]"
        />
      </div>

      <div>
        <p className="mb-2 text-[0.7rem] font-semibold text-ink-faint uppercase">
          Heading style
        </p>
        <div className="flex gap-2">
          {(["serif", "sans", "mixed"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={headingStyle === s}
              onClick={() => onHeadingStyleChange(s)}
              className={cn(
                "flex-1 rounded-[8px] border py-2 text-sm font-semibold capitalize",
                headingStyle === s
                  ? "border-emerald bg-emerald text-paper"
                  : "border-line-strong text-ink-soft",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="body-spacing">Body spacing · {bodySpacing.toFixed(2)}</Label>
        <input
          id="body-spacing"
          type="range"
          min={1.2}
          max={1.8}
          step={0.05}
          value={bodySpacing}
          onChange={(e) => onBodySpacingChange(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--emerald)]"
        />
      </div>
    </div>
  );
}
