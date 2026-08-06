"use client";

import { Loader2, Check, AlertCircle, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SaveStatus } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

export function SaveIndicator({
  status,
  onRetry,
}: {
  status: SaveStatus;
  onRetry?: () => void;
}) {
  const map = {
    saved: {
      label: "All changes saved",
      icon: Check,
      className: "text-ink-faint",
      dot: "bg-emerald-bright",
    },
    saving: {
      label: "Saving…",
      icon: Loader2,
      className: "text-ink-soft",
      dot: "bg-gold animate-pulse",
    },
    unsaved: {
      label: "Unsaved changes",
      icon: CloudOff,
      className: "text-ink-faint",
      dot: "bg-gold",
    },
    failed: {
      label: "Save failed",
      icon: AlertCircle,
      className: "text-destructive",
      dot: "bg-destructive",
    },
  }[status];

  const Icon = map.icon;

  return (
    <div
      className={cn(
        "hidden items-center gap-2 text-[0.74rem] sm:flex",
        map.className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", map.dot)} aria-hidden />
      {status === "saving" || status === "failed" ? (
        <Icon
          className={cn("size-3.5", status === "saving" && "animate-spin")}
          aria-hidden
        />
      ) : null}
      <span>{map.label}</span>
      {status === "failed" && onRetry ? (
        <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
