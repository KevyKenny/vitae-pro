"use client";

import Link from "next/link";
import {
  Download,
  Eye,
  EyeOff,
  History,
  Redo2,
  Settings,
  Share2,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIndicator } from "@/features/cv-editor/components/save-indicator";
import { useEditor } from "@/features/cv-editor/context/editor-context";

export function EditorToolbar() {
  const {
    document,
    setTitle,
    saveStatus,
    retrySave,
    setPreviewOpen,
    previewOpen,
    setVersionsOpen,
  } = useEditor();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-paper/95 px-3 backdrop-blur-md sm:px-4">
      <Logo href="/dashboard" compact className="shrink-0" />
      <div className="hidden h-5 w-px bg-line sm:block" />
      <Input
        value={document.title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="CV name"
        className="h-9 max-w-[220px] border-transparent bg-transparent px-2 font-serif text-[1.05rem] font-semibold shadow-none focus-visible:border-line-strong focus-visible:bg-surface"
      />
      <SaveIndicator status={saveStatus} onRetry={retrySave} />

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          aria-label="Undo"
          onClick={() => toast.message("Undo", { description: "Mock history only." })}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          aria-label="Redo"
          onClick={() => toast.message("Redo", { description: "Mock history only." })}
        >
          <Redo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          aria-label="Version history"
          onClick={() => setVersionsOpen(true)}
        >
          <History className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          className="lg:hidden"
          aria-label={previewOpen ? "Hide preview" : "Show preview"}
          onClick={() => setPreviewOpen(!previewOpen)}
        >
          {previewOpen ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          shape="soft"
          aria-label="Share"
          onClick={() => toast.message("Share link ready (mock)")}
        >
          <Share2 className="size-4" />
        </Button>
        <Button asChild variant="outline" size="icon-sm" shape="soft">
          <Link href="/settings" aria-label="Settings">
            <Settings className="size-4" />
          </Link>
        </Button>
        <Button
          type="button"
          shape="soft"
          className="hidden rounded-[8px] sm:inline-flex"
          onClick={() => toast.success("Download started (UI only)")}
        >
          <Download className="size-4" />
          Download
        </Button>
      </div>
    </header>
  );
}
