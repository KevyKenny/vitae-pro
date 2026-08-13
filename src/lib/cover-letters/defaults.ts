import type {
  ApplicationStatus,
  CandidateProfile,
  CoverLetterBody,
  CoverLetterDocument,
  CoverLetterScore,
  CoverLetterSuggestion,
  LetterLength,
  LetterTemplateId,
  LetterTone,
} from "@/features/cover-letter/types";
import type { Profile } from "@/lib/database/types";
import { profileDisplayName } from "@/lib/auth/names";

const TEMPLATE_LABELS: Record<LetterTemplateId, string> = {
  professional: "Professional",
  modern: "Modern",
  executive: "Executive",
  minimal: "Minimal",
  creative: "Creative",
};

export function letterTemplateLabel(key: LetterTemplateId): string {
  return TEMPLATE_LABELS[key] ?? "Professional";
}

export function parseLetterTemplateKey(
  value: string | null | undefined,
): LetterTemplateId {
  const allowed: LetterTemplateId[] = [
    "professional",
    "modern",
    "executive",
    "minimal",
    "creative",
  ];
  if (value && allowed.includes(value as LetterTemplateId)) {
    return value as LetterTemplateId;
  }
  return "professional";
}

export function buildCandidateFromProfile(
  profile: Profile | null,
  email?: string | null,
): CandidateProfile {
  const name = profileDisplayName(profile, email);
  return {
    name,
    currentRole: profile?.professional_title?.trim() ?? "",
    yearsExperience: 0,
    topSkills: [],
    keyAchievements: [],
    highlightedExperienceIds: [],
  };
}

export function buildEmptyBodyFromCandidate(
  candidate: CandidateProfile,
  email?: string | null,
): CoverLetterBody {
  const metaParts = [
    candidate.currentRole,
    email?.trim() ?? "",
  ].filter(Boolean);

  return {
    headerName: candidate.name,
    headerMeta: metaParts.join(" · "),
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    greeting: "",
    opening: "",
    experience: "",
    skills: "",
    closing: "",
    signature: candidate.name ? `Yours Sincerely,\n\n${candidate.name}` : "",
  };
}

export function emptyCoverLetterScore(): CoverLetterScore {
  return {
    total: 0,
    breakdown: {
      personalization: 0,
      keywords: 0,
      tone: 0,
      structure: 0,
      grammar: 0,
    },
    recommendations: [],
  };
}

export function buildDefaultTitle(options: {
  jobTitle?: string | null;
  companyName?: string | null;
  professionalTitle?: string | null;
}): string {
  const job = options.jobTitle?.trim();
  const company = options.companyName?.trim();
  if (job && company) return `${job} — ${company}`;
  const title = options.professionalTitle?.trim();
  if (title) return `Cover Letter — ${title}`;
  return "Cover Letter";
}

export function newEmptyCoverLetterDocument(
  partial: Partial<CoverLetterDocument> & Pick<CoverLetterDocument, "id">,
): CoverLetterDocument {
  const now = new Date().toISOString();
  const candidate =
    partial.candidate ?? buildCandidateFromProfile(null);
  const body =
    partial.body ?? buildEmptyBodyFromCandidate(candidate);

  return {
    id: partial.id,
    title: partial.title ?? "Cover Letter",
    templateId: partial.templateId ?? "professional",
    tone: partial.tone ?? "professional",
    length: partial.length ?? "medium",
    applicationStatus: partial.applicationStatus ?? "draft",
    job: partial.job ?? {
      companyName: "",
      jobTitle: "",
      hiringManager: "",
      companyWebsite: "",
      companyLocation: "",
      jobDescription: "",
    },
    analysis: partial.analysis ?? null,
    candidate,
    body,
    score: partial.score ?? emptyCoverLetterScore(),
    suggestions: partial.suggestions ?? [],
    cvId: partial.cvId ?? null,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };
}

export function parseApplicationStatus(
  value: string | null | undefined,
): ApplicationStatus {
  const allowed: ApplicationStatus[] = [
    "draft",
    "applied",
    "interview",
    "offer",
    "rejected",
  ];
  if (value && allowed.includes(value as ApplicationStatus)) {
    return value as ApplicationStatus;
  }
  return "draft";
}

export function parseLetterTone(value: string | null | undefined): LetterTone {
  const allowed: LetterTone[] = [
    "professional",
    "confident",
    "friendly",
    "executive",
    "creative",
    "technical",
  ];
  if (value && allowed.includes(value as LetterTone)) {
    return value as LetterTone;
  }
  return "professional";
}

export function parseLetterLength(
  value: string | null | undefined,
): LetterLength {
  const allowed: LetterLength[] = ["short", "medium", "detailed"];
  if (value && allowed.includes(value as LetterLength)) {
    return value as LetterLength;
  }
  return "medium";
}

export function remapCoverLetterIds(
  doc: CoverLetterDocument,
): CoverLetterDocument {
  const idMap = new Map<string, string>();

  const remap = (id: string): string => {
    const existing = idMap.get(id);
    if (existing) return existing;
    const next = crypto.randomUUID();
    idMap.set(id, next);
    return next;
  };

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const ensureId = (id: string): string =>
    uuidPattern.test(id) ? id : remap(id);

  return {
    ...doc,
    id: ensureId(doc.id),
    suggestions: doc.suggestions.map(
      (suggestion): CoverLetterSuggestion => ({
        ...suggestion,
        id: ensureId(suggestion.id),
      }),
    ),
  };
}
