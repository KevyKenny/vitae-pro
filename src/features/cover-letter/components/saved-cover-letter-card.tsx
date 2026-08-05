"use client";

import Link from "next/link";
import { Copy, Download, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApplicationStatusBadge } from "@/features/cover-letter/components/application-status-badge";
import type { SavedCoverLetterSummary } from "@/features/cover-letter/types";
import { formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

export function SavedCoverLetterCard({
  letter,
  onDuplicate,
  onDelete,
  onRename,
}: {
  letter: SavedCoverLetterSummary;
  onDuplicate: () => void;
  onDelete: () => void;
  onRename: () => void;
}) {
  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      className="rounded-[14px] border border-line-strong bg-surface p-4 shadow-s"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink">{letter.title}</h3>
          <p className="mt-0.5 text-sm text-ink-soft">
            {letter.company} · {letter.role}
          </p>
        </div>
        <ApplicationStatusBadge status={letter.applicationStatus} />
      </div>
      <p className="mt-3 text-[0.74rem] text-ink-faint">
        Created {formatRelativeTime(letter.createdAt)} · Edited{" "}
        {formatRelativeTime(letter.updatedAt)}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button asChild size="sm" shape="soft" className="rounded-[8px]">
          <Link href={`/cover-letter/${letter.id}`}>Open</Link>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => toast.success("Download (UI only)")}
        >
          <Download className="size-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              shape="soft"
              aria-label="More actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRename}>
              <Pencil className="size-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="size-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.article>
  );
}
