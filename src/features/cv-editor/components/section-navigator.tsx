"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Gauge,
  GraduationCap,
  Languages,
  Link2,
  Plus,
  Sparkles,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type { CvSectionMeta, CvSectionType } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

const sectionIcons: Record<CvSectionType, LucideIcon> = {
  personal: UserRound,
  summary: Sparkles,
  experience: Briefcase,
  education: GraduationCap,
  skills: Gauge,
  projects: FolderKanban,
  certifications: Award,
  languages: Languages,
  achievements: Trophy,
  references: Link2,
  custom: Plus,
};

/** Compact rail labels — full section titles remain on the form card. */
const railLabels: Record<CvSectionType, string> = {
  personal: "Personal",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
  references: "References",
  custom: "Custom",
};

function RailItem({
  section,
  active,
  onSelect,
}: {
  section: CvSectionMeta;
  active: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });
  const Icon = sectionIcons[section.type];
  const displayLabel = section.label?.trim() || railLabels[section.type] || "Section";

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(isDragging && "z-10 opacity-80")}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onSelect}
            aria-current={active ? "page" : undefined}
            aria-label={section.label}
            className={cn(
              "relative flex w-full flex-col items-center gap-1 rounded-[10px] px-2 py-2.5 text-center transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40",
              active
                ? "bg-emerald-wash text-emerald"
                : "text-ink-soft hover:bg-paper-dim hover:text-ink",
              !section.visible && "opacity-45",
            )}
            {...attributes}
            {...listeners}
          >
            {active ? (
              <span
                className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-emerald"
                aria-hidden
              />
            ) : null}
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="w-full px-0.5 text-[0.7rem] leading-snug font-semibold tracking-tight whitespace-normal">
              {displayLabel}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {displayLabel}
          {!section.visible ? " (hidden)" : ""}
          {" · drag to reorder"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function useSectionNav() {
  const {
    document,
    activeSectionId,
    setActiveSectionId,
    reorderSections,
    addCustomSection,
  } = useEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = document.sections.findIndex((s) => s.id === active.id);
    const newIndex = document.sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorderSections(arrayMove(document.sections, oldIndex, newIndex));
  }

  return {
    document,
    activeSectionId,
    setActiveSectionId,
    addCustomSection,
    sensors,
    onDragEnd,
  };
}

/** Desktop vertical section rail — hidden below `lg`. */
export function SectionNavigator() {
  const {
    document,
    activeSectionId,
    setActiveSectionId,
    addCustomSection,
    sensors,
    onDragEnd,
  } = useSectionNav();

  return (
    <TooltipProvider delayDuration={400}>
      <aside
        className={cn(
          "hidden h-full w-[128px] shrink-0 flex-col border-r border-line bg-surface lg:flex",
          "xl:w-[128px]",
        )}
        aria-label="CV sections"
      >
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={document.sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <nav className="flex flex-col gap-0.5">
                {document.sections.map((section) => (
                  <RailItem
                    key={section.id}
                    section={section}
                    active={section.id === activeSectionId}
                    onSelect={() => setActiveSectionId(section.id)}
                  />
                ))}
              </nav>
            </SortableContext>
          </DndContext>
        </div>
        <div className="border-t border-line p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                shape="soft"
                className="w-full rounded-[10px]"
                aria-label="Add section"
                onClick={addCustomSection}
              >
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add section</TooltipContent>
          </Tooltip>
          <p className="mt-1.5 text-center text-[0.68rem] font-semibold text-ink-faint">
            Add section
          </p>
        </div>
      </aside>
    </TooltipProvider>
  );
}

/** Mobile/tablet horizontal section chips — shown below `lg`. */
export function MobileSectionBar({ className }: { className?: string }) {
  const { document, activeSectionId, setActiveSectionId, addCustomSection } =
    useSectionNav();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSectionId]);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.7), behavior: "smooth" });
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

      {/*
        Nested scroll pattern that works on mobile Safari/Chrome:
        outer clips width; scroller owns overflow-x; inner is w-max so content can exceed.
      */}
      <div className="relative min-w-0 flex-1">
        <div
          ref={scrollerRef}
          aria-label="CV sections"
          role="navigation"
          className="overflow-x-scroll overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x",
          }}
        >
          <div className="flex w-max items-center gap-2 px-0.5 py-0.5">
            {document.sections.map((section) => {
              const Icon = sectionIcons[section.type];
              const active = section.id === activeSectionId;
              const label = section.label?.trim() || railLabels[section.type] || "Section";
              return (
                <button
                  key={section.id}
                  ref={active ? activeRef : undefined}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  aria-current={active ? "page" : undefined}
                  style={{ touchAction: "pan-x" }}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 whitespace-nowrap text-[0.8rem] font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40",
                    active
                      ? "border-emerald bg-emerald text-paper"
                      : "border-line-strong bg-surface text-ink-soft hover:border-emerald/40 hover:text-ink",
                    !section.visible && "opacity-50",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  {label}
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

      <Button
        type="button"
        variant="outline"
        size="icon"
        shape="soft"
        className="size-10 shrink-0 rounded-full"
        aria-label="Add section"
        onClick={addCustomSection}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
