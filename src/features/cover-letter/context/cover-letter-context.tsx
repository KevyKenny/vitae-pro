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
import {
  generationSteps,
} from "@/mocks/cover-letter-builder";
import type {
  ApplicationStatus,
  CoverLetterDocument,
  CoverLetterSuggestion,
  JobInfo,
  LetterAiSuggestion,
  LetterLength,
  LetterSectionKey,
  LetterTemplateId,
  LetterTone,
  SaveStatus,
  SavedCoverLetterSummary,
} from "@/features/cover-letter/types";
import type { CvTailoringResult, JobAnalysisResult } from "@/lib/ai/types";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { FileQuestion } from "lucide-react";
import { isUuid, getCvWithContent } from "@/lib/cvs";
import {
  coverLetterErrorMessage,
  deleteCoverLetter,
  duplicateCoverLetter,
  getCoverLetter,
  listUserCoverLetters,
  renameCoverLetter,
  saveCoverLetterDocument,
  type CoverLetterListItem,
} from "@/lib/cover-letters";
import { aiApi, aiClientErrorMessage } from "@/features/ai/api";
import { serializeCvContext } from "@/lib/ai/cv-context";

type CoverLetterContextValue = {
  document: CoverLetterDocument;
  savedLetters: SavedCoverLetterSummary[];
  saveStatus: SaveStatus;
  zoom: number;
  setZoom: (zoom: number) => void;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  aiOpen: boolean;
  setAiOpen: (open: boolean) => void;
  templatesOpen: boolean;
  setTemplatesOpen: (open: boolean) => void;
  jobFormOpen: boolean;
  setJobFormOpen: (open: boolean) => void;
  activeSection: LetterSectionKey | null;
  setActiveSection: (key: LetterSectionKey | null) => void;
  aiSuggestion: LetterAiSuggestion | null;
  generating: boolean;
  generationStepIndex: number;
  analyzing: boolean;
  cvTailoring: boolean;
  cvTailorResult: CvTailoringResult | null;
  aiLoading: boolean;
  updateDocument: (updater: (prev: CoverLetterDocument) => CoverLetterDocument) => void;
  updateJob: (patch: Partial<JobInfo>) => void;
  updateBodySection: (key: LetterSectionKey, value: string) => void;
  setTone: (tone: LetterTone) => void;
  setLength: (length: LetterLength) => void;
  setTemplate: (id: LetterTemplateId) => void;
  setApplicationStatus: (status: ApplicationStatus) => void;
  setTitle: (title: string) => void;
  setCvId: (cvId: string | null) => void;
  updateCandidate: (patch: Partial<CoverLetterDocument["candidate"]>) => void;
  toggleExperienceHighlight: (experienceId: string) => void;
  analyzeJobDescription: () => void;
  generateLetter: () => void;
  tailorCv: () => void;
  requestAi: (action: string, sectionKey: LetterSectionKey) => void;
  applyAiSuggestion: () => void;
  discardAiSuggestion: () => void;
  regenerateAi: () => void;
  cancelAi: () => void;
  applySuggestion: (suggestion: CoverLetterSuggestion) => void;
  dismissSuggestion: (id: string) => void;
  retrySave: () => void;
  duplicateLetter: (id: string) => void;
  deleteLetter: (id: string) => void;
  renameLetter: (id: string, title: string) => void;
};

const CoverLetterContext = createContext<CoverLetterContextValue | null>(null);

function mapJobAnalysis(result: JobAnalysisResult) {
  return {
    skills: [...result.skills, ...result.preferredSkills].filter(Boolean),
    keywords: result.keywords,
    experienceRequirements: result.experienceRequirements,
    companyValues: result.companyValues,
    roleExpectations: result.roleExpectations,
    analyzedAt: new Date().toISOString(),
  };
}

function mapListItemToSummary(
  item: CoverLetterListItem,
): SavedCoverLetterSummary {
  return {
    id: item.id,
    title: item.title,
    company: item.company,
    role: item.role,
    cvTitle: item.cvTitle,
    templateName: item.templateName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    applicationStatus: item.applicationStatus,
  };
}

