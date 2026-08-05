import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  success: "bg-success-wash text-success border-transparent",
  warning: "bg-warning-wash text-warning border-transparent",
  error: "bg-destructive/10 text-destructive border-transparent",
  info: "bg-info-wash text-info border-transparent",
  neutral: "bg-paper-dim text-ink-soft border-transparent",
} as const;

export function StatusBadge({
  status = "neutral",
  children,
  className,
}: {
  status?: keyof typeof STATUS_STYLES;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressIndicator({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1.5 flex justify-between text-[0.74rem]">
          <span className="text-ink-soft">{label}</span>
          <span className="font-mono font-medium text-ink">{clamped}%</span>
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-full bg-paper-dim"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full bg-emerald transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
