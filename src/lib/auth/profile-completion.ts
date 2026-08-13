import type { Profile } from "@/lib/database/types";

/** Fields that meaningfully contribute to profile completion (weighted equally). */
const COMPLETION_FIELDS = [
  "first_name",
  "last_name",
  "professional_title",
  "phone",
  "location",
  "country",
  "linkedin_url",
  "portfolio_url",
  "github_url",
  "career_level",
  "industry",
  "years_of_experience",
  "employment_status",
] as const satisfies readonly (keyof Profile)[];

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  return true;
}

/** Returns 0–100 based on filled meaningful profile fields. */
export function calculateProfileCompletion(
  profile: Partial<Profile> | null | undefined,
): number {
  if (!profile) return 0;
  const filled = COMPLETION_FIELDS.filter((key) =>
    hasValue(profile[key]),
  ).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}
