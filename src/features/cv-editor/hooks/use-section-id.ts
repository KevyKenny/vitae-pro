"use client";

import { useEditor } from "@/features/cv-editor/context/editor-context";
import type { CvSectionType } from "@/features/cv-editor/types";

/** Resolve the live section row id for a built-in section type. */
export function useSectionId(type: CvSectionType): string {
  const { document } = useEditor();
  return document.sections.find((s) => s.type === type)?.id ?? type;
}
