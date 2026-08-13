"use client";

import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { QuillEditor } from "@/features/cv-editor/components/quill-editor";
import { cn } from "@/lib/utils";

type EducationDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function EducationDescriptionEditor({
  value,
  onChange,
  className,
}: EducationDescriptionEditorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <QuillEditor
        value={value}
        onChange={onChange}
        placeholder="Add achievements, honours, coursework, or other details"
        label="Education description"
        className="border-0 bg-paper-dim [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:bg-transparent [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[120px]"
      />
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.78rem] font-medium text-[#7c3aed] transition-colors hover:bg-[#7c3aed]/10"
          onClick={() =>
            toast.message("AI suggestions", {
              description:
                "Education description suggestions will use your current entry context in a later phase.",
            })
          }
        >
          <Sparkles className="size-3.5" aria-hidden />
          AI Suggestions
        </button>
      </div>
    </div>
  );
}
