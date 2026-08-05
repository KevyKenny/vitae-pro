"use client";

import { ChevronDown, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { cn } from "@/lib/utils";

type EditorSectionCardProps = {
  sectionId: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function EditorSectionCard({
  sectionId,
  title,
  children,
  className,
  collapsed,
  onToggleCollapse,
}: EditorSectionCardProps) {
  const {
    activeSectionId,
    setActiveSectionId,
    toggleSectionVisibility,
    duplicateSection,
    removeSection,
    document,
  } = useEditor();
  const meta = document.sections.find((s) => s.id === sectionId);
  const focused = activeSectionId === sectionId;

  return (
    <section
      data-section-id={sectionId}
      onFocusCapture={() => setActiveSectionId(sectionId)}
      className={cn(
        "overflow-hidden rounded-[14px] border border-line bg-surface transition-[box-shadow,border-color] duration-150",
        "hover:shadow-s",
        focused &&
          "border-emerald-bright shadow-[0_0_0_3px_var(--emerald-wash)]",
        !meta?.visible && "opacity-60",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-[18px] py-4">
        <h3 className="flex-1 font-sans text-[0.92rem] font-semibold text-ink">
          {title}
        </h3>
        <span className="text-[0.7rem] text-ink-faint">{meta?.completion ?? 0}%</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              shape="soft"
              aria-label={`${title} options`}
            >
              ···
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleSectionVisibility(sectionId)}>
              {meta?.visible ? (
                <>
                  <EyeOff className="size-4" /> Hide
                </>
              ) : (
                <>
                  <Eye className="size-4" /> Show
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateSection(sectionId)}>
              <Copy className="size-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => removeSection(sectionId)}
            >
              <Trash2 className="size-4" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {onToggleCollapse ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label={collapsed ? "Expand section" : "Collapse section"}
            onClick={onToggleCollapse}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                collapsed && "-rotate-90",
              )}
            />
          </Button>
        ) : null}
      </div>
      {!collapsed ? <div className="p-[18px]">{children}</div> : null}
    </section>
  );
}
