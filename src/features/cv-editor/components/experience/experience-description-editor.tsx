"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { QuillEditor } from "@/features/cv-editor/components/quill-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import {
  bulletsToHtml,
  htmlToBullets,
} from "@/lib/cvs/experience-bullets";
import { cn } from "@/lib/utils";

const AI_ACTIONS = [
  {
    label: "Improve with AI",
    action: "Improve",
    mode: "bullets" as const,
  },
  {
    label: "Generate professional bullet points",
    action: "Generate bullets",
    mode: "bullets" as const,
  },
  {
    label: "Make this more concise",
    action: "Make More Concise",
    mode: "bullets" as const,
  },
  {
    label: "Make this achievement-focused",
    action: "Add measurable achievements",
    mode: "bullets" as const,
  },
] as const;

type ExperienceDescriptionEditorProps = {
  items: string[];
  onChange: (next: string[]) => void;
  experienceId: string;
  jobTitle?: string;
  company?: string;
  field?: "responsibilities" | "achievements";
  className?: string;
};

export function ExperienceDescriptionEditor({
  items,
  onChange,
  experienceId,
  jobTitle,
  company,
  field = "responsibilities",
  className,
}: ExperienceDescriptionEditorProps) {
  const { requestAi, aiLoading } = useEditor();
  const [html, setHtml] = useState(() => bulletsToHtml(items));
  const lastExternalRef = useRef(items.map((i) => i.trim()).filter(Boolean).join("\n"));

  useEffect(() => {
    const serialized = items.map((i) => i.trim()).filter(Boolean).join("\n");
    if (serialized === lastExternalRef.current) return;
    lastExternalRef.current = serialized;
    setHtml(bulletsToHtml(items));
  }, [items]);

  function handleChange(nextHtml: string) {
    setHtml(nextHtml);
    const nextItems = htmlToBullets(nextHtml);
    lastExternalRef.current = nextItems.join("\n");
    onChange(nextItems);
  }

  function runAi(action: string, mode?: "single" | "bullets") {
    const currentBullets = htmlToBullets(html);
    void requestAi({
      feature: "experience",
      action,
      mode,
      experienceId,
      bulletIndex: 0,
      field,
      text: currentBullets[0] ?? "",
      jobTitle,
      company,
      description: currentBullets.join("\n"),
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <QuillEditor
        value={html}
        onChange={handleChange}
        placeholder="Describe what you did — use bullet points for clarity"
        label="Experience description"
        className="flex flex-col border-0 bg-paper-dim [&_.ql-toolbar]:order-2 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-t [&_.ql-toolbar]:border-line [&_.ql-toolbar]:bg-paper-dim/80 [&_.ql-container]:order-1 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[120px]"
      />
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#7c3aed]/40 bg-surface px-2.5 py-1.5 text-[0.78rem] font-medium text-[#7c3aed] transition-colors hover:bg-[#7c3aed]/10 disabled:opacity-60"
              aria-label="AI suggestions for experience description"
            >
              <Sparkles className="size-3.5" aria-hidden />
              {aiLoading ? "Generating…" : "AI Suggestions"}
              <ChevronDown className="size-3.5 opacity-70" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {AI_ACTIONS.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={() => runAi(item.action, item.mode)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
