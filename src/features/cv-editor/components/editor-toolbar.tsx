"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  History,
  MoreVertical,
  Pencil,
  Redo2,
  Save,
  Settings,
  Share2,
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
import { SaveIndicator } from "@/features/cv-editor/components/save-indicator";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useCvExport } from "@/features/export/hooks/use-cv-export";

export function EditorToolbar() {
  const {
    document,
    cvId,
    setTitle,
    saveStatus,
    retrySave,
    setPreviewOpen,
    setVersionsOpen,
  } = useEditor();
  const { downloadCvPdf, status: exportStatus } = useCvExport();
  const exportBusy =
    exportStatus === "generating" || exportStatus === "preparing";
  const downloadLabel =
    exportStatus === "preparing"
      ? "Preparing…"
      : exportStatus === "generating"
        ? "Generating…"
        : "Download";

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
          <Link href="/dashboard" aria-label="Back to dashboard">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="hidden h-5 w-px bg-line sm:block" />
        <div className="flex min-w-0 items-center gap-1">
          <Input
            value={document.title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="CV name"
            className="h-9 max-w-[160px] border-transparent bg-transparent px-1.5 font-serif text-[1.05rem] font-semibold shadow-none focus-visible:border-line-strong focus-visible:bg-paper sm:max-w-[220px]"
          />
          <Pencil className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
        </div>
        <SaveIndicator status={saveStatus} onRetry={retrySave} />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="mr-1 hidden items-center gap-1 md:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label="Undo"
            onClick={() =>
              toast.message("Undo", { description: "Mock history only." })
            }
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label="Redo"
            onClick={() =>
              toast.message("Redo", { description: "Mock history only." })
            }
          >
            <Redo2 className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="hidden rounded-[8px] sm:inline-flex"
          aria-label="Focus Preview"
          onClick={() => {
            setPreviewOpen(true);
          }}
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
          onClick={() => void downloadCvPdf(cvId, document)}
        >
          <Download className="size-4" />
          {exportStatus === "preparing"
            ? "Preparing…"
            : exportStatus === "generating"
              ? "Generating…"
              : "Download PDF"}
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
            <DropdownMenuItem
              className="sm:hidden"
              onClick={() => retrySave()}
            >
              <Save className="size-4" /> Save
            </DropdownMenuItem>
            <DropdownMenuItem
              className="sm:hidden"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="size-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              className="md:hidden"
              disabled={exportBusy}
              onClick={() => void downloadCvPdf(cvId, document)}
            >
              <Download className="size-4" /> {downloadLabel}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem
              className="hidden sm:flex"
              onClick={() => setVersionsOpen(true)}
            >
              <History className="size-4" /> Version history
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.message("Share link ready (mock)")}
            >
              <Share2 className="size-4" /> Share
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
          onClick={() => {
            retrySave();
          }}
        >
          Save
        </Button>
      </div>
    </header>
  );
}
