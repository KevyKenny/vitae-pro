"use client";

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
import { Download, LayoutTemplate, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

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

  return (
    <div className="flex h-dvh flex-col bg-paper">
      <CoverLetterToolbar />

      <div className="flex min-h-0 flex-1">
        <div className="hidden w-[380px] shrink-0 lg:block xl:w-[400px]">
          <JobInformationForm />
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            <CoverLetterEditor />
          </div>
          <div className="hidden min-w-0 flex-1 xl:block xl:max-w-[440px]">
            <CoverLetterPreview />
          </div>
        </div>
      </div>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-[min(100%,440px)] p-0 sm:max-w-md">
          <SheetHeader className="sr-only">
            <SheetTitle>Cover letter preview</SheetTitle>
          </SheetHeader>
          <CoverLetterPreview className="h-full border-l-0" />
        </SheetContent>
      </Sheet>

      <Sheet open={aiOpen} onOpenChange={setAiOpen}>
        <SheetContent side="right" className="w-[min(100%,400px)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>AI writing assistant</SheetTitle>
          </SheetHeader>
          <div className="h-full [&_aside]:w-full [&_aside]:border-l-0 [&_aside]:shadow-none">
            <AIWritingPanel />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={jobFormOpen} onOpenChange={setJobFormOpen}>
        <SheetContent side="left" className="w-[min(100%,420px)] overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Job information</SheetTitle>
          </SheetHeader>
          <JobInformationForm />
        </SheetContent>
      </Sheet>

      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
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

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden",
        )}
      >
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={() => setJobFormOpen(true)}
        >
          Job
        </Button>
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
