"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import type { ResumeHealthItem } from "@/types";
import { cn } from "@/lib/utils";

const statusMap = {
  strong: { label: "Strong", variant: "default" as const },
  good: { label: "Good", variant: "outline" as const },
  "needs-work": { label: "Needs work", variant: "gold" as const },
};

export function ResumeHealth({ items }: { items: ResumeHealthItem[] }) {
  return (
    <SectionCard title="Resume Health">
      <div className="grid gap-3 pb-4 sm:grid-cols-2">
        {items.map((item) => {
          const status = statusMap[item.status];
          return (
            <motion.article
              key={item.id}
              whileHover={{ y: -2 }}
              className="rounded-[14px] border border-line bg-surface p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-ink">{item.label}</h3>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <p className="font-mono text-2xl font-medium text-emerald">
                {item.score}
                <span className="text-sm text-ink-faint">/100</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-dim">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    item.status === "needs-work" ? "bg-gold" : "bg-emerald-bright",
                  )}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65 }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-soft">{item.recommendation}</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                shape="soft"
                className="mt-3"
                onClick={() =>
                  toast.message("Opening improvements", {
                    description: item.label,
                  })
                }
              >
                Improve
              </Button>
            </motion.article>
          );
        })}
      </div>
    </SectionCard>
  );
}
