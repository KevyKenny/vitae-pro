"use client";

import { useEffect, useRef } from "react";
import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Mail,
  MessageSquare,
  Palette,
  PenLine,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import type { LetterWorkspacePane } from "@/features/cover-letter/types";
import { cn } from "@/lib/utils";

export const LETTER_PANES: Array<{
  id: LetterWorkspacePane;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "job", label: "Job", icon: Building2 },
  { id: "applicant", label: "Applicant", icon: UserRound },
  { id: "greeting", label: "Greeting", icon: MessageSquare },
  { id: "opening", label: "Opening", icon: Sparkles },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Gauge },
  { id: "closing", label: "Closing", icon: Mail },
  { id: "signature", label: "Sign-off", icon: PenLine },
  { id: "style", label: "Style", icon: Palette },
];

export const LETTER_PANE_LABELS: Record<LetterWorkspacePane, string> = {
  job: "Job details",
  applicant: "Applicant",
  greeting: "Greeting",
  opening: "Opening paragraph",
  experience: "Experience paragraph",
  skills: "Skills paragraph",
  closing: "Closing paragraph",
  signature: "Signature",
  style: "Tone & length",
};

function RailItem({
  pane,
  active,
  onSelect,
}: {
  pane: (typeof LETTER_PANES)[number];
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = pane.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onSelect}
          aria-current={active ? "page" : undefined}
          aria-label={LETTER_PANE_LABELS[pane.id]}
          className={cn(
            "relative flex w-full flex-col items-center gap-1 rounded-[10px] px-2 py-2.5 text-center transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40",
            active
              ? "bg-emerald-wash text-emerald"
              : "text-ink-soft hover:bg-paper-dim hover:text-ink",
          )}
        >
          {active ? (
            <span
              className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-emerald"
              aria-hidden
            />
          ) : null}
          <Icon className="size-4 shrink-0" aria-hidden />
          <span className="w-full px-0.5 text-[0.7rem] leading-snug font-semibold tracking-tight whitespace-normal">
            {pane.label}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {LETTER_PANE_LABELS[pane.id]}
      </TooltipContent>
    </Tooltip>
  );
}

export function LetterSectionNavigator() {
  const { activePane, setActivePane } = useCoverLetter();

  return (
    <TooltipProvider delayDuration={400}>
      <aside
        className="hidden h-full w-[128px] shrink-0 flex-col border-r border-line bg-surface lg:flex"
        aria-label="Cover letter sections"
      >
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <nav className="flex flex-col gap-0.5">
            {LETTER_PANES.map((pane) => (
              <RailItem
                key={pane.id}
                pane={pane}
                active={pane.id === activePane}
                onSelect={() => setActivePane(pane.id)}
              />
            ))}
          </nav>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export function LetterMobileSectionBar({ className }: { className?: string }) {
  const { activePane, setActivePane } = useCoverLetter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activePane]);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(160, el.clientWidth * 0.7),
      behavior: "smooth",
    });
  }

  return (
    <div
      className={cn(
        "flex w-full min-w-0 shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2 py-2 lg:hidden",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        shape="soft"
        className="size-9 shrink-0 text-ink-soft"
        aria-label="Scroll sections left"
        onClick={() => scrollByDir(-1)}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <div className="relative min-w-0 flex-1">
        <div
          ref={scrollerRef}
          aria-label="Cover letter sections"
          role="navigation"
          className="overflow-x-scroll overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
        >
          <div className="flex w-max items-center gap-2 px-0.5 py-0.5">
            {LETTER_PANES.map((pane) => {
              const Icon = pane.icon;
              const active = pane.id === activePane;
              return (
                <button
                  key={pane.id}
                  ref={active ? activeRef : undefined}
                  type="button"
                  onClick={() => setActivePane(pane.id)}
                  aria-current={active ? "page" : undefined}
                  style={{ touchAction: "pan-x" }}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 whitespace-nowrap text-[0.8rem] font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40",
                    active
                      ? "border-emerald bg-emerald text-paper"
                      : "border-line-strong bg-surface text-ink-soft hover:border-emerald/40 hover:text-ink",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  {pane.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        shape="soft"
        className="size-9 shrink-0 text-ink-soft"
        aria-label="Scroll sections right"
        onClick={() => scrollByDir(1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
