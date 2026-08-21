"use client";

import { CoverLetterEditor } from "@/features/cover-letter/components/cover-letter-editor";
import { CoverLetterPreview } from "@/features/cover-letter/components/cover-letter-preview";
import { CoverLetterToolbar } from "@/features/cover-letter/components/cover-letter-toolbar";
import { AIWritingPanel } from "@/features/cover-letter/components/ai-writing-panel";
import { TemplateCard } from "@/features/cover-letter/components/template-card";
import {
  LetterMobileSectionBar,
  LetterSectionNavigator,
} from "@/features/cover-letter/components/letter-section-navigator";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { letterTemplates } from "@/mocks/cover-letter-builder";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MobileBottomBar } from "@/components/shared/mobile-bottom-bar";
import { Eye, LayoutTemplate, PencilLine, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

type MobilePane = "edit" | "preview";

export function CoverLetterLayout() {
  const {
    previewOpen,
    setPreviewOpen,
    aiOpen,
    setAiOpen,
    templatesOpen,
    setTemplatesOpen,
    document,
    setTemplate,
  } = useCoverLetter();

  const mobilePane: MobilePane = previewOpen ? "preview" : "edit";

  function selectPane(pane: MobilePane) {
    setPreviewOpen(pane === "preview");
  }

  return (
    <div className="flex h-dvh min-w-0 flex-col bg-paper-dim">
      <CoverLetterToolbar onRequestPreview={() => selectPane("preview")} />
      {mobilePane === "edit" ? <LetterMobileSectionBar /> : null}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <LetterSectionNavigator />

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
            <CoverLetterEditor />
          </PanelShell>

          <PanelShell
            id="cover-letter-preview-panel"
            className={cn(
              "min-h-0 bg-paper-dim lg:h-full",
              mobilePane !== "preview" && "hidden lg:flex",
            )}
          >
            <CoverLetterPreview className="h-full" />
          </PanelShell>
        </main>
      </div>

      <Sheet open={aiOpen} onOpenChange={setAiOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-full p-0 sm:max-w-[400px] safe-pb"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>AI writing assistant</SheetTitle>
          </SheetHeader>
          <div className="h-full [&_aside]:w-full [&_aside]:border-l-0 [&_aside]:shadow-none">
            <AIWritingPanel />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="max-h-[85dvh] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Cover letter templates
            </DialogTitle>
          </DialogHeader>
          {letterTemplates.length === 0 ? (
            <EmptyState
              icon={LayoutTemplate}
              title="No templates selected"
              description="Choose a layout that matches the tone of your application."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {letterTemplates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  selected={document.templateId === t.id}
                  onSelect={() => {
                    setTemplate(t.id);
                    setTemplatesOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
