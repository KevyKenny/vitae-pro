"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MiniPreview } from "@/features/templates/components/template-card";
import type { GalleryTemplate } from "@/features/templates/types";

export function TemplateComparison({
  templates,
  onRemove,
  onClear,
}: {
  templates: GalleryTemplate[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (templates.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="sticky bottom-4 z-20 rounded-[16px] border border-line-strong bg-surface/95 p-4 shadow-l backdrop-blur"
        aria-label="Template comparison"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">
              Compare templates
            </h2>
            <p className="text-sm text-ink-soft">
              Up to 3 designs · layout, readability, rating
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" shape="soft" onClick={onClear}>
            Clear
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className="relative rounded-[12px] border border-line bg-paper-dim/50 p-3"
            >
              <button
                type="button"
                className="absolute top-2 right-2 rounded-[6px] p-1 text-ink-faint hover:bg-surface hover:text-ink"
                aria-label={`Remove ${t.name}`}
                onClick={() => onRemove(t.id)}
              >
                <X className="size-3.5" />
              </button>
              <div className="mb-2 h-28">
                <MiniPreview accent={t.previewAccent} />
              </div>
              <p className="font-semibold text-ink">{t.name}</p>
              <p className="text-[0.72rem] capitalize text-ink-faint">{t.style}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="default">Readability {t.readability}</Badge>
                <Badge variant="outline">Rating {t.rating.toFixed(1)} ★</Badge>
              </div>
              <p className="mt-2 text-[0.74rem] text-ink-soft">
                Best for: {t.bestFor.slice(0, 2).join(", ")}
              </p>
              <Button asChild size="sm" shape="soft" className="mt-3 w-full rounded-[8px]">
                <Link href={`/customize?template=${t.id}`}>Use</Link>
              </Button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 3 - templates.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex min-h-[200px] items-center justify-center rounded-[12px] border border-dashed border-line-strong text-sm text-ink-faint"
            >
              Add another template
            </div>
          ))}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
