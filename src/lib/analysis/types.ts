import type { CvSectionType } from "@/features/cv-editor/types";

export type AnalysisPriority = "critical" | "high" | "medium" | "low";

export type AnalysisStatus = "strong" | "good" | "needs-work";

export type AnalysisCategoryScore = {
  id: string;
  label: string;
  score: number;
  status: AnalysisStatus;
  explanation: string;
  strengths: string[];
  improvements: string[];
};

export type AnalysisRecommendation = {
  id: string;
  priority: AnalysisPriority;
  title: string;
  reason: string;
  action: string;
  sectionType?: CvSectionType;
  aiAction?: "summary" | "experience" | "skills" | "ats" | "tailor";
};

export type AtsIssue = {
  severity: AnalysisPriority;
  title: string;
  explanation: string;
};

export type ScoreBreakdownItem = {
  id: string;
  label: string;
  score: number;
};

export type SummaryAnalysisDetail = {
  score: number;
  explanation: string;
  strengths: string[];
  improvements: string[];
};

export type ExperienceAnalysisItem = {
  experienceLabel: string;
  relevance: "high" | "medium" | "low";
  strength: string;
  keywordsPresent: string[];
  keywordsToIncorporate: string[];
  recommendations: string[];
};

export type EducationAnalysisDetail = {
  score: number;
  explanation: string;
  strengths: string[];
  improvements: string[];
};

export type CVAnalysisResult = {
  overallScore: number;
  atsScore: number;
  disclaimer: string;
  categories: AnalysisCategoryScore[];
  atsBreakdown: ScoreBreakdownItem[];
  atsIssues: AtsIssue[];
  strengths: string[];
  weaknesses: string[];
  recommendations: AnalysisRecommendation[];
  improvementPlan: AnalysisRecommendation[];
  summaryAnalysis: SummaryAnalysisDetail | null;
  experienceAnalysis: ExperienceAnalysisItem[];
  educationAnalysis: EducationAnalysisDetail | null;
  isIncomplete: boolean;
  missingAreas: string[];
};

export type KeywordStatus = {
  keyword: string;
  priority: "high" | "medium" | "low";
  status: "present" | "missing" | "partial";
};

export type SkillGapItem = {
  skill: string;
  status: "demonstrated" | "missing_from_cv" | "consider_adding";
  note: string;
};

export type JobMatchExperienceItem = {
  experienceLabel: string;
  relevance: "high" | "medium" | "low";
  reason: string;
  recommendations: string[];
};

export type JobMatchResult = {
  matchScore: number;
  disclaimer: string;
  breakdown: ScoreBreakdownItem[];
  matchingSkills: string[];
  missingKeywords: string[];
  keywords: KeywordStatus[];
  skillGaps: SkillGapItem[];
  relevantExperience: JobMatchExperienceItem[];
  recommendations: AnalysisRecommendation[];
  jobTitle: string;
};

export type StoredCvAnalysis = {
  id: string;
  cvId: string;
  analysisType: "cv_health" | "job_match";
  result: CVAnalysisResult | JobMatchResult;
  model: string | null;
  cvUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
  isStale: boolean;
  jobDescriptionHash?: string | null;
};

export type CvAnalysisResponse = {
  analysis: StoredCvAnalysis | null;
  cached: boolean;
};
