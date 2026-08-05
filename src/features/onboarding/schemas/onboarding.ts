import { z } from "zod";

export const employmentStatusOptions = [
  "employed",
  "seeking",
  "student",
  "freelance",
  "career-break",
] as const;

export const experienceLevelOptions = [
  "student",
  "graduate",
  "junior",
  "mid",
  "senior",
  "executive",
] as const;

export const careerGoalOptions = [
  "new-job",
  "first-cv",
  "improve-cv",
  "international",
  "cover-letters",
  "interview-prep",
  "freelancing",
] as const;

export const themePreferenceOptions = ["light", "dark", "system"] as const;

export const profileStepSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  profession: z.string().min(2, "Enter your profession"),
  yearsExperience: z.coerce.number().min(0).max(50),
  employmentStatus: z.enum(employmentStatusOptions),
  country: z.string().min(1, "Select a country"),
  preferredLanguage: z.string().min(1, "Select a language"),
});

export const goalsStepSchema = z.object({
  goals: z.array(z.enum(careerGoalOptions)).min(1, "Pick at least one goal"),
});

export const experienceStepSchema = z.object({
  experienceLevel: z.enum(experienceLevelOptions),
});

export const aiPreferencesSchema = z.object({
  improveGrammar: z.boolean(),
  suggestAchievements: z.boolean(),
  generateSummaries: z.boolean(),
  optimizeAts: z.boolean(),
  rewriteProfessionally: z.boolean(),
  improveReadability: z.boolean(),
  createCoverLetters: z.boolean(),
});

export const themeStepSchema = z.object({
  theme: z.enum(themePreferenceOptions),
});

export const onboardingSchema = profileStepSchema
  .and(goalsStepSchema)
  .and(experienceStepSchema)
  .and(aiPreferencesSchema)
  .and(themeStepSchema);

export type OnboardingValues = z.infer<typeof onboardingSchema>;
export type ProfileStepValues = z.infer<typeof profileStepSchema>;
export type GoalsStepValues = z.infer<typeof goalsStepSchema>;
export type ExperienceStepValues = z.infer<typeof experienceStepSchema>;
export type AiPreferencesValues = z.infer<typeof aiPreferencesSchema>;
export type ThemeStepValues = z.infer<typeof themeStepSchema>;
