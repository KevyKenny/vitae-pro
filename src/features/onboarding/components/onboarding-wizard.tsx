"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  BriefcaseBusiness,
  Crown,
  Rocket,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IllustrationContainer,
  SuccessAnimation,
} from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { persistOnboardingProgress } from "@/features/auth/lib/profile-actions";
import {
  CountrySelector,
  FeatureCard,
  MultiSelectCard,
  PreferenceToggle,
  ProgressStepper,
} from "@/features/onboarding/components";
import type {
  AiPreferencesValues,
  OnboardingValues,
} from "@/features/onboarding/schemas/onboarding";
import {
  mockAiPreferences,
  mockCareerGoals,
  mockEmploymentStatuses,
  mockExperienceLevels,
  mockLanguages,
} from "@/mocks/onboarding";
import { cn } from "@/lib/utils";
import { authErrorMessage } from "@/lib/auth/errors";

const STEPS = [
  "Welcome",
  "About you",
  "Goals",
  "Experience",
  "AI prefs",
  "Theme",
  "Done",
] as const;

const defaultAi: AiPreferencesValues = {
  improveGrammar: true,
  suggestAchievements: true,
  generateSummaries: true,
  rewriteProfessionally: false,
  improveReadability: true,
  createCoverLetters: true,
};

const experienceIcons = {
  student: GraduationCap,
  graduate: UserRound,
  junior: Rocket,
  mid: BriefcaseBusiness,
  senior: Sparkles,
  executive: Crown,
} as const;

type DraftState = Partial<OnboardingValues>;

const defaultDraft: DraftState = {
  yearsExperience: 3,
  employmentStatus: "seeking",
  preferredLanguage: "en",
  goals: [],
  experienceLevel: "mid",
  theme: "light",
  ...defaultAi,
};

