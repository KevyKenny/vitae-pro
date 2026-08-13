import type {
  ApplicationStatus,
  CandidateProfile,
  CoverLetterBody,
  CoverLetterDocument,
  CoverLetterScore,
  CoverLetterSuggestion,
  JobAnalysis,
  JobInfo,
  LetterLength,
  LetterTemplateId,
  LetterTone,
} from "@/features/cover-letter/types";
import {
  buildEmptyBodyFromCandidate,
  buildCandidateFromProfile,
  emptyCoverLetterScore,
  parseApplicationStatus,
  parseLetterLength,
  parseLetterTemplateKey,
  parseLetterTone,
} from "@/lib/cover-letters/defaults";
import type { Json, Tables, TablesInsert } from "@/lib/database/types";

type CoverLetterRow = Tables<"cover_letters">;

type StoredContent = {
  body?: CoverLetterBody;
  candidate?: CandidateProfile;
  suggestions?: CoverLetterSuggestion[];
  score?: Pick<CoverLetterScore, "breakdown" | "recommendations">;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseBody(value: unknown, fallback: CoverLetterBody): CoverLetterBody {
  if (!isRecord(value)) return fallback;

  return {
    headerName:
      typeof value.headerName === "string"
        ? value.headerName
        : fallback.headerName,
    headerMeta:
      typeof value.headerMeta === "string"
        ? value.headerMeta
        : fallback.headerMeta,
    date: typeof value.date === "string" ? value.date : fallback.date,
    greeting:
      typeof value.greeting === "string" ? value.greeting : fallback.greeting,
    opening:
      typeof value.opening === "string" ? value.opening : fallback.opening,
    experience:
      typeof value.experience === "string"
        ? value.experience
        : fallback.experience,
    skills: typeof value.skills === "string" ? value.skills : fallback.skills,
    closing:
      typeof value.closing === "string" ? value.closing : fallback.closing,
    signature:
      typeof value.signature === "string"
        ? value.signature
        : fallback.signature,
  };
}

function parseCandidate(value: unknown): CandidateProfile | null {
  if (!isRecord(value)) return null;
  return {
    name: typeof value.name === "string" ? value.name : "",
    currentRole:
      typeof value.currentRole === "string" ? value.currentRole : "",
    yearsExperience:
      typeof value.yearsExperience === "number" ? value.yearsExperience : 0,
    topSkills: parseStringArray(value.topSkills),
    keyAchievements: parseStringArray(value.keyAchievements),
    highlightedExperienceIds: parseStringArray(value.highlightedExperienceIds),
  };
}

function parseSuggestions(value: unknown): CoverLetterSuggestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      title: typeof item.title === "string" ? item.title : "",
      body: typeof item.body === "string" ? item.body : "",
      impact: typeof item.impact === "string" ? item.impact : "",
      ...(typeof item.sectionKey === "string"
        ? { sectionKey: item.sectionKey as CoverLetterSuggestion["sectionKey"] }
        : {}),
    }));
}

function parseScoreMeta(value: unknown): Pick<
  CoverLetterScore,
  "breakdown" | "recommendations"
> | null {
  if (!isRecord(value)) return null;
  const breakdown = isRecord(value.breakdown) ? value.breakdown : null;
  return {
    breakdown: {
      personalization:
        typeof breakdown?.personalization === "number"
          ? breakdown.personalization
          : 0,
      keywords:
        typeof breakdown?.keywords === "number" ? breakdown.keywords : 0,
      tone: typeof breakdown?.tone === "number" ? breakdown.tone : 0,
      structure:
        typeof breakdown?.structure === "number" ? breakdown.structure : 0,
      grammar:
        typeof breakdown?.grammar === "number" ? breakdown.grammar : 0,
    },
    recommendations: parseStringArray(value.recommendations),
  };
}

function parseStoredContent(raw: Json): StoredContent {
  if (!isRecord(raw)) return {};
  return {
    body: isRecord(raw.body)
      ? parseBody(raw.body, buildEmptyBodyFromCandidate(buildCandidateFromProfile(null)))
      : undefined,
    candidate: parseCandidate(raw.candidate) ?? undefined,
    suggestions: parseSuggestions(raw.suggestions),
    score: parseScoreMeta(raw.score) ?? undefined,
  };
}

