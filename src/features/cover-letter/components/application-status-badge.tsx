"use client";

import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/features/cover-letter/types";
import { Badge } from "@/components/ui/badge";

const STATUS_META: Record<
  ApplicationStatus,
  { label: string; variant: "default" | "gold" | "outline" | "muted" }
> = {
  draft: { label: "Draft", variant: "muted" },
  applied: { label: "Applied", variant: "outline" },
  interview: { label: "Interview", variant: "default" },
  offer: { label: "Offer", variant: "gold" },
  rejected: { label: "Rejected", variant: "muted" },
};

export function ApplicationStatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <Badge variant={meta.variant} className={cn(className)}>
      {meta.label}
    </Badge>
  );
}
