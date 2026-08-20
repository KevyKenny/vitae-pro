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
import Link from "next/link";
import { toast } from "sonner";
import { mockCvVersions } from "@/mocks/cv-editor";
import type {
  CvDocument,
  CvSectionMeta,
  CvSectionType,
  CvVersion,
  EditorAiSuggestion,
  EditorTemplateId,
  SaveStatus,
} from "@/features/cv-editor/types";
import type { TemplateRendererKey } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import {
  appendExperienceBullets,
  replaceExperienceBullets,
  withUpdatedExperienceField,
} from "@/features/cv-editor/components/experience/experience-helpers";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { FileQuestion } from "lucide-react";
import { cvErrorMessage, getCvWithContent, saveCvDocument } from "@/lib/cvs";
import { applySectionCompletions } from "@/lib/cvs/completion";
import { normalizeCvDocument } from "@/lib/cvs/personal-info";
import { resolveCvTemplateCustomization } from "@/lib/templates";
import type { TemplateCustomization } from "@/features/templates/types";
import {
  aiApi,
  aiClientErrorMessage,
  mapExperienceAction,
  mapSummaryAction,
} from "@/features/ai/api";
import type { ExperienceBulletsResult, ExperienceImprovementResult } from "@/lib/ai/types";

export type EditorAiRequest = {
  feature: "summary" | "experience" | "skills";
  action: string;
  experienceId?: string;
  bulletIndex?: number;
  field?: "responsibilities" | "achievements";
  text?: string;
  mode?: "single" | "bullets";
  jobTitle?: string;
  company?: string;
  description?: string;
};

