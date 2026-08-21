"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  LayoutTemplate,
  MoreVertical,
  Pencil,
  Printer,
  Redo2,
  Save,
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
import { useCoverLetterExport } from "@/features/export/hooks/use-cover-letter-export";
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
  const { downloadCoverLetterPdf, printCoverLetter, status: exportStatus } =
    useCoverLetterExport();
  const exportBusy =
    exportStatus === "generating" || exportStatus === "preparing";
  const downloadLabel =
    exportStatus === "preparing"
      ? "Preparing…"
      : exportStatus === "generating"
        ? "Generating…"
        : "Download";

  function handlePreview() {
    onRequestPreview?.();
    setPreviewOpen(true);
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface px-3 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <Logo href="/dashboard" compact className="shrink-0" />
        <Button
          asChild
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          className="shrink-0 text-ink-soft"
        >
          <Link href="/cover-letters" aria-label="Back to cover letters">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="hidden h-5 w-px bg-line sm:block" />
        <div className="flex min-w-0 items-center gap-1">
          <Input
            value={document.title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Cover letter name"
            className="h-9 max-w-[160px] border-transparent bg-transparent px-1.5 font-serif text-[1.05rem] font-semibold shadow-none focus-visible:border-line-strong focus-visible:bg-paper sm:max-w-[220px]"
          />
          <Pencil className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
        </div>
        <SaveIndicator status={saveStatus} onRetry={retrySave} />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="mr-1 hidden items-center gap-2 md:flex">
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

        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="hidden rounded-[8px] sm:inline-flex"
          aria-label="Focus Preview"
          onClick={handlePreview}
        >
          <Eye className="size-4" />
          Preview
        </Button>
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="hidden rounded-[8px] md:inline-flex"
          disabled={exportBusy}
          onClick={() => void downloadCoverLetterPdf(document.id, document)}
        >
          <Download className="size-4" />
          {exportStatus === "preparing"
            ? "Preparing…"
            : exportStatus === "generating"
              ? "Generating…"
              : "Download PDF"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          className="md:hidden"
          aria-label="Download PDF"
          disabled={exportBusy}
          onClick={() => void downloadCoverLetterPdf(document.id, document)}
        >
          <Download className="size-4" />
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
              <MoreVertical className="size-4" />
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
            <DropdownMenuItem className="sm:hidden" onClick={() => retrySave()}>
              <Save className="size-4" /> Save
            </DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden" onClick={handlePreview}>
              <Eye className="size-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              className="md:hidden"
              disabled={exportBusy}
              onClick={() => void downloadCoverLetterPdf(document.id, document)}
            >
              <Download className="size-4" /> {downloadLabel}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTemplatesOpen(true)}>
              <LayoutTemplate className="size-4" /> Template
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => printCoverLetter(document.id, document)}
            >
              <Printer className="size-4" /> Print
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hidden sm:flex"
              onClick={() => toast.message("Undo (UI only)")}
            >
              <Undo2 className="size-4" /> Undo
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hidden sm:flex"
              onClick={() => toast.message("Redo (UI only)")}
            >
              <Redo2 className="size-4" /> Redo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="size-4" /> Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          shape="soft"
          className="hidden rounded-[8px] sm:inline-flex"
          onClick={() => retrySave()}
        >
          Save
        </Button>
      </div>
    </header>
  );
}
