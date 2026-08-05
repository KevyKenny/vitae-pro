"use client";

import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GallerySectionId, TemplateCustomization } from "@/features/templates/types";

export function SectionVisibilityControl({
  sections,
  onToggle,
  onMove,
}: {
  sections: TemplateCustomization["sections"];
  onToggle: (id: GallerySectionId) => void;
  onMove: (id: GallerySectionId, direction: "up" | "down") => void;
}) {
  return (
    <ul className="space-y-1.5">
      {sections.map((section, index) => (
        <li
          key={section.id}
          className="flex items-center gap-2 rounded-[10px] border border-line bg-surface px-2.5 py-2"
        >
          <div className="flex flex-col">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              shape="soft"
              className="h-6 w-6"
              disabled={index === 0}
              aria-label={`Move ${section.label} up`}
              onClick={() => onMove(section.id, "up")}
            >
              <ChevronUp className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              shape="soft"
              className="h-6 w-6"
              disabled={index === sections.length - 1}
              aria-label={`Move ${section.label} down`}
              onClick={() => onMove(section.id, "down")}
            >
              <ChevronDown className="size-3.5" />
            </Button>
          </div>
          <span className="flex-1 text-sm font-medium text-ink">{section.label}</span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            aria-pressed={section.visible}
            aria-label={`${section.visible ? "Hide" : "Show"} ${section.label}`}
            onClick={() => onToggle(section.id)}
          >
            {section.visible ? (
              <Eye className="size-3.5" />
            ) : (
              <EyeOff className="size-3.5 text-ink-faint" />
            )}
          </Button>
        </li>
      ))}
    </ul>
  );
}