type EditorContextValue = {
  document: CvDocument;
  cvId: string;
  customization: TemplateCustomization | null;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  saveStatus: SaveStatus;
  dirtySections: Set<string>;
  sectionSaveStatus: Record<string, "idle" | "saving" | "saved" | "error">;
  zoom: number;
  setZoom: (zoom: number) => void;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  aiOpen: boolean;
  setAiOpen: (open: boolean) => void;
  analysisOpen: boolean;
  setAnalysisOpen: (open: boolean) => void;
  aiSuggestion: EditorAiSuggestion | null;
  aiLoading: boolean;
  versions: CvVersion[];
  versionsOpen: boolean;
  setVersionsOpen: (open: boolean) => void;
  /** Update local editor state. Marks section dirty. Does not overwrite from server. */
  updateDocument: (
    updater: (prev: CvDocument) => CvDocument,
    options?: { sectionKey?: string; scheduleAutosave?: boolean },
  ) => void;
  setTitle: (title: string) => void;
  setTemplate: (id: TemplateRendererKey) => void;
  setSummary: (summary: string) => void;
  reorderSections: (sections: CvSectionMeta[]) => void;
  toggleSectionVisibility: (id: string) => void;
  duplicateSection: (id: string) => void;
  removeSection: (id: string) => void;
  renameSection: (id: string, label: string) => void;
  addCustomSection: () => void;
  /** Authoritative section save — persists current editor state without replacing UI. */
  saveSection: (sectionKey: string) => Promise<boolean>;
  clearSectionError: (sectionKey: string) => void;
  requestAi: (params: EditorAiRequest) => Promise<void>;
  applyAiSuggestion: () => void;
  discardAiSuggestion: () => void;
  regenerateAi: () => void;
  cancelAi: () => void;
  markSaved: () => void;
  retrySave: () => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

function sectionIdForType(
  sections: CvSectionMeta[],
  type: CvSectionType,
): string {
  return sections.find((s) => s.type === type)?.id ?? sections[0]?.id ?? "";
}

function parseTargetPath(targetPath?: string) {
  if (!targetPath) return null;
  const match = targetPath.match(
    /^experience\.([^.]+)\.(responsibilities|achievements)\.(\d+)$/,
  );
  if (!match) return null;
  return {
    experienceKey: match[1],
    field: match[2] as "responsibilities" | "achievements",
    index: Number(match[3]),
  };
}

export function EditorProvider({
  cvId,
  children,
}: {
  cvId: string;
  children: React.ReactNode;
}) {
  const [document, setDocument] = useState<CvDocument | null>(null);
  const [customization, setCustomization] = useState<TemplateCustomization | null>(
    null,
  );
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [zoom, setZoom] = useState(100);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<EditorAiSuggestion | null>(
    null,
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versions] = useState(mockCvVersions);
  const [dirtySections, setDirtySections] = useState<Set<string>>(
    () => new Set(),
  );
  const [sectionSaveStatus, setSectionSaveStatus] = useState<
    Record<string, "idle" | "saving" | "saved" | "error">
  >({});
  const saveTimer = useRef<number | null>(null);
  const documentRef = useRef<CvDocument | null>(null);
  const savingRef = useRef(false);
  const mutationSeqRef = useRef(0);
  const pendingAutosaveRef = useRef(false);
  const aiAbortRef = useRef<AbortController | null>(null);
  const lastAiRequestRef = useRef<EditorAiRequest | null>(null);
  const pendingBulletsRef = useRef<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    setLoadError(null);
    setDocument(null);

    void (async () => {
      try {
        const doc = applySectionCompletions(normalizeCvDocument(await getCvWithContent(cvId)));
        if (cancelled) return;
        documentRef.current = doc;
        setDocument(doc);
        void resolveCvTemplateCustomization(cvId, doc.templateSlug ?? doc.rendererKey ?? doc.templateId)
          .then((custom) => {
            if (!cancelled) setCustomization(custom);
          })
          .catch(() => {
            if (!cancelled) setCustomization(null);
          });
        setActiveSectionId(
          doc.sections[1]?.id ?? doc.sections[0]?.id ?? "",
        );
        setSaveStatus("saved");
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setLoadError(cvErrorMessage(error, "We couldn't load this CV."));
        setLoadState("error");
      }
    })();

    return () => {
      cancelled = true;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      aiAbortRef.current?.abort();
    };
  }, [cvId]);

  const persistNow = useCallback(async (sectionKey?: string): Promise<boolean> => {
    const current = documentRef.current;
    if (!current) return false;

    if (savingRef.current) {
      pendingAutosaveRef.current = true;
      return false;
    }

    const seqAtStart = mutationSeqRef.current;
    const snapshot = current;
    savingRef.current = true;
    setSaveStatus("saving");
    if (sectionKey) {
      setSectionSaveStatus((prev) => ({ ...prev, [sectionKey]: "saving" }));
    }

    try {
      const saved = await saveCvDocument(snapshot);

      // CRITICAL: never replace newer local edits with the save snapshot.
      if (mutationSeqRef.current === seqAtStart) {
        // No edits during save — sync remapped UUIDs only when still clean.
        documentRef.current = saved;
        setDocument(saved);
        setSaveStatus("saved");
        if (sectionKey) {
          setDirtySections((prev) => {
            const next = new Set(prev);
            next.delete(sectionKey);
            return next;
          });
          setSectionSaveStatus((prev) => ({ ...prev, [sectionKey]: "saved" }));
        } else {
          setDirtySections(new Set());
          setSectionSaveStatus({});
        }
        return true;
      }

      // Newer input exists — keep editor state as source of truth.
      setSaveStatus("unsaved");
      if (sectionKey) {
        setSectionSaveStatus((prev) => ({ ...prev, [sectionKey]: "idle" }));
      }
      pendingAutosaveRef.current = true;
      return true;
    } catch (error) {
      setSaveStatus("failed");
      if (sectionKey) {
        setSectionSaveStatus((prev) => ({ ...prev, [sectionKey]: "error" }));
      }
      toast.error("Unable to save your changes.", {
        description: cvErrorMessage(error, "Check your connection and try again."),
        action: {
          label: "Retry",
          onClick: () => {
            void persistNow(sectionKey);
          },
        },
      });
      return false;
    } finally {
      savingRef.current = false;
      if (pendingAutosaveRef.current) {
        pendingAutosaveRef.current = false;
        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
          void persistNow();
        }, 400);
      }
    }
  }, []);

  const scheduleSave = useCallback(() => {
    setSaveStatus("unsaved");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    // Soft safety autosave — never primary. Long debounce reduces races.
    saveTimer.current = window.setTimeout(() => {
      void persistNow();
    }, 2500);
  }, [persistNow]);

  const updateDocument = useCallback(
    (
      updater: (prev: CvDocument) => CvDocument,
      options?: { sectionKey?: string; scheduleAutosave?: boolean },
    ) => {
      mutationSeqRef.current += 1;
      setDocument((prev) => {
        if (!prev) return prev;
        const next = applySectionCompletions({
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        });
        documentRef.current = next;
        return next;
      });
      if (options?.sectionKey) {
        setDirtySections((prev) => {
          const next = new Set(prev);
          next.add(options.sectionKey!);
          return next;
        });
        setSectionSaveStatus((prev) => ({
          ...prev,
          [options.sectionKey!]: "idle",
        }));
      }
      if (options?.scheduleAutosave !== false) {
        scheduleSave();
      }
    },
    [scheduleSave],
  );

  const saveSection = useCallback(
    async (sectionKey: string) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      return persistNow(sectionKey);
    },
    [persistNow],
  );

  const clearSectionError = useCallback((sectionKey: string) => {
    setSectionSaveStatus((prev) => {
      if (prev[sectionKey] !== "saved") return prev;
      const next = { ...prev };
      delete next[sectionKey];
      return next;
    });
  }, []);

  const runAiRequest = useCallback(
    async (params: EditorAiRequest) => {
      const doc = documentRef.current;
      if (!doc) return;

      aiAbortRef.current?.abort();
      const controller = new AbortController();
      aiAbortRef.current = controller;
      lastAiRequestRef.current = params;
      pendingBulletsRef.current = null;
      setAiLoading(true);

      try {
        if (params.feature === "summary") {
          const action = mapSummaryAction(params.action);
          const result = await aiApi.summary(
            {
              cvId,
              action,
              currentSummary: doc.summary,
            },
            controller.signal,
          );

          setAiSuggestion({
            id: result.id,
            sectionId: sectionIdForType(doc.sections, "summary"),
            sectionType: "summary",
            action: params.action,
            original: doc.summary,
            suggestion: result.suggestion,
            explanation: result.explanation,
            confidence: result.confidence,
          });
          setActiveSectionId(sectionIdForType(doc.sections, "summary"));
          setAiOpen(true);
          return;
        }

        if (params.feature === "skills") {
          const result = await aiApi.skills(
            { cvId, targetRole: doc.personal.title },
            controller.signal,
          );

          setAiSuggestion({
            id: result.id,
            sectionId: sectionIdForType(doc.sections, "skills"),
            sectionType: "skills",
            action: params.action,
            original: doc.skills.map((s) => s.name).join(", "),
            suggestion: result.suggestion ?? result.explanation,
            explanation: result.explanation,
            confidence: result.confidence,
          });
          setActiveSectionId(sectionIdForType(doc.sections, "skills"));
          setAiOpen(true);
          return;
        }

        const action = mapExperienceAction(params.action);
        const mode =
          params.mode ?? (action === "bullets" ? "bullets" : "single");
        const exp =
          params.experienceId != null
            ? doc.experience.find((e) => e.id === params.experienceId)
            : doc.experience[0];
        const field = params.field ?? "responsibilities";
        const bulletIndex = params.bulletIndex ?? 0;
        const list =
          exp && field === "achievements" && "achievements" in exp
            ? exp.achievements
            : exp && "responsibilities" in exp
              ? exp.responsibilities
              : [];
        const originalText =
          params.text?.trim() ||
          list[bulletIndex]?.trim() ||
          list.find((item) => item.trim())?.trim() ||
          "";

        const result = await aiApi.experience(
          {
            cvId,
            action,
            mode,
            experienceId: exp?.id,
            bulletIndex,
            field,
            text: originalText,
            jobTitle: params.jobTitle,
            company: params.company,
            description: params.description,
          },
          controller.signal,
        );

        if ("bullets" in result && Array.isArray(result.bullets)) {
          const bulletsResult = result as ExperienceBulletsResult & { id: string };
          pendingBulletsRef.current = bulletsResult.bullets;
          setAiSuggestion({
            id: bulletsResult.id,
            sectionId: sectionIdForType(doc.sections, "experience"),
            sectionType: "experience",
            action: params.action,
            original: originalText,
            suggestion: bulletsResult.bullets.join("\n"),
            explanation: bulletsResult.explanation,
            confidence: bulletsResult.confidence,
            targetPath: exp
              ? `experience.${exp.id}.${field}.${bulletIndex}`
              : undefined,
          });
        } else {
          const improved = result as ExperienceImprovementResult & { id: string };
          setAiSuggestion({
            id: improved.id,
            sectionId: sectionIdForType(doc.sections, "experience"),
            sectionType: "experience",
            action: params.action,
            original: originalText,
            suggestion: improved.suggestion,
            explanation: improved.explanation,
            confidence: improved.confidence,
            targetPath: exp
              ? `experience.${exp.id}.${field}.${bulletIndex}`
              : undefined,
          });
        }

        setActiveSectionId(sectionIdForType(doc.sections, "experience"));
        setAiOpen(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          toast.message("AI cancelled");
          return;
        }
        toast.error("AI request failed", {
          description: aiClientErrorMessage(error),
        });
      } finally {
        setAiLoading(false);
        if (aiAbortRef.current === controller) {
          aiAbortRef.current = null;
        }
      }
    },
    [cvId],
  );

  const value = useMemo<EditorContextValue | null>(() => {
    if (!document) return null;
    return {
      document,
      cvId,
      customization,
      activeSectionId,
      setActiveSectionId,
      saveStatus,
      dirtySections,
      sectionSaveStatus,
      zoom,
      setZoom,
      previewOpen,
      setPreviewOpen,
      aiOpen,
      setAiOpen,
      analysisOpen,
      setAnalysisOpen,
      aiSuggestion,
      aiLoading,
      versions,
      versionsOpen,
      setVersionsOpen,
      updateDocument,
      setTitle: (title) =>
        updateDocument((prev) => ({ ...prev, title }), { sectionKey: "personal" }),
      setTemplate: (rendererKey: TemplateRendererKey) => {
        const defaults = createTemplateDefaultCustomization(rendererKey);
        setCustomization(defaults);
        updateDocument(
          (prev) => ({
            ...prev,
            rendererKey,
            templateSlug: rendererKey,
            templateId: "modern",
          }),
          { sectionKey: "personal" },
        );
      },
      setSummary: (summary) =>
        updateDocument((prev) => ({ ...prev, summary }), {
          sectionKey: "summary",
        }),
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
          if (!section || section.type !== "custom") {
            toast.message("Only custom sections can be duplicated.");
            return prev;
          }
          const clone: CvSectionMeta = {
            ...section,
            id: crypto.randomUUID(),
            label: `${section.label} (copy)`,
            content: section.content ?? "",
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
      renameSection: (id, label) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        updateDocument((prev) => ({
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === id ? { ...section, label: trimmed } : section,
          ),
        }));
      },
      addCustomSection: () =>
        updateDocument((prev) => ({
          ...prev,
          sections: [
            ...prev.sections,
            {
              id: crypto.randomUUID(),
              type: "custom" as CvSectionType,
              label: "Custom Section",
              visible: true,
              completion: 0,
              content: "",
            },
          ],
        })),
      saveSection,
      clearSectionError,
      requestAi: (params) => runAiRequest(params),
      applyAiSuggestion: () => {
        if (!aiSuggestion) return;
        if (aiSuggestion.sectionType === "summary") {
          updateDocument(
            (prev) => ({
              ...prev,
              summary: aiSuggestion.suggestion,
            }),
            { sectionKey: "summary" },
          );
        } else if (aiSuggestion.sectionType === "experience") {
          const parsed = parseTargetPath(aiSuggestion.targetPath);
          updateDocument(
            (prev) => {
              const experience = prev.experience.map((entry, idx) => {
                const matches = parsed
                  ? entry.id === parsed.experienceKey ||
                    String(idx) === parsed.experienceKey
                  : idx === 0;
                if (!matches) return entry;

                if (pendingBulletsRef.current?.length) {
                  const bullets = pendingBulletsRef.current;
                  pendingBulletsRef.current = null;
                  const targetField = parsed?.field ?? "responsibilities";
                  // Full description rewrites replace the list; single-bullet AI still appends.
                  if (aiSuggestion.suggestion.includes("\n") || bullets.length > 1) {
                    return replaceExperienceBullets(entry, bullets, targetField);
                  }
                  return appendExperienceBullets(entry, bullets);
                }

                if (!parsed) return entry;
                return withUpdatedExperienceField(
                  entry,
                  parsed.field,
                  parsed.index,
                  aiSuggestion.suggestion,
                );
              });
              return { ...prev, experience };
            },
            { sectionKey: "experience" },
          );
        }
        pendingBulletsRef.current = null;
        toast.success("Suggestion applied — review and save when ready.");
        setAiSuggestion(null);
        setAiOpen(false);
      },
      discardAiSuggestion: () => {
        pendingBulletsRef.current = null;
        setAiSuggestion(null);
        setAiOpen(false);
      },
      regenerateAi: () => {
        if (lastAiRequestRef.current) {
          void runAiRequest(lastAiRequestRef.current);
        }
      },
      cancelAi: () => {
        aiAbortRef.current?.abort();
        setAiLoading(false);
      },
      markSaved: () => setSaveStatus("saved"),
      retrySave: () => {
        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        void persistNow().then((ok) => {
          if (ok) {
            toast.success("Saved", {
              description: "All changes are up to date.",
            });
          }
        });
      },
    };
  }, [
    activeSectionId,
    aiLoading,
    aiOpen,
    analysisOpen,
    aiSuggestion,
    clearSectionError,
    cvId,
    customization,
    dirtySections,
    document,
    persistNow,
    previewOpen,
    runAiRequest,
    saveSection,
    saveStatus,
    sectionSaveStatus,
    updateDocument,
    versions,
    versionsOpen,
    zoom,
  ]);

  if (loadState === "loading") {
    return (
      <div className="min-h-dvh bg-paper p-6">
        <LoadingSkeleton variant="editor" />
      </div>
    );
  }

  if (loadState === "error" || !value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper p-6">
        <EmptyState
          icon={FileQuestion}
          title="CV unavailable"
          description={
            loadError ??
            "This CV could not be loaded. It may have been deleted or you may not have access."
          }
          actionLabel="Back to My CVs"
          onAction={() => {
            window.location.href = "/cvs";
          }}
          className="max-w-md"
        />
        <div className="sr-only">
          <Button asChild>
            <Link href="/cvs">My CVs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
