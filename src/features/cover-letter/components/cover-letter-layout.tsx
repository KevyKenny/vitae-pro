"use client";

import { useEffect, useState } from "react";
import { JobInformationForm } from "@/features/cover-letter/components/job-information-form";
import { CoverLetterEditor } from "@/features/cover-letter/components/cover-letter-editor";
import { CoverLetterPreview } from "@/features/cover-letter/components/cover-letter-preview";
import { CoverLetterToolbar } from "@/features/cover-letter/components/cover-letter-toolbar";
import { AIWritingPanel } from "@/features/cover-letter/components/ai-writing-panel";
import { TemplateCard } from "@/features/cover-letter/components/template-card";
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
import { Download, Eye, LayoutTemplate, PencilLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
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
    jobFormOpen,
    setJobFormOpen,
    document,
    setTemplate,
  } = useCoverLetter();
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
      <CoverLetterToolbar onRequestPreview={() => selectPane("preview")} />

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="hidden h-full w-[min(380px,36%)] shrink-0 border-r border-line bg-surface lg:block xl:w-[400px]">
          <JobInformationForm />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden xl:flex-row">
          <div
            className={cn(
              "min-h-0 min-w-0 flex-1 overflow-hidden bg-surface",
              "pb-mobile-bar xl:pb-0",
              mobilePane !== "edit" && "hidden xl:flex xl:flex-col",
            )}
          >
            <CoverLetterEditor />
          </div>

          <div
            className={cn(
              "min-h-0 min-w-0 flex-1 overflow-hidden bg-surface",
              "pb-mobile-bar xl:border-l xl:border-line xl:pb-0 xl:max-w-[440px]",
              mobilePane !== "preview" && "hidden xl:flex xl:flex-col",
            )}
          >
            <CoverLetterPreview className="h-full border-l-0" />
          </div>
        </div>
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

      <Sheet open={jobFormOpen} onOpenChange={setJobFormOpen}>
        <SheetContent
          side="bottom"
          className="flex h-[min(92dvh,740px)] w-full max-w-full flex-col gap-0 overflow-hidden p-0 safe-pb"
        >
          <SheetHeader className="shrink-0 border-b border-line px-4 py-3 text-left">
            <SheetTitle className="font-serif text-lg">Job details</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <JobInformationForm embedded />
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
          variant="outline"
          shape="soft"
          className="min-w-0 flex-1 rounded-[8px] px-2"
          onClick={() => setJobFormOpen(true)}
        >
          Job
        </Button>
        <Button
          type="button"
          variant={mobilePane === "edit" ? "primary" : "outline"}
          shape="soft"
          className="min-w-0 flex-1 rounded-[8px] px-2"
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
          className="min-w-0 flex-1 rounded-[8px] px-2"
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
          aria-label="AI assistant"
        >
          <Sparkles className="size-4" />
        </Button>
        <Button
          type="button"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => toast.success("Download (UI only)")}
          aria-label="Download"
        >
          <Download className="size-4" />
        </Button>
      </MobileBottomBar>
    </div>
  );
}
