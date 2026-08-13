"use client";

import { useCallback, useEffect, useState } from "react";
import type { CvSectionType } from "@/features/cv-editor/types";
import { useEditor } from "@/features/cv-editor/context/editor-context";

export type SectionSaveStatus = "idle" | "saving" | "saved" | "error";

export function useSectionSave(sectionKey: CvSectionType | string) {
  const { dirtySections, sectionSaveStatus, saveSection, clearSectionError } =
    useEditor();
  const dirty = dirtySections.has(sectionKey);
  const status: SectionSaveStatus =
    sectionSaveStatus[sectionKey] ?? (dirty ? "idle" : "saved");

  const onSave = useCallback(() => {
    void saveSection(sectionKey);
  }, [saveSection, sectionKey]);

  useEffect(() => {
    if (status === "saved") {
      const t = window.setTimeout(() => clearSectionError(sectionKey), 2500);
      return () => window.clearTimeout(t);
    }
  }, [status, sectionKey, clearSectionError]);

  return { dirty, status, onSave };
}

/** Local dirty flag for fields that shouldn't mark global dirty until intentional. */
export function useLocalDirty(initial = false) {
  const [dirty, setDirty] = useState(initial);
  return { dirty, setDirty, markDirty: () => setDirty(true), clearDirty: () => setDirty(false) };
}
