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
  generationSteps,
  getMockLetterById,
  mockJobAnalysis,
  mockLetterAiSuggestions,
  mockSavedCoverLetters,
} from "@/mocks/cover-letter-builder";
import type {
  ApplicationStatus,
  CoverLetterBody,
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
  updateDocument: (updater: (prev: CoverLetterDocument) => CoverLetterDocument) => void;
  updateJob: (patch: Partial<JobInfo>) => void;
  updateBodySection: (key: LetterSectionKey, value: string) => void;
  setTone: (tone: LetterTone) => void;
  setLength: (length: LetterLength) => void;
  setTemplate: (id: LetterTemplateId) => void;
  setApplicationStatus: (status: ApplicationStatus) => void;
  setTitle: (title: string) => void;
  updateCandidate: (patch: Partial<CoverLetterDocument["candidate"]>) => void;
  toggleExperienceHighlight: (experienceId: string) => void;
  analyzeJobDescription: () => void;
  generateLetter: () => void;
  requestAi: (action: string, sectionKey: LetterSectionKey) => void;
  applyAiSuggestion: () => void;
  discardAiSuggestion: () => void;
  regenerateAi: () => void;
  applySuggestion: (suggestion: CoverLetterSuggestion) => void;
  dismissSuggestion: (id: string) => void;
  retrySave: () => void;
  duplicateLetter: (id: string) => void;
  deleteLetter: (id: string) => void;
  renameLetter: (id: string, title: string) => void;
};

const CoverLetterContext = createContext<CoverLetterContextValue | null>(null);

const GENERATED_BODY: CoverLetterBody = {
  headerName: "Kennedy Sithole",
  headerMeta:
    "Senior Product Designer · London, UK · kennedy.Sithole@email.com · kennedy.design",
  date: "August 5, 2026",
  greeting: "Dear Jordan Ruiz,",
  opening:
    "Northwind's focus on activation for 2M+ users is exactly the problem space I've owned — leading onboarding systems that turn first sessions into lasting habits.",
  experience:
    "At Northline I led the mobile onboarding redesign that improved day-7 activation by 18%, partnering with PM and engineering across discovery, prototyping, and shipping. Earlier at Ledger Labs I designed trading flows for 140k MAU and reduced KYC support tickets by 22% through clearer states.",
  skills:
    "I bring Figma design systems, accessibility-first critique, and workshop facilitation — plus mentorship that lifts craft across growing design orgs.",
  closing:
    "I'd welcome a conversation about how my activation and systems work can help Northwind ship clearer first-run experiences this quarter.",
  signature: "Warm regards,\nKennedy Sithole",
};

