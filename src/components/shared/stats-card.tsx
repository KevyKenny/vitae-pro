import { cn } from "@/lib/utils";

type StatsCardProps = {
  label: string;
  value: string | number;
  suffix?: string;
  hint?: string;
  progress?: number;
  tone?: "default" | "emerald" | "gold";
  className?: string;
};

export function StatsCard({
  label,
  value,
  suffix,
  hint,
  progress,
  tone = "default",
  className,
}: StatsCardProps) {
  return (
    <article
      className={cn(
        "rounded-[14px] border border-line bg-surface px-[22px] pt-[22px] pb-5",
        className,
      )}
    >
      <p className="mb-3.5 text-[0.78rem] font-semibold text-ink-soft">{label}</p>
      <p
        className={cn(
          "font-mono text-[1.9rem] font-medium leading-none",
          tone === "emerald" && "text-emerald",
          tone === "gold" && "text-gold",
          tone === "default" && "text-ink",
        )}
      >
        {value}
        {suffix ? (
          <span className="text-base text-ink-faint">{suffix}</span>
        ) : null}
      </p>
      {typeof progress === "number" ? (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-paper-dim">
          <div
            className={cn(
              "h-full rounded",
              tone === "gold" ? "bg-gold" : "bg-emerald-bright",
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      {hint ? (
        <p
          className={cn(
            "text-[0.78rem] text-ink-faint",
            typeof progress === "number" ? "mt-2" : "mt-3.5",
          )}
        >
          {hint}
        </p>
      ) : null}
    </article>
  );
}
