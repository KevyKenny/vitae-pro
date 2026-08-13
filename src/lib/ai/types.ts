export type SummaryAction =
  | "generate"
  | "improve"
  | "professional"
  | "concise"
  | "confident"
  | "ats";

export type ExperienceAction =
  | "improve"
  | "rewrite"
  | "professional"
  | "concise"
  | "impact"
  | "bullets"
  | "ats";

export type CoverLetterAction = "generate" | "improve" | "regenerate";

export type ProfessionalSummaryResult = {
  suggestion: string;
  explanation: string;
  confidence: number;
};

export type ExperienceImprovementResult = {
  suggestion: string;
  explanation: string;
  confidence: number;
  metricQuestions?: string[];
};

export type ExperienceBulletsResult = {
  bullets: string[];
  explanation: string;
  confidence: number;
  metricQuestions?: string[];
};

export type CoverLetterSectionResult = {
  suggestion: string;
  explanation: string;
  confidence: number;
};

export type CoverLetterGenerateResult = {
  body: {
    greeting: string;
    opening: string;
    experience: string;
    skills: string;
    closing: string;
    signature: string;
  };
  explanation: string;
  confidence: number;
};

export type JobAnalysisResult = {
  jobTitle: string;
  skills: string[];
  preferredSkills: string[];
  keywords: string[];
  responsibilities: string[];
  experienceRequirements: string[];
  educationRequirements: string[];
  companyValues: string[];
  roleExpectations: string[];
};

export type CvTailoringResult = {
  matchingSkills: string[];
  missingKeywords: string[];
  relevantExperience: string[];
  areasToStrengthen: string[];
  summarySuggestions: string[];
  experienceImprovements: Array<{
    experienceLabel: string;
    suggestion: string;
  }>;
  skillsToEmphasize: string[];
  recommendations: string[];
};

export type SkillsSuggestionResult = {
  demonstratedSkills: string[];
  skillsToConsider: string[];
  explanation: string;
  confidence: number;
  suggestion?: string;
};

export type AiUsageMeta = {
  inputTokens?: number;
  outputTokens?: number;
  model: string;
  durationMs: number;
};

export type AiSuggestionResponse = {
  id: string;
  suggestion: string;
  explanation: string;
  confidence: number;
  metricQuestions?: string[];
};
