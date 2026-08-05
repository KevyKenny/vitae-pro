"use client";

import { GripVertical, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CvSectionCardProps = {
  title: string;
  children: React.ReactNode;
  focused?: boolean;
  onAiAssist?: () => void;
  className?: string;
};

export function CvSectionCard({
  title,
  children,
  focused = false,
  onAiAssist,
  className,
}: CvSectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[14px] border border-line bg-surface transition-[box-shadow,border-color] duration-150",
        "hover:shadow-s",
        focused &&
          "border-emerald-bright shadow-[0_0_0_3px_var(--emerald-wash)]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-[18px] py-4">
        <span
          className="cursor-grab text-ink-faint"
          aria-hidden
          title="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </span>
        <h3 className="flex-1 font-sans text-[0.92rem] font-semibold text-ink">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {onAiAssist ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-7 gap-1 px-2.5 text-[0.74rem] text-emerald"
              onClick={onAiAssist}
            >
              <Sparkles className="size-3.5" />
              AI
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            aria-label="Section options"
            className="text-ink-faint"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
      <div className="p-[18px]">{children}</div>
    </section>
  );
}
