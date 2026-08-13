import type { SaveStatus } from "@/features/cv-editor/types";

export type { SaveStatus };

export type LetterTone =
  | "professional"
  | "confident"
  | "friendly"
  | "executive"
  | "creative"
  | "technical";

export type LetterLength = "short" | "medium" | "detailed";

export type ApplicationStatus =
  | "draft"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export type LetterTemplateId =
  | "professional"
  | "modern"
  | "executive"
  | "minimal"
  | "creative";

export type LetterSectionKey =
  | "greeting"
  | "opening"
  | "experience"
  | "skills"
  | "closing"
  | "signature";

export type JobInfo = {
  companyName: string;
  jobTitle: string;
  hiringManager: string;
  companyWebsite: string;
  companyLocation: string;
  jobDescription: string;
};

export type JobAnalysis = {
  skills: string[];
  keywords: string[];
  experienceRequirements: string[];
  companyValues: string[];
  roleExpectations: string[];
  analyzedAt: string;
};

export type CandidateProfile = {
  name: string;
  currentRole: string;
  yearsExperience: number;
  topSkills: string[];
  keyAchievements: string[];
  highlightedExperienceIds: string[];
};

export type CoverLetterBody = {
  headerName: string;
  headerMeta: string;
  date: string;
  greeting: string;
  opening: string;
  experience: string;
  skills: string;
  closing: string;
  signature: string;
};

export type LetterScoreBreakdown = {
  personalization: number;
  keywords: number;
  tone: number;
  structure: number;
  grammar: number;
};

export type CoverLetterScore = {
  total: number;
  breakdown: LetterScoreBreakdown;
  recommendations: string[];
};

export type CoverLetterSuggestion = {
  id: string;
  title: string;
  body: string;
  sectionKey?: LetterSectionKey;
  impact: string;
};

export type LetterAiSuggestion = {
  id: string;
  sectionKey: LetterSectionKey;
  action: string;
  original: string;
  suggestion: string;
  explanation: string;
  confidence: number;
};

export type LetterTemplate = {
  id: LetterTemplateId;
  name: string;
  description: string;
};

export type GenerationStep = {
  id: string;
  label: string;
};

export type CoverLetterDocument = {
  id: string;
  title: string;
  templateId: LetterTemplateId;
  tone: LetterTone;
  length: LetterLength;
  applicationStatus: ApplicationStatus;
  job: JobInfo;
  analysis: JobAnalysis | null;
  candidate: CandidateProfile;
  body: CoverLetterBody;
  score: CoverLetterScore;
  suggestions: CoverLetterSuggestion[];
  cvId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SavedCoverLetterSummary = {
  id: string;
  title: string;
  company: string;
  role: string;
  cvTitle?: string | null;
  templateName?: string;
  createdAt: string;
  updatedAt: string;
  applicationStatus: ApplicationStatus;
};
