"use client";

import { Label } from "@/components/ui/label";
import { colorPalettes } from "@/mocks/templates-gallery";
import type { ColorPalette } from "@/features/templates/types";
import { cn } from "@/lib/utils";

export function ColorPicker({
  primary,
  accent,
  background,
  text,
  onChange,
  onApplyPalette,
}: {
  primary: string;
  accent: string;
  background: string;
  text: string;
  onChange: (key: "primary" | "accent" | "background" | "text", value: string) => void;
  onApplyPalette: (palette: ColorPalette) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Swatch label="Primary" value={primary} onChange={(v) => onChange("primary", v)} />
        <Swatch label="Accent" value={accent} onChange={(v) => onChange("accent", v)} />
        <Swatch
          label="Background"
          value={background}
          onChange={(v) => onChange("background", v)}
        />
        <Swatch label="Text" value={text} onChange={(v) => onChange("text", v)} />
      </div>
      <div>
        <p className="mb-2 text-[0.7rem] font-semibold text-ink-faint uppercase">
          Preset palettes
        </p>
        <div className="grid grid-cols-3 gap-2">
          {colorPalettes.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onApplyPalette(p)}
              className="rounded-[10px] border border-line-strong p-2 text-left hover:border-emerald/40"
              aria-label={`Apply ${p.name} palette`}
            >
              <div className="mb-1.5 flex h-6 overflow-hidden rounded-[4px]">
                <span className="flex-1" style={{ background: p.primary }} />
                <span className="flex-1" style={{ background: p.accent }} />
                <span className="flex-1" style={{ background: p.background }} />
                <span className="flex-1" style={{ background: p.text }} />
              </div>
              <span className="text-[0.72rem] font-semibold text-ink">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Swatch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5">{label}</Label>
      <div className="flex items-center gap-2 rounded-[8px] border border-line-strong bg-surface px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("size-8 cursor-pointer rounded border-0 bg-transparent")}
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-mono text-[0.75rem] text-ink outline-none"
          aria-label={`${label} hex`}
        />
      </div>
    </div>
  );
}
