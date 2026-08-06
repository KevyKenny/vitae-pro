"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TemplateBadge } from "@/features/templates/types";

const LABEL: Record<TemplateBadge, string> = {
  free: "Free",
  premium: "Premium",
  recommended: "Recommended",
  "recruiter-favorite": "Recruiter Favorite",
  popular: "Popular",
};

export function TemplateBadges({
  badges,
  className,
}: {
  badges: TemplateBadge[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((b) => (
        <Badge
          key={b}
          variant={
            b === "premium" || b === "popular" || b === "recruiter-favorite"
              ? "gold"
              : b === "free"
                ? "outline"
                : "default"
          }
        >
          {LABEL[b]}
        </Badge>
      ))}
    </div>
  );
}
