"use client";

import { editorTemplates } from "@/mocks/cv-editor";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { cn } from "@/lib/utils";

export function TemplateSelector({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { document, setTemplate } = useEditor();

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1.5 overflow-x-auto",
        !compact && "border-b border-line px-4 py-2.5",
        className,
      )}
      role="listbox"
      aria-label="CV template style"
    >
      {editorTemplates.map((template) => {
        const active = document.templateId === template.id;
        return (
          <button
            key={template.id}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => setTemplate(template.id)}
            className={cn(
              "shrink-0 rounded-full border font-semibold transition-colors",
              compact
                ? "px-2.5 py-1 text-[0.7rem]"
                : "px-3 py-1.5 text-[0.74rem]",
              active
                ? "border-emerald bg-emerald text-paper"
                : "border-line-strong bg-surface text-ink-soft hover:border-emerald hover:text-emerald",
            )}
            title={template.description}
          >
            {template.name}
          </button>
        );
      })}
    </div>
  );
}
