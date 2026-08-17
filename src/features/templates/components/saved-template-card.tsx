"use client";

import Link from "next/link";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MiniPreview } from "@/features/templates/components/template-card";
import { getGalleryTemplateById } from "@/mocks/templates-gallery";
import type { SavedTemplateEntry } from "@/features/templates/types";
import { formatRelativeTime } from "@/lib/utils";

export function SavedTemplateCard({
  entry,
  onDuplicate,
  onDelete,
}: {
  entry: SavedTemplateEntry;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const template = getGalleryTemplateById(entry.templateId);

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      className="overflow-hidden rounded-[14px] border border-line-strong bg-surface shadow-s"
    >
      <div className="aspect-[4/3] bg-paper-dim p-3">
        <MiniPreview templateId={entry.templateId} />
      </div>
      <div className="space-y-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">{entry.name}</h3>
            <p className="text-[0.72rem] text-ink-faint">
              Edited {formatRelativeTime(entry.updatedAt)}
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {entry.kind}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button asChild size="sm" shape="soft" className="h-7 rounded-[8px] px-2.5">
            <Link href={`/customize?template=${entry.templateId}`}>Apply</Link>
          </Button>
          <Button asChild size="sm" variant="outline" shape="soft" className="h-7 rounded-[8px] px-2.5">
            <Link href={`/customize?template=${entry.templateId}`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            shape="soft"
            className="h-7 rounded-[8px] px-2"
            onClick={onDuplicate}
            aria-label="Duplicate"
          >
            <Copy className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            shape="soft"
            className="h-7 rounded-[8px] px-2 text-destructive"
            onClick={onDelete}
            aria-label="Delete"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
