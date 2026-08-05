"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  LayoutTemplate,
  Redo2,
  Settings,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveIndicator } from "@/features/cv-editor/components/save-indicator";
import { ApplicationStatusBadge } from "@/features/cover-letter/components/application-status-badge";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import type { ApplicationStatus } from "@/features/cover-letter/types";

const STATUSES: ApplicationStatus[] = [
  "draft",
  "applied",
  "interview",
  "offer",
  "rejected",
];

export function CoverLetterToolbar() {
  const {
    document,
    setTitle,
    saveStatus,
    retrySave,
    setPreviewOpen,
    setTemplatesOpen,
    setApplicationStatus,
  } = useCoverLetter();

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center gap-3 border-b border-line bg-surface/95 px-3 py-2.5 backdrop-blur md:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm" shape="soft" aria-label="Back to list">
          <Link href="/cover-letters">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Logo compact href="/dashboard" className="hidden sm:inline-flex" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Cover Letter Builder
          </p>
          <Input
            value={document.title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 border-transparent bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:border-line focus-visible:bg-surface focus-visible:px-2"
            aria-label="Cover letter name"
          />
        </div>
      </div>

      <SaveIndicator status={saveStatus} onRetry={retrySave} />

      <div className="flex items-center gap-1.5">
        <ApplicationStatusBadge status={document.applicationStatus} />
        <Select
          value={document.applicationStatus}
          onValueChange={(v) => setApplicationStatus(v as ApplicationStatus)}
        >
          <SelectTrigger className="h-8 w-[120px] rounded-[8px] text-xs" aria-label="Application status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          aria-label="Undo"
          onClick={() => toast.message("Undo (UI only)")}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          aria-label="Redo"
          onClick={() => toast.message("Redo (UI only)")}
        >
          <Redo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          shape="soft"
          className="rounded-[8px] xl:hidden"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="size-3.5" />
          Preview
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => setTemplatesOpen(true)}
        >
          <LayoutTemplate className="size-3.5" />
          <span className="hidden sm:inline">Template</span>
        </Button>
        <Button
          type="button"
          size="sm"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => toast.success("Download (UI only)")}
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Download</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          aria-label="Settings"
          onClick={() => toast.message("Letter settings (UI only)")}
        >
          <Settings className="size-4" />
        </Button>
      </div>
    </header>
  );
}
