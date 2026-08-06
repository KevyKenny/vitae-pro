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
  /** Flush into parent panel card (no nested border/shadow). */
  flush?: boolean;
};

export function EditorSectionCard({
  sectionId,
  title,
  children,
  className,
  collapsed,
  onToggleCollapse,
  flush = true,
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
        "overflow-hidden transition-[box-shadow,border-color] duration-150",
        flush
          ? "rounded-none border-0 bg-transparent shadow-none"
          : cn(
              "rounded-[14px] border border-line bg-surface hover:shadow-s",
              focused &&
                "border-emerald-bright shadow-[0_0_0_3px_var(--emerald-wash)]",
            ),
        !meta?.visible && "opacity-60",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-[18px] py-4">
        <h3 className="flex-1 font-sans text-[0.92rem] font-semibold text-ink">
          {title}
        </h3>
        <div className="mr-1 hidden items-center gap-2 sm:flex">
          <div
            className="h-1.5 w-24 overflow-hidden rounded-full bg-paper-dim"
            role="progressbar"
            aria-valuenow={meta?.completion ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${title} completion`}
          >
            <div
              className="h-full rounded-full bg-emerald transition-[width]"
              style={{ width: `${meta?.completion ?? 0}%` }}
            />
          </div>
          <span className="text-[0.72rem] font-medium text-ink-faint tabular-nums">
            {meta?.completion ?? 0}% complete
          </span>
        </div>
        <span className="text-[0.7rem] text-ink-faint sm:hidden">
          {meta?.completion ?? 0}%
        </span>
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
      {!collapsed ? (
        <div className={cn("p-[18px]", flush && "px-5 py-5 sm:px-7 sm:py-6")}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
