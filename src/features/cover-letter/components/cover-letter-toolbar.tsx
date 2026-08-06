"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  LayoutTemplate,
  MoreHorizontal,
  Redo2,
  Settings,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type CoverLetterToolbarProps = {
  onRequestPreview?: () => void;
};

export function CoverLetterToolbar({
  onRequestPreview,
}: CoverLetterToolbarProps) {
  const {
    document,
    setTitle,
    saveStatus,
    retrySave,
    setPreviewOpen,
    setTemplatesOpen,
    setApplicationStatus,
  } = useCoverLetter();

  function handlePreview() {
    onRequestPreview?.();
    setPreviewOpen(true);
  }

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-line bg-surface/95 backdrop-blur safe-pt">
      <div className="flex h-14 min-w-0 items-center gap-2 px-3 sm:h-14 sm:gap-3 md:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label="Back to list"
            className="shrink-0"
          >
            <Link href="/cover-letters">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Logo compact href="/dashboard" className="hidden shrink-0 sm:inline-flex" />
          <div className="min-w-0 flex-1">
            <p className="hidden text-[0.68rem] font-bold tracking-[0.04em] text-ink-faint uppercase sm:block">
              Cover Letter Builder
            </p>
            <Input
              value={document.title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 max-w-full truncate border-transparent bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:border-line focus-visible:bg-surface focus-visible:px-2"
              aria-label="Cover letter name"
            />
          </div>
        </div>

        <SaveIndicator status={saveStatus} onRetry={retrySave} />

        <div className="hidden items-center gap-1.5 md:flex">
          <ApplicationStatusBadge status={document.applicationStatus} />
          <Select
            value={document.applicationStatus}
            onValueChange={(v) => setApplicationStatus(v as ApplicationStatus)}
          >
            <SelectTrigger
              className="h-8 w-[110px] rounded-[8px] text-xs"
              aria-label="Application status"
            >
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

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            className="hidden sm:inline-flex"
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
            className="hidden sm:inline-flex"
            aria-label="Redo"
            onClick={() => toast.message("Redo (UI only)")}
          >
            <Redo2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            className="xl:hidden"
            aria-label="Preview"
            onClick={handlePreview}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            className="sm:hidden"
            aria-label="Templates"
            onClick={() => setTemplatesOpen(true)}
          >
            <LayoutTemplate className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="soft"
            className="hidden rounded-[8px] sm:inline-flex"
            onClick={() => setTemplatesOpen(true)}
          >
            <LayoutTemplate className="size-3.5" />
            Template
          </Button>
          <Button
            type="button"
            size="sm"
            shape="soft"
            className="hidden rounded-[8px] sm:inline-flex"
            onClick={() => toast.success("Download (UI only)")}
          >
            <Download className="size-3.5" />
            Download
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                shape="soft"
                aria-label="More actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5 md:hidden">
                <p className="mb-1.5 text-[0.68rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
                  Status
                </p>
                <Select
                  value={document.applicationStatus}
                  onValueChange={(v) =>
                    setApplicationStatus(v as ApplicationStatus)
                  }
                >
                  <SelectTrigger
                    className="h-9 w-full rounded-[8px] text-xs"
                    aria-label="Application status"
                  >
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
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem
                className="sm:hidden"
                onClick={() => toast.message("Undo (UI only)")}
              >
                <Undo2 className="size-4" /> Undo
              </DropdownMenuItem>
              <DropdownMenuItem
                className="sm:hidden"
                onClick={() => toast.message("Redo (UI only)")}
              >
                <Redo2 className="size-4" /> Redo
              </DropdownMenuItem>
              <DropdownMenuItem
                className="sm:hidden"
                onClick={() => toast.success("Download (UI only)")}
              >
                <Download className="size-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.message("Letter settings (UI only)")}
              >
                <Settings className="size-4" /> Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