export function CoverLetterProvider({
  letterId,
  children,
}: {
  letterId: string;
  children: React.ReactNode;
}) {
  const [document, setDocument] = useState(() => getMockLetterById(letterId));
  const [savedLetters, setSavedLetters] = useState(mockSavedCoverLetters);
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
  const saveTimer = useRef<number | null>(null);

  const scheduleSave = useCallback(() => {
    setSaveStatus("unsaved");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      setSaveStatus("saving");
      window.setTimeout(() => {
        setSaveStatus("saved");
        toast.success("Saved", { description: "Cover letter is up to date." });
      }, 650);
    }, 850);
  }, []);

  const updateDocument = useCallback(
    (updater: (prev: CoverLetterDocument) => CoverLetterDocument) => {
      setDocument((prev) => {
        const next = updater(prev);
        return { ...next, updatedAt: new Date().toISOString() };
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  const value = useMemo<CoverLetterContextValue>(
    () => ({
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
        if (!document.job.jobDescription.trim()) {
          toast.error("Paste a job description first");
          return;
        }
        setAnalyzing(true);
        window.setTimeout(() => {
          updateDocument((prev) => ({
            ...prev,
            analysis: {
              ...mockJobAnalysis,
              analyzedAt: new Date().toISOString(),
            },
          }));
          setAnalyzing(false);
          toast.success("Job analysis ready");
        }, 1400);
      },
      generateLetter: () => {
        if (!document.job.jobDescription.trim() && !document.job.companyName) {
          toast.error("Add job details before generating");
          return;
        }
        setGenerating(true);
        setGenerationStepIndex(0);
        let step = 0;
        const timer = window.setInterval(() => {
          step += 1;
          if (step >= generationSteps.length) {
            window.clearInterval(timer);
            const company = document.job.companyName || "the company";
            const role = document.job.jobTitle || "the role";
            const manager = document.job.hiringManager;
            updateDocument((prev) => ({
              ...prev,
              analysis: prev.analysis ?? mockJobAnalysis,
              body: {
                ...GENERATED_BODY,
                greeting: manager
                  ? `Dear ${manager},`
                  : "Dear Hiring Manager,",
                opening: GENERATED_BODY.opening.replace("Northwind", company),
                closing: GENERATED_BODY.closing.replace("Northwind", company),
              },
              title: `${company} — ${role}`,
              score: {
                total: 92,
                breakdown: {
                  personalization: 94,
                  keywords: 90,
                  tone: 93,
                  structure: 91,
                  grammar: 96,
                },
                recommendations: [
                  "Keep the hiring manager name — it lifts personalization.",
                  "Review the experience paragraph for one more metric.",
                ],
              },
              suggestions: mockCoverLetterDocumentSuggestions(),
            }));
            setGenerating(false);
            setGenerationStepIndex(-1);
            toast.success("Cover letter generated");
            return;
          }
          setGenerationStepIndex(step);
        }, 700);
      },
      requestAi: (action, sectionKey) => {
        const key =
          action.toLowerCase().includes("match")
            ? "match_jd"
            : sectionKey === "experience"
              ? "rewrite_experience"
              : sectionKey === "closing"
                ? "persuasive_closing"
                : "improve_opening";
        const suggestion = {
          ...mockLetterAiSuggestions[key],
          sectionKey,
          action,
          original: document.body[sectionKey],
        };
        setAiSuggestion(suggestion);
        setActiveSection(sectionKey);
        setAiOpen(true);
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
        toast.message("Regenerating…", {
          description: "Mock AI drafted a fresh alternative.",
        });
        if (!aiSuggestion) return;
        setAiSuggestion({
          ...aiSuggestion,
          id: `${aiSuggestion.id}_${Date.now()}`,
          suggestion: `${aiSuggestion.suggestion} (refined for ${document.tone} tone.)`,
          confidence: Math.min(0.98, aiSuggestion.confidence + 0.02),
        });
      },
      applySuggestion: (suggestion) => {
        if (suggestion.sectionKey) {
          setActiveSection(suggestion.sectionKey);
          setAiOpen(true);
          requestAnimationFrame(() => {
            /* panel focuses section */
          });
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
      retrySave: () => scheduleSave(),
      duplicateLetter: (id) => {
        const source = savedLetters.find((l) => l.id === id);
        if (!source) return;
        const copy: SavedCoverLetterSummary = {
          ...source,
          id: `cl_${Date.now()}`,
          title: `${source.title} (copy)`,
          applicationStatus: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setSavedLetters((prev) => [copy, ...prev]);
        toast.success("Cover letter duplicated");
      },
      deleteLetter: (id) => {
        setSavedLetters((prev) => prev.filter((l) => l.id !== id));
        toast.success("Cover letter deleted");
      },
      renameLetter: (id, title) => {
        setSavedLetters((prev) =>
          prev.map((l) => (l.id === id ? { ...l, title } : l)),
        );
        if (document.id === id) {
          updateDocument((prev) => ({ ...prev, title }));
        }
        toast.success("Renamed");
      },
    }),
    [
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
      updateDocument,
      scheduleSave,
    ],
  );

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}

function mockCoverLetterDocumentSuggestions(): CoverLetterSuggestion[] {
  return [
    {
      id: "sug_new_1",
      title: "Mention React / frontend collaboration",
      body: "Call out partnership with engineering on shipped UI.",
      sectionKey: "skills",
      impact: "+4 personalization",
    },
    {
      id: "sug_new_2",
      title: "Add measurable achievement",
      body: "Lead with the +18% activation lift in experience.",
      sectionKey: "experience",
      impact: "+6 keywords",
    },
  ];
}

export function useCoverLetter() {
  const ctx = useContext(CoverLetterContext);
  if (!ctx) {
    throw new Error("useCoverLetter must be used within CoverLetterProvider");
  }
  return ctx;
}
