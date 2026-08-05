"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type PreferenceToggleProps = {
  id: string;
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

export function PreferenceToggle({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  className,
}: PreferenceToggleProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-[14px] border border-line bg-surface px-4 py-4",
        className,
      )}
    >
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {title}
        </label>
        {description ? (
          <p className="mt-1 text-xs text-ink-soft">{description}</p>
        ) : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  );
}
