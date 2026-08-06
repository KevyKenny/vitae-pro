"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LetterTemplate } from "@/features/cover-letter/types";

export function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: LetterTemplate;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      className={cn(
        "overflow-hidden rounded-[14px] border bg-surface shadow-s transition-colors",
        selected ? "border-emerald ring-2 ring-emerald/20" : "border-line-strong",
      )}
    >
      <div
        className={cn(
          "flex h-28 items-end bg-paper-dim p-3",
          template.id === "executive" && "bg-emerald-wash",
          template.id === "creative" && "bg-gold-wash",
          template.id === "minimal" && "bg-paper",
        )}
        aria-hidden
      >
        <div className="w-full rounded-[6px] border border-line bg-surface p-2 shadow-s">
          <div className="mb-1.5 h-2 w-1/3 rounded bg-ink/80" />
          <div className="space-y-1">
            <div className="h-1 w-full rounded bg-line-strong" />
            <div className="h-1 w-5/6 rounded bg-line" />
            <div className="h-1 w-4/5 rounded bg-line" />
          </div>
        </div>
      </div>
      <div className="space-y-2 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-ink">{template.name}</h3>
          <Badge variant="gold">Creative</Badge>
        </div>
        <p className="text-[0.78rem] leading-snug text-ink-soft">
          {template.description}
        </p>
        <Button
          type="button"
          size="sm"
          shape="soft"
          variant={selected ? "primary" : "outline"}
          className="w-full rounded-[8px]"
          onClick={onSelect}
        >
          {selected ? (
            <>
              <Check className="size-3.5" /> Selected
            </>
          ) : (
            "Select"
          )}
        </Button>
      </div>
    </motion.article>
  );
}
