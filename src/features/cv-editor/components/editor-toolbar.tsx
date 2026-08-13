"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Download,
  Eye,
  History,
  MoreHorizontal,
  Pencil,
  Printer,
  Redo2,
  Settings,
  Share2,
  Sparkles,
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
    setAiOpen,
    setAnalysisOpen,
  } = useEditor();
  const { downloadCvPdf, printCv, status: exportStatus } = useCvExport();

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
          className="hidden rounded-[8px] lg:inline-flex"
          onClick={() => setAnalysisOpen(true)}
        >
          <BarChart3 className="size-4" />
          Analyze
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          className="lg:hidden"
          aria-label="Analyze CV"
          onClick={() => setAnalysisOpen(true)}
        >
          <BarChart3 className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="hidden rounded-[8px] lg:inline-flex"
          onClick={() => setAiOpen(true)}
        >
          <Sparkles className="size-4" />
          AI Assistant
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          className="lg:hidden"
          aria-label="AI Assistant"
          onClick={() => setAiOpen(true)}
        >
          <Sparkles className="size-4" />
        </Button>

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
          size="icon-sm"
          shape="soft"
          className="sm:hidden"
          aria-label="Focus Preview"
          onClick={() => {
            setPreviewOpen(true);
          }}
        >
          <Eye className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="hidden rounded-[8px] sm:inline-flex"
          aria-label="Print CV"
          onClick={() => printCv(cvId, document)}
        >
          <Printer className="size-4" />
          Print
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          className="sm:hidden"
          aria-label="Print CV"
          onClick={() => printCv(cvId, document)}
        >
          <Printer className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="hidden rounded-[8px] md:inline-flex"
          disabled={exportStatus === "generating" || exportStatus === "preparing"}
          onClick={() => void downloadCvPdf(cvId, document)}
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
          disabled={exportStatus === "generating" || exportStatus === "preparing"}
          onClick={() => void downloadCvPdf(cvId, document)}
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
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setVersionsOpen(true)}>
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
          className="rounded-[8px]"
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
