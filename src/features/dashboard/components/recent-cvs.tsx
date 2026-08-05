"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import type { CV } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

export function RecentCvs({ cvs }: { cvs: CV[] }) {
  const [items, setItems] = useState(cvs);

  function handleAction(action: string, title: string) {
    toast.message(`${action}`, { description: title });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No CVs yet"
        description="Create your first CV to start coaching, scoring, and exporting."
        actionLabel="Create New CV"
        onAction={() => handleAction("Create", "New CV")}
      />
    );
  }

  return (
    <SectionCard
      title="Recent CVs"
      action={
        <Link
          href="/cvs"
          className="text-[0.8rem] font-semibold text-emerald hover:underline"
        >
          View all →
        </Link>
      }
    >
      <ul className="divide-y divide-line pb-2">
        {items.map((cv) => (
          <motion.li
            key={cv.id}
            whileHover={{ backgroundColor: "var(--paper-dim)" }}
            className="-mx-2 rounded-[10px] px-2"
          >
            <div className="flex items-center gap-3.5 py-3.5">
              <div
                className="relative h-[50px] w-[38px] shrink-0 overflow-hidden rounded-[5px] border border-line bg-paper-dim"
                aria-hidden
              >
                <span className="absolute top-2 right-1.5 left-1.5 h-0.5 rounded bg-emerald/50" />
                <span className="absolute top-4 right-2 left-1.5 h-0.5 rounded bg-line-strong" />
                <span className="absolute top-6 right-3 left-1.5 h-0.5 rounded bg-line-strong" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[0.9rem] font-semibold text-ink">
                    {cv.title}
                  </p>
                  <Badge variant="outline">{cv.completion}%</Badge>
                </div>
                <p className="mt-0.5 text-[0.78rem] text-ink-faint">
                  Edited {formatRelativeTime(cv.updatedAt)} · {cv.templateName}
                </p>
              </div>
              <span className="hidden font-mono text-[0.85rem] text-emerald sm:inline rounded-[6px] bg-emerald-wash px-2.5 py-1">
                {cv.score}
              </span>
              <Button asChild size="sm" shape="soft" variant="outline">
                <Link href={`/cvs/${cv.id}/edit`}>Continue</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    shape="soft"
                    aria-label={`Actions for ${cv.title}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleAction("Continue", cv.title)}
                  >
                    <Pencil className="size-4" />
                    Continue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("Duplicated", cv.title)}
                  >
                    <Copy className="size-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("Rename", cv.title)}
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("Download", cv.title)}
                  >
                    <Download className="size-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setItems((prev) => prev.filter((item) => item.id !== cv.id));
                      toast.success("CV moved to trash", {
                        description: cv.title,
                      });
                    }}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.li>
        ))}
      </ul>
    </SectionCard>
  );
}
