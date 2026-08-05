"use client";

import { cn } from "@/lib/utils";
import { lengthOptions } from "@/mocks/cover-letter-builder";
import type { LetterLength } from "@/features/cover-letter/types";

export function LengthSelector({
  value,
  onChange,
}: {
  value: LetterLength;
  onChange: (length: LetterLength) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {lengthOptions.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={selected}
            className={cn(
              "rounded-[12px] border px-2.5 py-3 text-center transition-colors",
              selected
                ? "border-emerald bg-emerald text-paper"
                : "border-line-strong bg-surface text-ink hover:border-emerald/40",
            )}
          >
            <p className="text-sm font-semibold">{opt.label}</p>
            <p
              className={cn(
                "mt-1 text-[0.68rem] font-medium",
                selected ? "text-paper/80" : "text-ink-faint",
              )}
            >
              {opt.words}
            </p>
          </button>
        );
      })}
    </div>
  );
}
