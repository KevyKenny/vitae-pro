"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TemplateBadges } from "@/features/templates/components/template-badges";
import { MiniPreview } from "@/features/templates/components/template-card";
import type { GalleryTemplate } from "@/features/templates/types";

export function TemplatePreview({ template }: { template: GalleryTemplate }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div>
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Template preview
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
            {template.name}
          </h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
            {template.description}
          </p>
        </div>

        <TemplateBadges badges={template.badges} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Readability" value={`${template.readability}`} />
          <Stat label="Rating" value={`${template.rating.toFixed(1)} ★`} />
          <Stat label="Reviews" value={template.reviews.toLocaleString("en-US")} />
        </div>

        <InfoBlock title="Best suited for" items={template.bestFor} />
        <InfoBlock title="Features" items={template.features} />

        <div className="space-y-2 rounded-[14px] border border-line-strong bg-surface p-4">
          <Row label="Typography" value={template.typography} />
          <Row label="Layout style" value={template.layoutStyle} />
          <Row
            label="Career level"
            value={template.careerLevels.map((l) => l.replace("-", " ")).join(", ")}
          />
          <Row
            label="Industry"
            value={template.industries.join(", ")}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild shape="soft">
            <Link href={`/customize?template=${template.id}`}>Use Template</Link>
          </Button>
          <Button asChild variant="outline" shape="soft">
            <Link href={`/customize?template=${template.id}`}>Customize</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            shape="soft"
            onClick={() => toast.success("Template saved to My Templates")}
          >
            <Bookmark className="size-4" />
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            shape="soft"
            onClick={() => toast.message("Share link copied (UI only)")}
          >
            <Share2 className="size-4" />
            Share Preview
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-[18px] border border-line bg-paper-dim p-6 shadow-s"
      >
        <div className="mx-auto aspect-[3/4] max-w-md">
          <div
            className="h-full rounded-[12px] border border-line-strong bg-surface p-6 shadow-m"
            style={{ borderTopColor: template.accent, borderTopWidth: 4 }}
          >
            <MiniPreview accent={template.previewAccent} />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-ink-faint">
          Large preview · Apply template in the customizer for live CV content
        </p>
      </motion.div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-surface p-3">
      <p className="text-[0.68rem] font-semibold text-ink-faint uppercase">{label}</p>
      <p className="mt-1 font-serif text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
      <span className="text-sm text-ink-faint">{label}</span>
      <span className="text-sm font-medium text-ink sm:text-right">{value}</span>
    </div>
  );
}