export function OnboardingWizard() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DraftState>(defaultDraft);

  useEffect(() => {
    if (authLoading || hydrated) return;
    if (!user) {
      router.replace("/auth/sign-in");
      return;
    }
    if (profile?.onboarding_completed) {
      router.replace("/dashboard");
      return;
    }

    const experienceLevel =
      profile?.career_level === "mid-level"
        ? "mid"
        : ((profile?.career_level as DraftState["experienceLevel"]) ?? "mid");

    const nextDraft: DraftState = {
      ...defaultDraft,
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      profession: profile?.professional_title ?? "",
      yearsExperience: profile?.years_of_experience ?? 3,
      employmentStatus:
        (profile?.employment_status as DraftState["employmentStatus"]) ??
        "seeking",
      country: profile?.country ?? "",
      preferredLanguage: profile?.preferred_language ?? "en",
      experienceLevel,
    };

    // Defer so React Compiler / lint does not treat this as cascading render sync.
    const id = window.setTimeout(() => {
      setData(nextDraft);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [authLoading, hydrated, user, profile, router]);

  function update<K extends keyof OnboardingValues>(
    key: K,
    value: OnboardingValues[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveForLater() {
    setSaving(true);
    try {
      await persistOnboardingProgress(data, { complete: false });
      await refreshProfile();
      toast.success("Progress saved", {
        description: "You can return to onboarding anytime.",
      });
    } catch (error) {
      toast.error(authErrorMessage(error, "Could not save progress."));
    } finally {
      setSaving(false);
    }
  }

  function canContinue(): boolean {
    switch (step) {
      case 0:
        return true;
      case 1:
        return Boolean(
          data.firstName?.trim() &&
            data.lastName?.trim() &&
            data.profession?.trim() &&
            data.country &&
            data.employmentStatus &&
            data.preferredLanguage,
        );
      case 2:
        return (data.goals?.length ?? 0) > 0;
      case 3:
        return Boolean(data.experienceLevel);
      case 4:
        return true;
      case 5:
        return Boolean(data.theme);
      default:
        return true;
    }
  }

  function next() {
    if (!canContinue()) {
      toast.error("Please complete this step to continue.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function previous() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function finish() {
    try {
      setCompleting(true);
      await persistOnboardingProgress(data, { complete: true });
      await refreshProfile();
      router.push("/cvs/new");
      router.refresh();
    } catch (error) {
      toast.error(authErrorMessage(error, "Could not finish onboarding."));
      setCompleting(false);
    }
  }

  function toggleGoal(id: NonNullable<OnboardingValues["goals"]>[number]) {
    const current = data.goals ?? [];
    const nextGoals = current.includes(id)
      ? current.filter((g) => g !== id)
      : [...current, id];
    update("goals", nextGoals);
  }

  const themePreviewClass = useMemo(() => {
    if (data.theme === "dark") return "bg-ink text-paper";
    if (data.theme === "system")
      return "bg-gradient-to-br from-paper via-surface to-ink/90 text-ink";
    return "bg-paper text-ink";
  }, [data.theme]);

  if (authLoading || !hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper">
        <p className="text-sm text-ink-soft">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Logo href="/" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveForLater}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save & continue later"}
            </Button>
          ) : null}
        </div>
      </div>

      {step < STEPS.length - 1 ? (
        <ProgressStepper
          steps={[...STEPS]}
          currentStep={step}
          className="mb-10"
        />
      ) : null}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div className="flex flex-col items-center text-center">
                <IllustrationContainer tone="emerald" className="mb-8">
                  <Sparkles className="size-14 text-emerald" aria-hidden />
                </IllustrationContainer>
                <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                  Welcome to VitatePro
                </h1>
                <p className="mt-4 max-w-lg text-ink-soft">
                  In a few short steps we&apos;ll personalize your coach —
                  so suggestions, templates, and tone match how you work.
                </p>
                <Button
                  type="button"
                  shape="soft"
                  size="lg"
                  className="mt-8 rounded-[8px]"
                  onClick={next}
                >
                  Get started
                </Button>
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink">
                  Tell us about yourself
                </h1>
                <p className="mt-2 text-ink-soft">
                  This helps VitatePro tailor language and examples for your role.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={data.firstName ?? ""}
                      onChange={(e) => update("firstName", e.target.value)}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={data.lastName ?? ""}
                      onChange={(e) => update("lastName", e.target.value)}
                      autoComplete="family-name"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={data.profession ?? ""}
                      onChange={(e) => update("profession", e.target.value)}
                      placeholder="e.g. Product Designer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Years of experience</Label>
                    <Input
                      id="years"
                      type="number"
                      min={0}
                      max={50}
                      value={data.yearsExperience ?? 0}
                      onChange={(e) =>
                        update("yearsExperience", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employment status</Label>
                    <Select
                      value={data.employmentStatus}
                      onValueChange={(v) =>
                        update(
                          "employmentStatus",
                          v as OnboardingValues["employmentStatus"],
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockEmploymentStatuses.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <CountrySelector
                      value={data.country}
                      onValueChange={(v) => update("country", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred language</Label>
                    <Select
                      value={data.preferredLanguage}
                      onValueChange={(v) => update("preferredLanguage", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink">
                  Career goals
                </h1>
                <p className="mt-2 text-ink-soft">
                  Choose everything that matters right now. You can change these
                  later.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {mockCareerGoals.map((goal) => (
                    <MultiSelectCard
                      key={goal.id}
                      title={goal.title}
                      description={goal.description}
                      selected={data.goals?.includes(goal.id)}
                      onToggle={() => toggleGoal(goal.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink">
                  Experience level
                </h1>
                <p className="mt-2 text-ink-soft">
                  We’ll tune examples and seniority language to match.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {mockExperienceLevels.map((level) => {
                    const Icon = experienceIcons[level.id];
                    return (
                      <FeatureCard
                        key={level.id}
                        title={level.title}
                        description={level.description}
                        selected={data.experienceLevel === level.id}
                        onSelect={() => update("experienceLevel", level.id)}
                        icon={<Icon className="size-5" />}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink">
                  AI preferences
                </h1>
                <p className="mt-2 text-ink-soft">
                  Pick how assertive your coach should be while you write.
                </p>
                <div className="mt-8 space-y-3">
                  {mockAiPreferences.map((pref) => (
                    <PreferenceToggle
                      key={pref.key}
                      id={pref.key}
                      title={pref.title}
                      description={pref.description}
                      checked={Boolean(data[pref.key])}
                      onCheckedChange={(checked) => update(pref.key, checked)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink">
                  Theme preference
                </h1>
                <p className="mt-2 text-ink-soft">
                  Preview how VitatePro feels. Theme switching ships fully in a
                  later phase — your choice is saved.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      { id: "light", title: "Light", description: "Warm paper UI" },
                      { id: "dark", title: "Dark", description: "Ink-forward focus" },
                      {
                        id: "system",
                        title: "System",
                        description: "Match device setting",
                      },
                    ] as const
                  ).map((theme) => (
                    <FeatureCard
                      key={theme.id}
                      title={theme.title}
                      description={theme.description}
                      selected={data.theme === theme.id}
                      onSelect={() => update("theme", theme.id)}
                    />
                  ))}
                </div>
                <motion.div
                  key={data.theme}
                  initial={{ opacity: 0.4, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "mt-6 overflow-hidden rounded-[22px] border border-line p-6 shadow-m",
                    themePreviewClass,
                  )}
                >
                  <p className="font-serif text-xl">Senior Product Designer</p>
                  <p className="mt-2 text-sm opacity-70">
                    Live theme preview — score 92 · Meridian template
                  </p>
                  <div className="mt-5 space-y-2">
                    <div className="h-2 w-4/5 rounded bg-current/15" />
                    <div className="h-2 w-3/5 rounded bg-current/15" />
                    <div className="h-2 w-2/3 rounded bg-emerald/40" />
                  </div>
                </motion.div>
              </div>
            )}

            {step === 6 && (
              <div className="flex flex-col items-center text-center">
                <IllustrationContainer tone="gold" className="mb-8">
                  <SuccessAnimation />
                </IllustrationContainer>
                <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                  You&apos;re all set, {data.firstName || "friend"}
                </h1>
                <p className="mt-4 max-w-md text-ink-soft">
                  Your workspace is personalized. Let&apos;s create your first
                  professional CV — guided steps make it easy.
                </p>
                <Button
                  type="button"
                  shape="soft"
                  size="lg"
                  className="mt-8 rounded-[8px]"
                  disabled={completing}
                  onClick={finish}
                >
                  {completing ? "Opening…" : "Create my CV"}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step > 0 && step < STEPS.length - 1 ? (
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
          <Button type="button" variant="outline" shape="soft" onClick={previous}>
            Previous
          </Button>
          <Button
            type="button"
            shape="soft"
            onClick={next}
            disabled={!canContinue()}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
