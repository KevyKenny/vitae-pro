"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import type { AISuggestion } from "@/types";

const priorityBadge = {
  high: "gold" as const,
  medium: "default" as const,
  low: "muted" as const,
};

export function AiInsights({ suggestions }: { suggestions: AISuggestion[] }) {
  const [items, setItems] = useState(suggestions);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No AI suggestions"
        description="When your coach has notes, they’ll appear here with clear next steps."
      />
    );
  }

  return (
    <SectionCard title="AI Insights">
      <ul className="space-y-3 pb-4">
        {items.map((item) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[14px] border border-line bg-paper-dim/40 p-4"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={priorityBadge[item.priority ?? "medium"]}>
                {(item.priority ?? "medium").toUpperCase()}
              </Badge>
              <Badge variant="outline">{item.category ?? item.section}</Badge>
              {item.impact ? (
                <span className="text-xs font-semibold text-emerald">
                  {item.impact}
                </span>
              ) : null}
            </div>
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{item.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                shape="soft"
                onClick={() =>
                  toast.success("Improvement queued", {
                    description: item.title,
                  })
                }
              >
                {item.ctaLabel}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                shape="soft"
                onClick={() =>
                  toast.message("Saved for later", { description: item.title })
                }
              >
                <Bookmark className="size-3.5" />
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                shape="soft"
                onClick={() =>
                  setItems((prev) => prev.filter((s) => s.id !== item.id))
                }
              >
                <X className="size-3.5" />
                Dismiss
              </Button>
            </div>
          </motion.li>
        ))}
      </ul>
    </SectionCard>
  );
}
