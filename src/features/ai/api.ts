"use client";

import type {
  CoverLetterGenerateResult,
  CoverLetterSectionResult,
  CvTailoringResult,
  ExperienceBulletsResult,
  ExperienceImprovementResult,
  JobAnalysisResult,
  ProfessionalSummaryResult,
  SkillsSuggestionResult,
} from "@/lib/ai/types";
import type {
  CVAnalysisResult,
  JobMatchResult,
  StoredCvAnalysis,
} from "@/lib/analysis/types";

export class AiClientError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "AiClientError";
    this.code = code;
    this.status = status;
  }
}

async function postAi<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(`/api/ai/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  const payload = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  };

  if (!res.ok) {
    throw new AiClientError(
      payload.error ?? "unknown",
      payload.message ?? "AI request failed.",
      res.status,
    );
  }

  return payload as T;
}

export function mapSummaryAction(action: string) {
  const normalized = action.toLowerCase();
  if (normalized.includes("generate")) return "generate" as const;
  if (normalized.includes("concise")) return "concise" as const;
  if (normalized.includes("professional")) return "professional" as const;
  if (normalized.includes("confident")) return "confident" as const;
  if (normalized.includes("ats")) return "ats" as const;
  return "improve" as const;
}

export function mapExperienceAction(action: string) {
  const normalized = action.toLowerCase();
  if (normalized.includes("bullet") || normalized.includes("measurable")) {
    return "bullets" as const;
  }
  if (normalized.includes("concise")) return "concise" as const;
  if (normalized.includes("professional")) return "professional" as const;
  if (normalized.includes("impact") || normalized.includes("measurable")) {
    return "impact" as const;
  }
  if (normalized.includes("ats")) return "ats" as const;
  if (normalized.includes("rewrite")) return "rewrite" as const;
  return "improve" as const;
}

export const aiApi = {
  summary: (
    body: { cvId: string; action: string; currentSummary?: string },
    signal?: AbortSignal,
  ) =>
    postAi<ProfessionalSummaryResult & { id: string }>("summary", body, signal),

  experience: (
    body: {
      cvId: string;
      action: string;
      mode?: "single" | "bullets";
      experienceId?: string;
      bulletIndex?: number;
      field?: "responsibilities" | "achievements";
      text?: string;
      jobTitle?: string;
      company?: string;
      description?: string;
    },
    signal?: AbortSignal,
  ) =>
    postAi<
      (ExperienceImprovementResult | ExperienceBulletsResult) & { id: string }
    >("experience", body, signal),

  coverLetter: (
    body: Record<string, unknown>,
    signal?: AbortSignal,
  ) =>
    postAi<
      (CoverLetterGenerateResult | CoverLetterSectionResult) & { id: string }
    >("cover-letter", body, signal),

  jobAnalysis: (
    body: {
      jobDescription: string;
      companyName?: string;
      jobTitle?: string;
      coverLetterId?: string;
    },
    signal?: AbortSignal,
  ) => postAi<JobAnalysisResult>("job-analysis", body, signal),

  cvTailor: (
    body: {
      cvId: string;
      jobDescription: string;
      jobTitle?: string;
      coverLetterId?: string;
    },
    signal?: AbortSignal,
  ) => postAi<CvTailoringResult>("cv-tailor", body, signal),

  skills: (
    body: {
      cvId: string;
      targetRole?: string;
      jobDescription?: string;
    },
    signal?: AbortSignal,
  ) => postAi<SkillsSuggestionResult & { id: string }>("skills", body, signal),

  cvAnalysis: (
    body: { cvId: string; force?: boolean },
    signal?: AbortSignal,
  ) =>
    postAi<{
      analysis: CVAnalysisResult;
      cached: boolean;
      incomplete?: boolean;
      stored?: StoredCvAnalysis;
    }>("cv-analysis", body, signal),

  jobMatch: (
    body: {
      cvId: string;
      jobDescription: string;
      jobTitle?: string;
      companyName?: string;
      force?: boolean;
    },
    signal?: AbortSignal,
  ) =>
    postAi<{
      match: JobMatchResult;
      cached: boolean;
      stored?: StoredCvAnalysis;
    }>("job-match", body, signal),

  getCachedAnalysis: async (
    cvId: string,
    type: "cv_health" | "job_match" = "cv_health",
    jobDescription?: string,
  ) => {
    const params = new URLSearchParams({ cvId, type });
    if (jobDescription) params.set("jobDescription", jobDescription);
    const res = await fetch(`/api/cv/analysis?${params}`);
    if (!res.ok) return { analysis: null, cached: false };
    return res.json() as Promise<{ analysis: StoredCvAnalysis | null; cached: boolean }>;
  },
};

export function aiClientErrorMessage(error: unknown): string {
  if (error instanceof AiClientError) return error.message;
  if (error instanceof DOMException && error.name === "AbortError") {
    return "AI request cancelled.";
  }
  return "Something went wrong with the AI request. Please try again.";
}
