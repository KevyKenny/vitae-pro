"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateBadges } from "@/features/templates/components/template-badges";
import type { GalleryTemplate } from "@/features/templates/types";
import { cn } from "@/lib/utils";

export function TemplateCard({
  template,
  selected,
  onToggleCompare,
}: {
  template: GalleryTemplate;
  selected?: boolean;
  onToggleCompare?: () => void;
}) {
  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={cn(
        "group overflow-hidden rounded-[14px] border bg-surface shadow-s",
        selected ? "border-emerald ring-2 ring-emerald/15" : "border-line",
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-paper-dim p-4">
        <MiniPreview accent={template.previewAccent} />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-emerald/90 opacity-0 transition-opacity group-hover:opacity-100">
          <Button asChild size="sm" shape="soft" className="rounded-full bg-paper text-emerald hover:bg-paper">
            <Link href={`/customize?template=${template.id}`}>Use Template</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            shape="soft"
            className="rounded-full border-paper/50 bg-transparent text-paper hover:bg-paper/10"
          >
            <Link href={`/templates/${template.id}`}>Preview</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-ink">{template.name}</h3>
            <p className="text-[0.74rem] capitalize text-ink-faint">
              {template.style} · {template.careerLevels[0]?.replace("-", " ")}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[0.74rem] font-semibold text-ink">
            <Star className="size-3.5 fill-gold text-gold" aria-hidden />
            {template.rating.toFixed(1)}
          </div>
        </div>
        <TemplateBadges badges={template.badges.slice(0, 2)} />
        <div className="flex items-center gap-2">
          <Button asChild size="sm" shape="soft" className="flex-1 rounded-[8px]">
            <Link href={`/customize?template=${template.id}`}>Customize</Link>
          </Button>
          {onToggleCompare ? (
            <Button
              type="button"
              size="sm"
              variant={selected ? "primary" : "outline"}
              shape="soft"
              className="rounded-[8px]"
              onClick={onToggleCompare}
              aria-pressed={selected}
            >
              {selected ? "Comparing" : "Compare"}
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function MiniPreview({ accent }: { accent: string }) {
  const widths = [60, 90, 40, 75, 65, 80, 55];
  return (
    <div className="h-full rounded-[8px] border border-line bg-surface p-3 shadow-s">
      <div
        className="mb-3 h-2.5 rounded-sm opacity-90"
        style={{ width: `${widths[0]}%`, background: accent }}
      />
      {widths.slice(1).map((w, i) => (
        <div
          key={i}
          className="mb-1.5 h-1.5 rounded-sm bg-ink/10"
          style={{ width: `${w}%` }}
        />
      ))}
      <div className="mt-4 space-y-1.5">
        {[70, 85, 60].map((w, i) => (
          <div
            key={i}
            className="h-1 rounded-sm bg-ink/[0.07]"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}
