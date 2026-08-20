"use client";

import { useState } from "react";
import { Bold, Italic, List, Underline } from "lucide-react";
import { AIActionButton } from "@/features/cv-editor/components/ai-action-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  onAiAction?: (action: string) => void;
  className?: string;
};

const aiActions = [
  "Improve",
  "Rewrite",
  "Make More Professional",
  "Make More Concise",
];

export function RichTextEditor({
  value,
  onChange,
  maxLength = 600,
  onAiAction,
  className,
}: RichTextEditorProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-1 rounded-[8px] border border-line bg-paper-dim/60 p-1">
        <Button type="button" variant="ghost" size="icon-sm" shape="soft" aria-label="Bold">
          <Bold className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" shape="soft" aria-label="Italic">
          <Italic className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" shape="soft" aria-label="Underline">
          <Underline className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" shape="soft" aria-label="List">
          <List className="size-3.5" />
        </Button>
        <div className="mx-1 h-4 w-px bg-line" />
        <div className="flex flex-wrap gap-1">
          {aiActions.map((action) => (
            <AIActionButton
              key={action}
              label={action}
              onClick={() => onAiAction?.(action)}
            />
          ))}
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        rows={6}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "min-h-28 bg-paper",
          focused && "border-emerald-bright bg-surface",
        )}
      />
      <p className="text-right text-xs text-ink-faint">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