export function CoverLetterProvider({
  letterId,
  children,
}: {
  letterId: string;
  children: React.ReactNode;
}) {
  const [document, setDocument] = useState<CoverLetterDocument | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savedLetters, setSavedLetters] = useState<SavedCoverLetterSummary[]>(
    [],
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [zoom, setZoom] = useState(100);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<LetterSectionKey | null>(
    "opening",
  );
  const [aiSuggestion, setAiSuggestion] = useState<LetterAiSuggestion | null>(
    null,
  );
  const [generating, setGenerating] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(-1);
  const [analyzing, setAnalyzing] = useState(false);
  const [cvTailoring, setCvTailoring] = useState(false);
  const [cvTailorResult, setCvTailorResult] = useState<CvTailoringResult | null>(
    null,
  );
  const [aiLoading, setAiLoading] = useState(false);
  const saveTimer = useRef<number | null>(null);
  const documentRef = useRef<CoverLetterDocument | null>(null);
  const savingRef = useRef(false);
  const aiAbortRef = useRef<AbortController | null>(null);
  const lastSectionAiRef = useRef<{
    action: string;
    sectionKey: LetterSectionKey;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listUserCoverLetters()
      .then((items) => {
        if (!cancelled) {
          setSavedLetters(items.map(mapListItemToSummary));
        }
      })
      .catch(() => {
        /* list is optional in editor */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isUuid(letterId)) {
      setLoadState("error");
      setLoadError("Invalid cover letter link.");
      setDocument(null);
      return;
    }

    let cancelled = false;
    setLoadState("loading");
    setLoadError(null);
    setDocument(null);

    void (async () => {
      try {
        const doc = await getCoverLetter(letterId);
        if (cancelled) return;
        documentRef.current = doc;
        setDocument(doc);
        setSaveStatus("saved");
        setLoadState("ready");
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          coverLetterErrorMessage(error, "We couldn't load this cover letter."),
        );
        setLoadState("error");
      }
    })();

    return () => {
      cancelled = true;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      aiAbortRef.current?.abort();
    };
  }, [letterId]);

  const refreshSavedLetters = useCallback(async () => {
    try {
      const items = await listUserCoverLetters();
      setSavedLetters(items.map(mapListItemToSummary));
    } catch {
      /* optional refresh */
    }
  }, []);

  const persistNow = useCallback(async () => {
    const current = documentRef.current;
    if (!current || savingRef.current) return;
    savingRef.current = true;
    setSaveStatus("saving");
    try {
      const saved = await saveCoverLetterDocument(current, {
        cvId: current.cvId ?? null,
      });
      documentRef.current = saved;
      setDocument(saved);
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("failed");
      toast.error("Autosave failed", {
        description: coverLetterErrorMessage(
          error,
          "Check your connection and retry.",
        ),
        action: {
          label: "Retry",
          onClick: () => {
            void persistNow();
          },
        },
      });
    } finally {
      savingRef.current = false;
    }
  }, []);

  const scheduleSave = useCallback(() => {
    setSaveStatus("unsaved");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void persistNow();
    }, 850);
  }, [persistNow]);

  const updateDocument = useCallback(
    (updater: (prev: CoverLetterDocument) => CoverLetterDocument) => {
      setDocument((prev) => {
        if (!prev) return prev;
        const next = {
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        };
        documentRef.current = next;
        return next;
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  const runSectionAi = useCallback(
    (action: string, sectionKey: LetterSectionKey) => {
      const current = documentRef.current;
      if (!current) return;

      lastSectionAiRef.current = { action, sectionKey };
      setAiLoading(true);
      aiAbortRef.current?.abort();
      const controller = new AbortController();
      aiAbortRef.current = controller;

      void (async () => {
        try {
          let cvContext: string | undefined;
          if (current.cvId) {
            try {
              const cv = await getCvWithContent(current.cvId);
              cvContext = serializeCvContext(cv);
            } catch {
              cvContext = undefined;
            }
          }

          const result = await aiApi.coverLetter(
            {
              mode: "improve",
              coverLetterId: current.id,
              sectionKey,
              action,
              currentText: current.body[sectionKey],
              tone: current.tone,
              job: {
                companyName: current.job.companyName,
                jobTitle: current.job.jobTitle,
                jobDescription: current.job.jobDescription,
              },
              cvContext,
            },
            controller.signal,
          );

          if ("body" in result) {
            throw new Error("Unexpected generate response");
          }

          setAiSuggestion({
            id: result.id,
            sectionKey,
            action,
            original: current.body[sectionKey],
            suggestion: result.suggestion,
            explanation: result.explanation,
            confidence: result.confidence,
          });
          setActiveSection(sectionKey);
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
        }
      })();
    },
    [],
  );

  const value = useMemo<CoverLetterContextValue | null>(() => {
    if (!document) return null;
    return {
      document,
      savedLetters,
      saveStatus,
      zoom,
      setZoom,
      previewOpen,
      setPreviewOpen,
      aiOpen,
      setAiOpen,
      templatesOpen,
      setTemplatesOpen,
      jobFormOpen,
      setJobFormOpen,
      activeSection,
      setActiveSection,
      aiSuggestion,
      generating,
      generationStepIndex,
      analyzing,
      cvTailoring,
      cvTailorResult,
      aiLoading,
      updateDocument,
      updateJob: (patch) =>
        updateDocument((prev) => {
          const company =
            (patch.companyName ?? prev.job.companyName) || "Company";
          const role = (patch.jobTitle ?? prev.job.jobTitle) || "Role";
          return {
            ...prev,
            job: { ...prev.job, ...patch },
            title:
              patch.companyName || patch.jobTitle
                ? `${company} — ${role}`
                : prev.title,
          };
        }),
      updateBodySection: (key, value) =>
        updateDocument((prev) => ({
          ...prev,
          body: { ...prev.body, [key]: value },
        })),
      setTone: (tone) => updateDocument((prev) => ({ ...prev, tone })),
      setLength: (length) => updateDocument((prev) => ({ ...prev, length })),
      setTemplate: (templateId) => {
        updateDocument((prev) => ({ ...prev, templateId }));
        toast.success("Template updated");
      },
      setApplicationStatus: (applicationStatus) => {
        updateDocument((prev) => ({ ...prev, applicationStatus }));
        setSavedLetters((letters) =>
          letters.map((l) =>
            l.id === document.id ? { ...l, applicationStatus } : l,
          ),
        );
      },
      setTitle: (title) => updateDocument((prev) => ({ ...prev, title })),
      setCvId: (cvId) => updateDocument((prev) => ({ ...prev, cvId })),
      updateCandidate: (patch) =>
        updateDocument((prev) => ({
          ...prev,
          candidate: { ...prev.candidate, ...patch },
        })),
      toggleExperienceHighlight: (experienceId) =>
        updateDocument((prev) => {
          const ids = prev.candidate.highlightedExperienceIds;
          const next = ids.includes(experienceId)
            ? ids.filter((id) => id !== experienceId)
            : [...ids, experienceId];
          return {
            ...prev,
            candidate: { ...prev.candidate, highlightedExperienceIds: next },
          };
        }),
      analyzeJobDescription: () => {
        const current = documentRef.current;
        if (!current?.job.jobDescription.trim()) {
          toast.error("Paste a job description first");
          return;
        }
        setAnalyzing(true);
        aiAbortRef.current?.abort();
        const controller = new AbortController();
        aiAbortRef.current = controller;

        void (async () => {
          try {
            const result = await aiApi.jobAnalysis(
              {
                coverLetterId: current.id,
                jobDescription: current.job.jobDescription,
                companyName: current.job.companyName,
                jobTitle: current.job.jobTitle,
              },
              controller.signal,
            );
            updateDocument((prev) => ({
              ...prev,
              analysis: mapJobAnalysis(result),
            }));
            toast.success("Job analysis ready");
          } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
              return;
            }
            toast.error("Analysis failed", {
              description: aiClientErrorMessage(error),
            });
          } finally {
            setAnalyzing(false);
          }
        })();
      },
      generateLetter: () => {
        const current = documentRef.current;
        if (
          !current?.job.jobDescription.trim() &&
          !current?.job.companyName
        ) {
          toast.error("Add job details before generating");
          return;
        }
        setGenerating(true);
        setGenerationStepIndex(0);
        aiAbortRef.current?.abort();
        const controller = new AbortController();
        aiAbortRef.current = controller;

        let step = 0;
        const stepTimer = window.setInterval(() => {
          step += 1;
          if (step < generationSteps.length) {
            setGenerationStepIndex(step);
          }
        }, 700);

        void (async () => {
          try {
            const doc = documentRef.current;
            if (!doc) return;

            const result = await aiApi.coverLetter(
              {
                mode: "generate",
                coverLetterId: doc.id,
                cvId: doc.cvId,
                tone: doc.tone,
                length: doc.length,
                job: doc.job,
                candidate: doc.candidate,
              },
              controller.signal,
            );

            if (!("body" in result)) {
              throw new Error("Invalid cover letter response");
            }

            const company = doc.job.companyName || "the company";
            const role = doc.job.jobTitle || "the role";

            updateDocument((prev) => ({
              ...prev,
              body: {
                ...prev.body,
                ...result.body,
              },
              title: `${company} — ${role}`,
            }));
            toast.success("Cover letter generated", {
              description: "Review and edit before sending.",
            });
          } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
              toast.message("Generation cancelled");
              return;
            }
            toast.error("Generation failed", {
              description: aiClientErrorMessage(error),
            });
          } finally {
            window.clearInterval(stepTimer);
            setGenerating(false);
            setGenerationStepIndex(-1);
          }
        })();
      },
      tailorCv: () => {
        const current = documentRef.current;
        if (!current?.cvId) {
          toast.error("Link a CV first");
          return;
        }
        if (!current.job.jobDescription.trim()) {
          toast.error("Paste a job description first");
          return;
        }
        setCvTailoring(true);
        aiAbortRef.current?.abort();
        const controller = new AbortController();
        aiAbortRef.current = controller;

        void (async () => {
          try {
            const result = await aiApi.cvTailor(
              {
                cvId: current.cvId!,
                coverLetterId: current.id,
                jobDescription: current.job.jobDescription,
                jobTitle: current.job.jobTitle,
              },
              controller.signal,
            );
            setCvTailorResult(result);
            toast.success("CV tailoring recommendations ready");
          } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
              return;
            }
            toast.error("CV tailoring failed", {
              description: aiClientErrorMessage(error),
            });
          } finally {
            setCvTailoring(false);
          }
        })();
      },
      requestAi: (action, sectionKey) => {
        runSectionAi(action, sectionKey);
      },
      applyAiSuggestion: () => {
        if (!aiSuggestion) return;
        updateDocument((prev) => ({
          ...prev,
          body: {
            ...prev.body,
            [aiSuggestion.sectionKey]: aiSuggestion.suggestion,
          },
        }));
        setAiSuggestion(null);
        toast.success("Suggestion applied");
      },
      discardAiSuggestion: () => setAiSuggestion(null),
      regenerateAi: () => {
        const last = lastSectionAiRef.current;
        if (last) {
          runSectionAi(last.action, last.sectionKey);
        }
      },
      cancelAi: () => {
        aiAbortRef.current?.abort();
        setAiLoading(false);
        setGenerating(false);
        setAnalyzing(false);
        setCvTailoring(false);
        setGenerationStepIndex(-1);
      },
      applySuggestion: (suggestion) => {
        if (suggestion.sectionKey) {
          setActiveSection(suggestion.sectionKey);
          setAiOpen(true);
        }
        toast.success("Suggestion queued", {
          description: suggestion.title,
        });
        updateDocument((prev) => ({
          ...prev,
          suggestions: prev.suggestions.filter((s) => s.id !== suggestion.id),
        }));
      },
      dismissSuggestion: (id) =>
        updateDocument((prev) => ({
          ...prev,
          suggestions: prev.suggestions.filter((s) => s.id !== id),
        })),
      retrySave: () => {
        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        void persistNow().then(() => {
          if (documentRef.current) {
            toast.success("Saved", {
              description: "All changes are up to date.",
            });
          }
        });
      },
      duplicateLetter: (id) => {
        void (async () => {
          try {
            await duplicateCoverLetter(id);
            await refreshSavedLetters();
            toast.success("Cover letter duplicated");
          } catch (error) {
            toast.error(
              coverLetterErrorMessage(error, "Could not duplicate cover letter."),
            );
          }
        })();
      },
      deleteLetter: (id) => {
        void (async () => {
          try {
            await deleteCoverLetter(id);
            setSavedLetters((prev) => prev.filter((l) => l.id !== id));
            toast.success("Cover letter deleted");
          } catch (error) {
            toast.error(
              coverLetterErrorMessage(error, "Could not delete cover letter."),
            );
          }
        })();
      },
      renameLetter: (id, title) => {
        void (async () => {
          try {
            await renameCoverLetter(id, title);
            setSavedLetters((prev) =>
              prev.map((l) => (l.id === id ? { ...l, title: title.trim() } : l)),
            );
            if (document.id === id) {
              updateDocument((prev) => ({ ...prev, title: title.trim() }));
            }
            toast.success("Renamed");
          } catch (error) {
            toast.error(
              coverLetterErrorMessage(error, "Could not rename cover letter."),
            );
          }
        })();
      },
    };
  }, [
    document,
    savedLetters,
    saveStatus,
    zoom,
    previewOpen,
    aiOpen,
    templatesOpen,
    jobFormOpen,
    activeSection,
    aiSuggestion,
    generating,
    generationStepIndex,
    analyzing,
    cvTailoring,
    cvTailorResult,
    aiLoading,
    updateDocument,
    persistNow,
    refreshSavedLetters,
    runSectionAi,
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
          title="Cover letter unavailable"
          description={
            loadError ??
            "This cover letter could not be loaded. It may have been deleted or you may not have access."
          }
          actionLabel="Back to Cover Letters"
          onAction={() => {
            window.location.href = "/cover-letters";
          }}
          className="max-w-md"
        />
        <div className="sr-only">
          <Button asChild>
            <Link href="/cover-letters">Cover Letters</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const ctx = useContext(CoverLetterContext);
  if (!ctx) {
    throw new Error("useCoverLetter must be used within CoverLetterProvider");
  }
  return ctx;
}
