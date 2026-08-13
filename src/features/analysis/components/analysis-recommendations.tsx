"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnalysisRecommendation } from "@/lib/analysis/types";

const priorityVariant = {
  critical: "gold" as const,
  high: "gold" as const,
  medium: "outline" as const,
  low: "muted" as const,
};

export function AnalysisRecommendations({
  title,
  items,
  onAction,
}: {
  title: string;
  items: AnalysisRecommendation[];
  onAction: (rec: AnalysisRecommendation) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="rounded-[12px] border border-line bg-surface p-3"
          >
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-ink-faint">{index + 1}.</span>
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
            </div>
            <p className="text-xs text-ink-soft">{item.reason}</p>
            {item.aiAction ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                shape="soft"
                className="mt-2"
                onClick={() => onAction(item)}
              >
                <Sparkles className="size-3.5" />
                Improve with AI
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
