"use client";

import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCompletionSummary,
  getCvCompletionChecklist,
  getCvSmartRecommendations,
} from "@/lib/cvs";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { cn } from "@/lib/utils";

type CvCompletionPanelProps = {
  className?: string;
  onAnalyze?: () => void;
  onFinish?: () => void;
  compact?: boolean;
};

export function CvCompletionPanel({
  className,
  onAnalyze,
  onFinish,
  compact,
}: CvCompletionPanelProps) {
  const { document, setActiveSectionId } = useEditor();
  const { percent, readyMessage } = getCompletionSummary(document);
  const checklist = getCvCompletionChecklist(document);
  const recommendations = getCvSmartRecommendations(document);

  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-surface p-4 shadow-s",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">
            CV completeness
          </p>
          <p className="mt-1 font-mono text-2xl font-medium text-emerald">{percent}%</p>
        </div>
        {!compact ? (
          <div className="h-2 w-24 overflow-hidden rounded-full bg-paper-dim">
            <div
              className="h-full rounded-full bg-emerald transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-ink-soft">{readyMessage}</p>

      <ul className="mt-4 space-y-2">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-sm">
            {item.complete ? (
              <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden />
            )}
            <button
              type="button"
              className={cn(
                "text-left",
                item.complete ? "text-ink-soft" : "font-medium text-ink hover:text-emerald",
              )}
              disabled={!item.sectionType || item.complete}
              onClick={() => {
                if (!item.sectionType) return;
                const section = document.sections.find((s) => s.type === item.sectionType);
                if (section) setActiveSectionId(section.id);
              }}
            >
              {item.label}
              {item.optional ? " (optional)" : ""}
            </button>
          </li>
        ))}
      </ul>

      {recommendations.length > 0 ? (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-semibold text-ink-faint">Suggested next</p>
          <ul className="mt-2 space-y-2">
            {recommendations.map((rec) => (
              <li key={rec.id}>
                <p className="text-sm font-medium text-ink">{rec.title}</p>
                <p className="text-xs text-ink-soft">{rec.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {onAnalyze && percent >= 40 ? (
          <Button type="button" variant="outline" size="sm" shape="soft" onClick={onAnalyze}>
            Run analysis
          </Button>
        ) : null}
        {onFinish ? (
          <Button type="button" size="sm" shape="soft" onClick={onFinish}>
            Continue in editor
          </Button>
        ) : null}
      </div>
    </div>
  );
}
