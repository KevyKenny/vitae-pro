"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentColorId, AppearanceTheme } from "@/features/settings/types";

const THEMES: {
  id: AppearanceTheme;
  label: string;
  icon: typeof Sun;
}[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

const ACCENTS: { id: AccentColorId; label: string; color: string }[] = [
  { id: "emerald", label: "Emerald", color: "#1F4D3D" },
  { id: "gold", label: "Gold", color: "#B08D3E" },
  { id: "navy", label: "Navy", color: "#1B3A4B" },
  { id: "slate", label: "Slate", color: "#2C3E50" },
  { id: "terracotta", label: "Terracotta", color: "#A8622E" },
];

export function ThemeSelector({
  theme,
  accent,
  onThemeChange,
  onAccentChange,
}: {
  theme: AppearanceTheme;
  accent: AccentColorId;
  onThemeChange: (theme: AppearanceTheme) => void;
  onAccentChange: (accent: AccentColorId) => void;
}) {
  const { setTheme } = useTheme();

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
          Theme
        </p>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  onThemeChange(t.id);
                  setTheme(t.id);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-[12px] border px-3 py-4 text-sm font-semibold transition-colors",
                  active
                    ? "border-emerald bg-emerald-wash text-emerald"
                    : "border-line-strong text-ink-soft hover:border-emerald/40",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
          Accent color
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-pressed={accent === a.id}
              aria-label={a.label}
              onClick={() => onAccentChange(a.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                accent === a.id
                  ? "border-emerald bg-emerald-wash"
                  : "border-line-strong",
              )}
            >
              <span
                className="size-4 rounded-full"
                style={{ background: a.color }}
                aria-hidden
              />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-[14px] border border-line-strong p-5"
        style={{
          borderColor:
            ACCENTS.find((a) => a.id === accent)?.color ?? "#1F4D3D",
        }}
      >
        <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
          Preview
        </p>
        <p className="mt-2 font-serif text-xl font-semibold text-ink">
          VitatePro looks like this
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Accent and theme apply across the app chrome.
        </p>
        <div
          className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-paper"
          style={{
            background:
              ACCENTS.find((a) => a.id === accent)?.color ?? "#1F4D3D",
          }}
        >
          Primary action
        </div>
      </div>
    </div>
  );
}
