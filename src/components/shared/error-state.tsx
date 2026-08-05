"use client";

import { AlertTriangle, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  supportHref?: string;
  className?: string;
};

export function ErrorState({
  icon: Icon = AlertTriangle,
  title = "Something went wrong",
  description = "We couldn’t complete that action. Try again or contact support if it keeps happening.",
  onRetry,
  retryLabel = "Retry",
  supportHref = "/help",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-[14px] border border-destructive/25 bg-surface px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-[14px] bg-destructive/10 text-destructive">
        <Icon className="size-5" aria-hidden />
      </div>
      <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-ink-soft">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <Button type="button" shape="soft" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        <Button asChild type="button" variant="outline" shape="soft">
          <Link href={supportHref}>Get support</Link>
        </Button>
      </div>
    </div>
  );
}
