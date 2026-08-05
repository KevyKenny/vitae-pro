"use client";

import { EditorToolbar } from "@/features/cv-editor/components/editor-toolbar";
import { SectionNavigator } from "@/features/cv-editor/components/section-navigator";
import { EditorWorkspace } from "@/features/cv-editor/components/editor-workspace";
import { CVPreview } from "@/features/cv-editor/components/cv-preview";
import { AIInsightPanel } from "@/features/cv-editor/components/ai-insight-panel";
import { VersionHistory } from "@/features/cv-editor/components/version-history";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CVEditorLayout() {
  const { previewOpen, setPreviewOpen, setAiOpen } = useEditor();

  return (
    <div className="flex h-dvh flex-col bg-paper">
      <EditorToolbar />
      <div className="flex min-h-0 flex-1">
        <SectionNavigator />
        <EditorWorkspace />
        <div className="hidden w-[380px] shrink-0 xl:block">
          <CVPreview />
        </div>
      </div>

      {/* Tablet/mobile preview drawer */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-[min(100%,420px)] p-0 sm:max-w-md">
          <SheetHeader className="sr-only">
            <SheetTitle>CV Preview</SheetTitle>
          </SheetHeader>
          <CVPreview className="h-full" />
        </SheetContent>
      </Sheet>

      <AIInsightPanel />
      <VersionHistory />

      {/* Mobile bottom bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-surface/95 p-3 backdrop-blur md:hidden",
        )}
      >
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={() => setPreviewOpen(true)}
        >
          Preview
        </Button>
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => setAiOpen(true)}
        >
          <Sparkles className="size-4" />
          AI
        </Button>
        <Button
          type="button"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => toast.success("Download (UI only)")}
        >
          <Download className="size-4" />
        </Button>
      </div>
    </div>
  );
}
