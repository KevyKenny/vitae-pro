"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AISuggestionCard } from "@/features/cv-editor/components/ai-suggestion-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AIInsightPanel() {
  const { aiOpen, setAiOpen, aiSuggestion, document, activeSectionId } =
    useEditor();
  const active = document.sections.find((s) => s.id === activeSectionId);

  return (
    <Sheet open={aiOpen} onOpenChange={setAiOpen}>
      <SheetContent side="right" className="w-[min(100%,380px)] p-0 sm:max-w-md">
        <SheetHeader className="border-b border-line px-5 py-4 text-left">
          <SheetTitle className="font-serif text-xl">AI Career Coach</SheetTitle>
          <p className="text-sm text-ink-soft">
            Contextual help for{" "}
            <span className="font-semibold text-ink">
              {active?.label ?? "this section"}
            </span>
            .
          </p>
        </SheetHeader>
        <div className="space-y-4 p-5">
          {aiSuggestion ? (
            <AISuggestionCard />
          ) : (
            <div className="rounded-[14px] border border-dashed border-line-strong p-5 text-sm text-ink-soft">
              Trigger an AI action from a section to see original vs suggestion,
              confidence, and apply controls.
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              shape="soft"
              onClick={() => toast.message("Saved suggestion for later (mock)")}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              shape="soft"
              onClick={() => setAiOpen(false)}
            >
              Ignore
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
