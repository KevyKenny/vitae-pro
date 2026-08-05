"use client";

import { Badge } from "@/components/ui/badge";
import { editorTemplates } from "@/mocks/cv-editor";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { cn } from "@/lib/utils";

export function TemplateSelector() {
  const { document, setTemplate } = useEditor();

  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-line px-4 py-2.5">
      {editorTemplates.map((template) => {
        const active = document.templateId === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => setTemplate(template.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-[0.74rem] font-semibold transition-colors",
              active
                ? "border-emerald bg-emerald text-paper"
                : "border-line-strong bg-surface text-ink-soft hover:border-emerald hover:text-emerald",
            )}
            title={template.description}
          >
            <span className="inline-flex items-center gap-1.5">
              {template.name}
              {template.atsCompatible ? (
                <Badge
                  variant={active ? "outline" : "default"}
                  className={cn(
                    "px-1.5 py-0 text-[0.6rem]",
                    active && "border-paper/40 text-paper",
                  )}
                >
                  ATS
                </Badge>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
