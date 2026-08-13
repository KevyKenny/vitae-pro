"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Copy, Eye, EyeOff, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    renameSection,
    document,
  } = useEditor();
  const meta = document.sections.find((s) => s.id === sectionId);
  const focused = activeSectionId === sectionId;
  const displayTitle = meta?.label?.trim() || title;
  const completion = meta?.completion ?? 0;
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(displayTitle);

  useEffect(() => {
    if (!renameOpen) {
      setRenameValue(displayTitle);
    }
  }, [displayTitle, renameOpen]);

  function handleRenameSave() {
    renameSection(sectionId, renameValue);
    setRenameOpen(false);
  }

  return (
    <>
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
            {displayTitle}
          </h3>
          <div className="mr-1 hidden items-center gap-2 sm:flex">
            <div
              className="h-1.5 w-24 overflow-hidden rounded-full bg-paper-dim"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${displayTitle} completion`}
            >
              <div
                className="h-full rounded-full bg-emerald transition-[width]"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-[0.72rem] font-medium text-ink-faint tabular-nums">
              {completion}% complete
            </span>
          </div>
          <span className="text-[0.7rem] text-ink-faint sm:hidden">
            {completion}%
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                shape="soft"
                aria-label={`${displayTitle} options`}
              >
                ···
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                <PencilLine className="size-4" /> Rename
              </DropdownMenuItem>
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

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename section</DialogTitle>
            <DialogDescription>
              This heading appears on the editor card and in your CV export.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor={`rename-section-${sectionId}`}>Section name</Label>
            <Input
              id={`rename-section-${sectionId}`}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRenameSave();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              shape="soft"
              onClick={() => setRenameOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              shape="soft"
              onClick={handleRenameSave}
              disabled={!renameValue.trim()}
            >
              Save name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