/** Legacy seed rows store body fields at the content root. */
function parseLegacyFlatContent(raw: Json): Partial<CoverLetterBody> | null {
  if (!isRecord(raw)) return null;
  if ("body" in raw || "candidate" in raw) return null;

  const hasLegacyField =
    "greeting" in raw ||
    "opening" in raw ||
    "headerName" in raw ||
    "signature" in raw;
  if (!hasLegacyField) return null;

  return parseBody(raw, buildEmptyBodyFromCandidate(buildCandidateFromProfile(null)));
}

function parseJobAnalysis(value: Json | null): JobAnalysis | null {
  if (!isRecord(value)) return null;
  return {
    skills: parseStringArray(value.skills),
    keywords: parseStringArray(value.keywords),
    experienceRequirements: parseStringArray(value.experienceRequirements),
    companyValues: parseStringArray(value.companyValues),
    roleExpectations: parseStringArray(value.roleExpectations),
    analyzedAt:
      typeof value.analyzedAt === "string"
        ? value.analyzedAt
        : new Date().toISOString(),
  };
}

function jobFromRow(row: CoverLetterRow): JobInfo {
  return {
    companyName: row.company_name ?? "",
    jobTitle: row.job_title ?? "",
    hiringManager: row.hiring_manager ?? "",
    companyWebsite: row.company_website ?? "",
    companyLocation: row.company_location ?? "",
    jobDescription: row.job_description ?? "",
  };
}

export function rowToCoverLetterDocument(row: CoverLetterRow): CoverLetterDocument {
  const stored = parseStoredContent(row.content);
  const legacyBody = parseLegacyFlatContent(row.content);
  const candidate =
    stored.candidate ?? buildCandidateFromProfile(null);
  const fallbackBody = buildEmptyBodyFromCandidate(candidate);
  const body = stored.body ?? legacyBody ?? fallbackBody;
  const scoreMeta = stored.score;
  const defaultScore = emptyCoverLetterScore();

  return {
    id: row.id,
    title: row.title,
    templateId: parseLetterTemplateKey(row.template_key),
    tone: parseLetterTone(row.tone),
    length: parseLetterLength(row.length),
    applicationStatus: parseApplicationStatus(row.application_status),
    job: jobFromRow(row),
    analysis: parseJobAnalysis(row.job_analysis),
    candidate,
    body: parseBody(body, fallbackBody),
    score: {
      total: row.score ?? defaultScore.total,
      breakdown: scoreMeta?.breakdown ?? defaultScore.breakdown,
      recommendations:
        scoreMeta?.recommendations ?? defaultScore.recommendations,
    },
    suggestions: stored.suggestions ?? [],
    cvId: row.cv_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function documentToRowUpdate(
  doc: CoverLetterDocument,
  userId: string,
  options?: {
    cvId?: string | null;
    templateId?: string | null;
    includeStatus?: boolean;
  },
): TablesInsert<"cover_letters"> {
  const content: StoredContent = {
    body: doc.body,
    candidate: doc.candidate,
    suggestions: doc.suggestions,
    score: {
      breakdown: doc.score.breakdown,
      recommendations: doc.score.recommendations,
    },
  };

  const cvId = options?.cvId !== undefined ? options.cvId : doc.cvId ?? null;

  const row: TablesInsert<"cover_letters"> = {
    id: doc.id,
    user_id: userId,
    title: doc.title,
    company_name: doc.job.companyName || null,
    job_title: doc.job.jobTitle || null,
    job_description: doc.job.jobDescription || null,
    hiring_manager: doc.job.hiringManager || null,
    company_website: doc.job.companyWebsite || null,
    company_location: doc.job.companyLocation || null,
    tone: doc.tone,
    length: doc.length,
    template_key: doc.templateId,
    template_id: options?.templateId ?? null,
    cv_id: cvId,
    content: content as Json,
    job_analysis: (doc.analysis ?? null) as Json | null,
    application_status: doc.applicationStatus as ApplicationStatus,
    score: doc.score.total,
    updated_at: new Date().toISOString(),
  };

  if (options?.includeStatus !== false) {
    row.status = "draft";
  }

  return row;
}

export type CoverLetterListRow = Pick<
  CoverLetterRow,
  | "id"
  | "title"
  | "company_name"
  | "job_title"
  | "cv_id"
  | "template_key"
  | "application_status"
  | "status"
  | "updated_at"
  | "created_at"
>;

export type CoverLetterListItem = {
  id: string;
  title: string;
  company: string;
  role: string;
  cvId: string | null;
  cvTitle: string | null;
  templateKey: LetterTemplateId;
  templateName: string;
  applicationStatus: ApplicationStatus;
  status: "draft" | "completed" | "archived";
  updatedAt: string;
  createdAt: string;
};
