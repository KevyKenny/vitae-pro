"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AISuggestionCard } from "@/features/cv-editor/components/ai-suggestion-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { Button } from "@/components/ui/button";

function useIsMobileSheet() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function AIInsightPanel() {
  const {
    aiOpen,
    setAiOpen,
    aiSuggestion,
    document,
    activeSectionId,
    applyAiSuggestion,
    discardAiSuggestion,
    regenerateAi,
    aiLoading,
  } = useEditor();
  const active = document.sections.find((s) => s.id === activeSectionId);
  const isMobile = useIsMobileSheet();

  return (
    <Sheet open={aiOpen} onOpenChange={setAiOpen}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "inset-x-0 bottom-0 flex h-[88dvh] w-full flex-col gap-0 rounded-t-[18px] border-t border-line p-0 sm:max-w-none"
            : "flex h-full w-[min(100%,420px)] flex-col gap-0 p-0 sm:max-w-md"
        }
      >
        <SheetHeader className="shrink-0 border-b border-line px-5 py-4 text-left">
          <SheetTitle className="font-serif text-xl">AI Career Coach</SheetTitle>
          <p className="text-sm text-ink-soft">
            Suggestions for{" "}
            <span className="font-semibold text-ink">
              {active?.label ?? "this section"}
            </span>
            .
          </p>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {aiSuggestion ? (
            <AISuggestionCard compact />
          ) : (
            <div className="rounded-[14px] border border-dashed border-line-strong p-5 text-sm text-ink-soft">
              Trigger an AI action from a section to review suggestions here,
              then accept or regenerate.
            </div>
          )}
        </div>

        {aiSuggestion ? (
          <div className="safe-pb shrink-0 border-t border-line bg-surface px-5 py-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                shape="soft"
                className="h-11 flex-1 rounded-[8px]"
                disabled={aiLoading}
                onClick={regenerateAi}
              >
                Regenerate
              </Button>
              <Button
                type="button"
                variant="ghost"
                shape="soft"
                className="h-11 rounded-[8px]"
                onClick={() => {
                  discardAiSuggestion();
                  setAiOpen(false);
                }}
              >
                Dismiss
              </Button>
              <Button
                type="button"
                shape="soft"
                className="h-11 flex-1 rounded-[8px]"
                onClick={() => {
                  applyAiSuggestion();
                  setAiOpen(false);
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
