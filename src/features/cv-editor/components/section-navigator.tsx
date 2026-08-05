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
  Eye,
  EyeOff,
  FolderKanban,
  Gauge,
  GraduationCap,
  GripVertical,
  Languages,
  Link2,
  Plus,
  Sparkles,
  Trophy,
  UserRound,
  Copy,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function SortableNavItem({
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
  const { toggleSectionVisibility, duplicateSection, removeSection } = useEditor();
  const Icon = sectionIcons[section.type];

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group flex items-center gap-1 rounded-[8px] px-1 py-0.5",
        isDragging && "z-10 opacity-90 shadow-m",
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none p-1 text-ink-faint hover:text-ink-soft"
        aria-label={`Drag ${section.label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-[8px] px-2 py-2 text-left text-[0.8rem] font-medium transition-colors",
          active
            ? "bg-emerald-wash font-semibold text-emerald"
            : "text-ink-soft hover:bg-paper-dim hover:text-ink",
          !section.visible && "opacity-50",
        )}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{section.label}</span>
        <span className="ml-auto hidden text-[0.65rem] text-ink-faint sm:inline">
          {section.completion}%
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="soft"
            className="opacity-0 group-hover:opacity-100"
            aria-label={`${section.label} options`}
          >
            <span className="text-xs">···</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toggleSectionVisibility(section.id)}>
            {section.visible ? (
              <>
                <EyeOff className="size-4" /> Hide section
              </>
            ) : (
              <>
                <Eye className="size-4" /> Show section
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => duplicateSection(section.id)}>
            <Copy className="size-4" /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => removeSection(section.id)}
          >
            <Trash2 className="size-4" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function SectionNavigator() {
  const {
    document,
    activeSectionId,
    setActiveSectionId,
    reorderSections,
    addCustomSection,
  } = useEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
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

  return (
    <aside className="flex h-full w-[224px] shrink-0 flex-col border-r border-line bg-surface max-lg:w-16 max-lg:overflow-hidden">
      <div className="border-b border-line px-3 py-3">
        <p className="px-2 text-[0.66rem] font-semibold tracking-[0.06em] text-ink-faint uppercase max-lg:sr-only">
          On this page
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={document.sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {document.sections.map((section) => (
              <SortableNavItem
                key={section.id}
                section={section}
                active={section.id === activeSectionId}
                onSelect={() => {
                  setActiveSectionId(section.id);
                  window.document
                    .querySelector(`[data-section-id="${section.id}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="border-t border-line p-3">
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="w-full justify-start rounded-[8px] max-lg:justify-center max-lg:px-0"
          onClick={addCustomSection}
        >
          <Plus className="size-4" />
          <span className="max-lg:sr-only">Add section</span>
        </Button>
      </div>
    </aside>
  );
}
