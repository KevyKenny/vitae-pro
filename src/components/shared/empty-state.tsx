import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  guidance?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  guidance,
  actionLabel,
  onAction,
  actionHref,
  secondaryLabel,
  onSecondary,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[14px] border border-dashed border-line-strong bg-surface px-6 py-14 text-center sm:py-16",
        className,
      )}
    >
      {Icon ? (
        <div
          className="mb-4 flex size-14 items-center justify-center rounded-[16px] bg-emerald-wash text-emerald"
          aria-hidden
        >
          <Icon className="size-6" />
        </div>
      ) : (
        <div
          className="mb-4 h-16 w-24 rounded-[14px] bg-gradient-to-br from-emerald-wash via-paper-dim to-gold-wash"
          aria-hidden
        />
      )}
      <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {guidance ? (
        <p className="mt-2 max-w-sm text-[0.78rem] text-ink-faint">{guidance}</p>
      ) : null}
      {(actionLabel && (onAction || actionHref)) ||
      (secondaryLabel && onSecondary) ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {actionLabel && actionHref ? (
            <Button asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : null}
          {actionLabel && onAction && !actionHref ? (
            <Button type="button" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          {secondaryLabel && onSecondary ? (
            <Button type="button" variant="outline" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
