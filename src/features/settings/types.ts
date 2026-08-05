import type { SaveStatus } from "@/features/cv-editor/types";

export type { SaveStatus };

export type WritingStyle =
  | "professional"
  | "friendly"
  | "confident"
  | "executive"
  | "technical"
  | "creative";

export type AssistanceLevel = "minimal" | "balanced" | "advanced";

export type CareerFocusId =
  | "hired-faster"
  | "improve-cv"
  | "change-careers"
  | "international"
  | "senior-roles"
  | "freelancing";

export type CareerLevelId =
  | "student"
  | "graduate"
  | "junior"
  | "mid-level"
  | "senior"
  | "executive";

export type IndustryId =
  | "technology"
  | "finance"
  | "healthcare"
  | "marketing"
  | "design"
  | "engineering";

export type CvStylePref = "ats" | "modern" | "creative" | "executive";

export type AppearanceTheme = "light" | "dark" | "system";

export type AccentColorId = "emerald" | "gold" | "navy" | "slate" | "terracotta";

export type SettingsProfile = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  country: string;
  linkedin: string;
  portfolio: string;
  github: string;
  website: string;
  photoUrl?: string;
  careerLevel: CareerLevelId;
  industry: IndustryId;
  yearsExperience: number;
  employmentStatus: string;
  careerGoals: string;
  profileCompletion: number;
};

export type AiPreferences = {
  writingStyle: WritingStyle;
  assistanceLevel: AssistanceLevel;
  autoSuggest: boolean;
  highlightWeak: boolean;
  recommendKeywords: boolean;
  improveGrammar: boolean;
  optimizeAts: boolean;
  generateAchievements: boolean;
  suggestSkills: boolean;
  careerFocus: CareerFocusId[];
};

export type CvPreferences = {
  defaultTemplateId: string;
  defaultFont: string;
  defaultColorTheme: string;
  defaultLanguage: string;
  dateFormat: "mdy" | "dmy" | "ymd";
  pageSize: "a4" | "letter";
  cvStyle: CvStylePref;
};

export type AppearancePreferences = {
  theme: AppearanceTheme;
  accent: AccentColorId;
  animations: boolean;
  compactMode: boolean;
};

export type NotificationPreferences = {
  email: boolean;
  productUpdates: boolean;
  aiSuggestions: boolean;
  cvReminders: boolean;
  templateReleases: boolean;
  tips: boolean;
};

export type SecuritySession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export type LoginEvent = {
  id: string;
  at: string;
  device: string;
  location: string;
  status: "success" | "failed";
};

export type PlanId = "free" | "professional" | "premium";

export type SubscriptionPlan = {
  id: PlanId;
  name: string;
  priceMonthly: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type UsageMeterData = {
  aiGenerations: { used: number; limit: number };
  cvExports: { used: number; limit: number };
  templatesUnlocked: { used: number; limit: number };
};

export type BillingState = {
  currentPlanId: PlanId;
  renewsAt: string;
  usage: UsageMeterData;
};
