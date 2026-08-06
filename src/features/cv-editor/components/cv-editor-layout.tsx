"use client";

import { useEffect, useState } from "react";
import { EditorToolbar } from "@/features/cv-editor/components/editor-toolbar";
import {
  MobileSectionBar,
  SectionNavigator,
} from "@/features/cv-editor/components/section-navigator";
import { EditorWorkspace } from "@/features/cv-editor/components/editor-workspace";
import { CVPreview } from "@/features/cv-editor/components/cv-preview";
import { AIInsightPanel } from "@/features/cv-editor/components/ai-insight-panel";
import { VersionHistory } from "@/features/cv-editor/components/version-history";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { MobileBottomBar } from "@/components/shared/mobile-bottom-bar";
import { Button } from "@/components/ui/button";
import { Eye, PencilLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type MobilePane = "edit" | "preview";

/**
 * Page shell: header → section rail (desktop) / chips (mobile) →
 * 50/50 input + Preview on lg+, Edit|Preview panes on smaller screens.
 */
export function CVEditorLayout() {
  const { setAiOpen, previewOpen, setPreviewOpen } = useEditor();
  const [mobilePane, setMobilePane] = useState<MobilePane>("edit");

  useEffect(() => {
    if (previewOpen) setMobilePane("preview");
  }, [previewOpen]);

  function selectPane(pane: MobilePane) {
    setMobilePane(pane);
    setPreviewOpen(pane === "preview");
  }

  return (
    <div className="flex h-dvh min-w-0 flex-col bg-paper-dim">
      <EditorToolbar />
      {mobilePane === "edit" ? <MobileSectionBar /> : null}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SectionNavigator />

        <main
          className={cn(
            "grid min-h-0 min-w-0 flex-1",
            "auto-rows-auto grid-cols-1 gap-0 overflow-hidden",
            "lg:grid-cols-2 lg:grid-rows-1 lg:gap-4 lg:p-4",
          )}
        >
          <PanelShell
            className={cn(
              "min-h-0 lg:h-full",
              mobilePane !== "edit" && "hidden lg:flex",
              "pb-mobile-bar lg:pb-0",
            )}
          >
            <EditorWorkspace />
          </PanelShell>

          <PanelShell
            id="cv-preview-panel"
            className={cn(
              "min-h-0 lg:h-full",
              mobilePane !== "preview" && "hidden lg:flex",
              "pb-mobile-bar lg:pb-0",
            )}
          >
            <CVPreview className="h-full" />
          </PanelShell>
        </main>
      </div>

      <AIInsightPanel />
      <VersionHistory />

      <MobileBottomBar>
        <Button
          type="button"
          variant={mobilePane === "edit" ? "primary" : "outline"}
          shape="soft"
          className="flex-1 rounded-[8px]"
          aria-pressed={mobilePane === "edit"}
          onClick={() => selectPane("edit")}
        >
          <PencilLine className="size-4" />
          Edit
        </Button>
        <Button
          type="button"
          variant={mobilePane === "preview" ? "primary" : "outline"}
          shape="soft"
          className="flex-1 rounded-[8px]"
          aria-pressed={mobilePane === "preview"}
          onClick={() => selectPane("preview")}
        >
          <Eye className="size-4" />
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
      </MobileBottomBar>
    </div>
  );
}

function PanelShell({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface",
        "border-b border-line lg:border-b-0",
        "lg:rounded-[14px] lg:border lg:border-line lg:shadow-s",
        className,
      )}
    >
      {children}
    </section>
  );
}
