"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ToggleSetting({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  statusLabel,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  statusLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-[12px] border border-line bg-surface px-4 py-3.5",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={id} className="text-sm font-semibold text-ink">
            {title}
          </label>
          {statusLabel ? (
            <span className="text-[0.68rem] font-semibold tracking-wide text-ink-faint uppercase">
              {statusLabel}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-1 text-[0.78rem] text-ink-soft">{description}</p>
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

export function NotificationSetting(props: {
  id: string;
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <ToggleSetting
      {...props}
      statusLabel={props.checked ? "On" : "Off"}
    />
  );
}
