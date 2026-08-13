import type { Profile } from "@/lib/database/types";
import { calculateProfileCompletion } from "@/lib/auth/profile-completion";
import { createClient } from "@/lib/supabase/client";
import type { OnboardingValues } from "@/features/onboarding/schemas/onboarding";

export type ProfileUpdateInput = {
  first_name?: string | null;
  last_name?: string | null;
  professional_title?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  country?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
  website_url?: string | null;
  career_level?: string | null;
  industry?: string | null;
  years_of_experience?: number | null;
  employment_status?: string | null;
  preferred_language?: string | null;
  onboarding_completed?: boolean;
};

export async function updateCurrentProfile(
  patch: ProfileUpdateInput,
): Promise<Profile> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const merged = { ...(existing ?? {}), ...patch } as Profile;
  const profile_completion = calculateProfileCompletion(merged);

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...patch, profile_completion })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function persistOnboardingProgress(
  values: Partial<OnboardingValues>,
  options?: { complete?: boolean },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const careerLevel =
    values.experienceLevel === "mid"
      ? "mid-level"
      : values.experienceLevel ?? undefined;

  await updateCurrentProfile({
    first_name: values.firstName ?? undefined,
    last_name: values.lastName ?? undefined,
    professional_title: values.profession ?? undefined,
    country: values.country ?? undefined,
    years_of_experience: values.yearsExperience ?? undefined,
    employment_status: values.employmentStatus ?? undefined,
    preferred_language: values.preferredLanguage ?? undefined,
    career_level: careerLevel,
    onboarding_completed: options?.complete ?? false,
  });

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("ai_flags")
    .eq("user_id", user.id)
    .maybeSingle();

  const existingFlags =
    prefs?.ai_flags && typeof prefs.ai_flags === "object"
      ? (prefs.ai_flags as Record<string, unknown>)
      : {};

  const ai_flags = {
    ...existingFlags,
    improveGrammar: values.improveGrammar,
    suggestAchievements: values.suggestAchievements,
    generateSummaries: values.generateSummaries,
    rewriteProfessionally: values.rewriteProfessionally,
    improveReadability: values.improveReadability,
    createCoverLetters: values.createCoverLetters,
    onboardingGoals: values.goals,
  };

  const { error: prefError } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      theme: values.theme ?? "system",
      ai_flags,
    },
    { onConflict: "user_id" },
  );
  if (prefError) throw prefError;
}
