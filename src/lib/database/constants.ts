/** Domain constants aligned with SQL check constraints */

export const CV_STATUSES = ["draft", "completed", "archived"] as const;

export const EXPERIENCE_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "industrial_attachment",
  "graduate_trainee",
  "apprenticeship",
  "freelance",
  "volunteer",
  "consulting",
  "temporary",
  "self_employed",
  "other",
] as const;

export const QUALIFICATION_TYPES = [
  "o_level",
  "a_level",
  "certificate",
  "diploma",
  "hnd",
  "bachelors",
  "honours",
  "masters",
  "doctorate",
  "professional",
  "short_course",
  "apprenticeship",
  "vocational",
  "other",
] as const;

export const SKILL_CATEGORIES = [
  "technical",
  "soft_skill",
  "tool",
  "framework",
  "language",
  "other",
] as const;

export const AI_FEATURES = [
  "professional_summary",
  "experience_rewrite",
  "achievement_generation",
  "grammar_improvement",
  "ats_optimization",
  "cover_letter",
  "other",
] as const;

export const SUBSCRIPTION_PLANS = ["free", "professional", "premium"] as const;

/**
 * Map frontend editor kebab-case experience types → DB snake_case.
 */
export function toDbExperienceType(editorType: string): string {
  return editorType.replace(/-/g, "_");
}

export function toDbQualificationType(editorType: string): string {
  return editorType.replace(/-/g, "_");
}

export function toEditorExperienceType(dbType: string): string {
  return dbType.replace(/_/g, "-");
}

export function toEditorQualificationType(dbType: string): string {
  return dbType.replace(/_/g, "-");
}
