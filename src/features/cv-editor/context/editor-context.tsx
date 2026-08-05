"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  getMockDocumentById,
  mockCvVersions,
  mockEditorSuggestions,
} from "@/mocks/cv-editor";
import type {
  CvDocument,
  CvSectionMeta,
  CvSectionType,
  CvVersion,
  EditorAiSuggestion,
  EditorTemplateId,
  SaveStatus,
} from "@/features/cv-editor/types";

type EditorContextValue = {
  document: CvDocument;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  saveStatus: SaveStatus;
  zoom: number;
  setZoom: (zoom: number) => void;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  aiOpen: boolean;
  setAiOpen: (open: boolean) => void;
  aiSuggestion: EditorAiSuggestion | null;
  versions: CvVersion[];
  versionsOpen: boolean;
  setVersionsOpen: (open: boolean) => void;
  updateDocument: (updater: (prev: CvDocument) => CvDocument) => void;
  setTitle: (title: string) => void;
  setTemplate: (id: EditorTemplateId) => void;
  setSummary: (summary: string) => void;
  reorderSections: (sections: CvSectionMeta[]) => void;
  toggleSectionVisibility: (id: string) => void;
  duplicateSection: (id: string) => void;
  removeSection: (id: string) => void;
  addCustomSection: () => void;
  requestAi: (key: keyof typeof mockEditorSuggestions) => void;
  applyAiSuggestion: () => void;
  discardAiSuggestion: () => void;
  regenerateAi: () => void;
  markSaved: () => void;
  retrySave: () => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({
  cvId,
  children,
}: {
  cvId: string;
  children: React.ReactNode;
}) {
  const [document, setDocument] = useState(() => getMockDocumentById(cvId));
  const [activeSectionId, setActiveSectionId] = useState(
    document.sections[1]?.id ?? document.sections[0]?.id ?? "",
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [zoom, setZoom] = useState(100);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<EditorAiSuggestion | null>(
    null,
  );
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versions] = useState(mockCvVersions);
  const saveTimer = useRef<number | null>(null);
  const failNext = useRef(false);

  const scheduleSave = useCallback(() => {
    setSaveStatus("unsaved");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      setSaveStatus("saving");
      window.setTimeout(() => {
        if (failNext.current) {
          failNext.current = false;
          setSaveStatus("failed");
          toast.error("Autosave failed", {
            description: "Check your connection and retry.",
            action: { label: "Retry", onClick: () => scheduleSave() },
          });
          return;
        }
        setSaveStatus("saved");
        toast.success("Saved", { description: "All changes are up to date." });
      }, 700);
    }, 900);
  }, []);

  const updateDocument = useCallback(
    (updater: (prev: CvDocument) => CvDocument) => {
      setDocument((prev) => updater(prev));
      scheduleSave();
    },
    [scheduleSave],
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  const value = useMemo<EditorContextValue>(
    () => ({
      document,
      activeSectionId,
      setActiveSectionId,
      saveStatus,
      zoom,
      setZoom,
      previewOpen,
      setPreviewOpen,
      aiOpen,
      setAiOpen,
      aiSuggestion,
      versions,
      versionsOpen,
      setVersionsOpen,
      updateDocument,
      setTitle: (title) =>
        updateDocument((prev) => ({ ...prev, title })),
      setTemplate: (templateId) =>
        updateDocument((prev) => ({ ...prev, templateId })),
      setSummary: (summary) => updateDocument((prev) => ({ ...prev, summary })),
      reorderSections: (sections) =>
        updateDocument((prev) => ({ ...prev, sections })),
      toggleSectionVisibility: (id) =>
        updateDocument((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === id ? { ...s, visible: !s.visible } : s,
          ),
        })),
      duplicateSection: (id) =>
        updateDocument((prev) => {
          const section = prev.sections.find((s) => s.id === id);
          if (!section) return prev;
          const clone: CvSectionMeta = {
            ...section,
            id: `${section.id}_copy_${Date.now()}`,
            label: `${section.label} (copy)`,
            type: section.type === "custom" ? "custom" : section.type,
          };
          const index = prev.sections.findIndex((s) => s.id === id);
          const sections = [...prev.sections];
          sections.splice(index + 1, 0, clone);
          return { ...prev, sections };
        }),
      removeSection: (id) =>
        updateDocument((prev) => ({
          ...prev,
          sections: prev.sections.filter((s) => s.id !== id),
        })),
      addCustomSection: () =>
        updateDocument((prev) => ({
          ...prev,
          sections: [
            ...prev.sections,
            {
              id: `sec_custom_${Date.now()}`,
              type: "custom" as CvSectionType,
              label: "Custom Section",
              visible: true,
              completion: 0,
            },
          ],
        })),
      requestAi: (key) => {
        const suggestion = mockEditorSuggestions[key];
        if (!suggestion) return;
        setAiSuggestion(suggestion);
        setAiOpen(true);
        setActiveSectionId(suggestion.sectionId);
      },
      applyAiSuggestion: () => {
        if (!aiSuggestion) return;
        if (aiSuggestion.sectionType === "summary") {
          updateDocument((prev) => ({
            ...prev,
            summary: aiSuggestion.suggestion,
          }));
        }
        if (
          aiSuggestion.sectionType === "experience" &&
          aiSuggestion.targetPath === "experience.0.bullets.0"
        ) {
          updateDocument((prev) => {
            const experience = [...prev.experience];
            const first = experience[0];
            if (!first) return prev;
            const bullets = [...first.bullets];
            bullets[0] = aiSuggestion.suggestion;
            experience[0] = { ...first, bullets };
            return { ...prev, experience };
          });
        }
        toast.success("Suggestion applied");
        setAiSuggestion(null);
        setAiOpen(false);
      },
      discardAiSuggestion: () => {
        setAiSuggestion(null);
        setAiOpen(false);
      },
      regenerateAi: () => {
        toast.message("Regenerating…", {
          description: "Mock AI will return a fresh variation shortly.",
        });
        window.setTimeout(() => {
          if (!aiSuggestion) return;
          setAiSuggestion({
            ...aiSuggestion,
            suggestion: `${aiSuggestion.suggestion.replace(/\.$/, "")} — refined for ATS clarity.`,
            confidence: Math.min(0.98, aiSuggestion.confidence + 0.02),
          });
        }, 800);
      },
      markSaved: () => setSaveStatus("saved"),
      retrySave: () => scheduleSave(),
    }),
    [
      activeSectionId,
      aiOpen,
      aiSuggestion,
      document,
      previewOpen,
      saveStatus,
      scheduleSave,
      updateDocument,
      versions,
      versionsOpen,
      zoom,
    ],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
