"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileHeader } from "@/features/settings/components/profile-header";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { SelectSetting } from "@/features/settings/components/select-setting";
import { useSettingsSave } from "@/features/settings/hooks/use-settings-save";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/features/settings/schemas";
import type { SettingsProfile } from "@/features/settings/types";
import { useAuth, useProfile } from "@/features/auth/hooks/use-auth";
import { updateCurrentProfile } from "@/features/auth/lib/profile-actions";
import { authErrorMessage } from "@/lib/auth/errors";
import { calculateProfileCompletion } from "@/lib/auth/profile-completion";
import { createClient } from "@/lib/supabase/client";
import { mockCountries } from "@/mocks/onboarding";
import { MobileBottomBar } from "@/components/shared/mobile-bottom-bar";
import { Button } from "@/components/ui/button";
import type { CareerLevelId, IndustryId } from "@/features/settings/types";

const EMPTY_FORM: ProfileFormValues = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  country: "",
  linkedin: "",
  portfolio: "",
  github: "",
  website: "",
  careerLevel: "junior",
  industry: "technology",
  yearsExperience: 0,
  employmentStatus: "employed",
  careerGoals: "",
};

function careerLevelFromDb(value: string | null | undefined): CareerLevelId {
  if (value === "mid") return "mid-level";
  const allowed: CareerLevelId[] = [
    "student",
    "graduate",
    "junior",
    "mid-level",
    "senior",
    "executive",
  ];
  return allowed.includes(value as CareerLevelId)
    ? (value as CareerLevelId)
    : "junior";
}

function industryFromDb(value: string | null | undefined): IndustryId {
  const allowed: IndustryId[] = [
    "technology",
    "finance",
    "healthcare",
    "marketing",
    "design",
    "engineering",
  ];
  return allowed.includes(value as IndustryId)
    ? (value as IndustryId)
    : "technology";
}

export function ProfileSettingsView() {
  const formRef = useRef<HTMLFormElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { profile, completion, loading } = useProfile();
  const { saveStatus, scheduleSave, saveNow, failSave, retry, setSaveStatus } =
    useSettingsSave();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (loading || hydrated) return;
    if (!user) return;

    void (async () => {
      const supabase = createClient();
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("ai_flags")
        .eq("user_id", user.id)
        .maybeSingle();

      const flags =
        prefs?.ai_flags && typeof prefs.ai_flags === "object"
          ? (prefs.ai_flags as Record<string, unknown>)
          : {};
      const careerGoals =
        typeof flags.careerGoals === "string" ? flags.careerGoals : "";

      reset({
        firstName: profile?.first_name ?? "",
        lastName: profile?.last_name ?? "",
        title: profile?.professional_title ?? "",
        email: profile?.email ?? user.email ?? "",
        phone: profile?.phone ?? "",
        location: profile?.location ?? "",
        country: profile?.country ?? "",
        linkedin: profile?.linkedin_url ?? "",
        portfolio: profile?.portfolio_url ?? "",
        github: profile?.github_url ?? "",
        website: profile?.website_url ?? "",
        careerLevel: careerLevelFromDb(profile?.career_level),
        industry: industryFromDb(profile?.industry),
        yearsExperience: profile?.years_of_experience ?? 0,
        employmentStatus: profile?.employment_status ?? "employed",
        careerGoals,
      });
      setHydrated(true);
      setSaveStatus("saved");
    })();
  }, [loading, hydrated, user, profile, reset, setSaveStatus]);

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const title = watch("title");
  const location = watch("location");
  const careerLevel = watch("careerLevel");
  const country = watch("country");
  const industry = watch("industry");
  const employmentStatus = watch("employmentStatus");

  const liveCompletion = calculateProfileCompletion({
    first_name: firstName,
    last_name: lastName,
    professional_title: title,
    phone: watch("phone"),
    location,
    country,
    linkedin_url: watch("linkedin"),
    portfolio_url: watch("portfolio"),
    github_url: watch("github"),
    career_level: careerLevel,
    industry,
    years_of_experience: watch("yearsExperience"),
    employment_status: employmentStatus,
  });

  const headerProfile: SettingsProfile = {
    firstName: firstName || " ",
    lastName: lastName || " ",
    title: title || "Professional title",
    email: watch("email"),
    phone: watch("phone"),
    location: location || "Add location",
    country,
    linkedin: watch("linkedin"),
    portfolio: watch("portfolio"),
    github: watch("github"),
    website: watch("website"),
    photoUrl: profile?.photo_url ?? undefined,
    careerLevel,
    industry,
    yearsExperience: watch("yearsExperience") || 0,
    employmentStatus,
    careerGoals: watch("careerGoals"),
    profileCompletion: liveCompletion || completion,
  };

  async function persistProfile(values: ProfileFormValues) {
    if (!user) throw new Error("Not authenticated");

    await updateCurrentProfile({
      first_name: values.firstName,
      last_name: values.lastName,
      professional_title: values.title,
      email: values.email,
      phone: values.phone,
      location: values.location,
      country: values.country,
      linkedin_url: values.linkedin || null,
      portfolio_url: values.portfolio || null,
      github_url: values.github || null,
      website_url: values.website || null,
      career_level: values.careerLevel,
      industry: values.industry,
      years_of_experience: values.yearsExperience,
      employment_status: values.employmentStatus,
    });

    const supabase = createClient();
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("ai_flags")
      .eq("user_id", user.id)
      .maybeSingle();
    const existingFlags =
      prefs?.ai_flags && typeof prefs.ai_flags === "object"
        ? (prefs.ai_flags as Record<string, unknown>)
        : {};

    const { error } = await supabase.from("user_preferences").upsert(
      {
        user_id: user.id,
        ai_flags: {
          ...existingFlags,
          careerGoals: values.careerGoals,
        },
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    await refreshProfile();
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await saveNow(async () => {
        await persistProfile(values);
      });
    } catch (error) {
      failSave();
      toast.error(authErrorMessage(error, "Could not save your profile."));
    }
  });

  const markDirty = () => {
    scheduleSave(async () => {
      const values = getValues();
      const parsed = profileSchema.safeParse(values);
      if (!parsed.success) {
        setSaveStatus("unsaved");
        return;
      }
      await persistProfile(parsed.data);
    });
  };

  if (loading || !hydrated) {
    return (
      <div className="space-y-6 pb-mobile-bar lg:pb-0">
        <SettingsPageHeader
          title="Profile"
          description="Manage your professional identity so VitatePro can coach with context."
          saveStatus="saving"
        />
        <p className="text-sm text-ink-soft">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-mobile-bar lg:pb-0">
      <SettingsPageHeader
        title="Profile"
        description="Manage your professional identity so VitatePro can coach with context."
        saveStatus={saveStatus}
        onRetry={retry}
        onSave={() => formRef.current?.requestSubmit()}
      />

      {!profile?.photo_url ? (
        <EmptyState
          icon={ImageOff}
          title="No profile image"
          description="Photo storage ships in a later phase. Your avatar URL field is ready on the profile."
          actionLabel="Upload photo"
          onAction={() =>
            toast.message("Photo upload coming soon", {
              description:
                "Supabase Storage will handle avatars in a dedicated phase.",
            })
          }
          className="py-10"
        />
      ) : null}

      <ProfileHeader
        profile={headerProfile}
        onEdit={() =>
          document.getElementById("firstName")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
        onChangePhoto={() =>
          toast.message("Photo upload coming soon", {
            description:
              "Supabase Storage will handle avatars in a dedicated phase.",
          })
        }
      />

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="space-y-6"
        onChange={markDirty}
      >
        <SectionCard title="Profile information">
          <div className="grid gap-4 pb-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              <Input id="firstName" {...register("firstName")} />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <Input {...register("lastName")} />
            </Field>
            <Field
              label="Professional title"
              error={errors.title?.message}
              className="sm:col-span-2"
            >
              <Input {...register("title")} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <Input {...register("phone")} />
            </Field>
            <Field label="Location" error={errors.location?.message}>
              <Input {...register("location")} />
            </Field>
            <SelectSetting
              id="country"
              label="Country"
              value={country}
              onChange={(v) => {
                setValue("country", v, { shouldValidate: true });
                markDirty();
              }}
              options={mockCountries.map((c) => ({
                value: c.code,
                label: c.name,
              }))}
            />
            <Field label="LinkedIn URL" error={errors.linkedin?.message}>
              <Input
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/…"
              />
            </Field>
            <Field label="Portfolio URL" error={errors.portfolio?.message}>
              <Input {...register("portfolio")} />
            </Field>
            <Field label="GitHub URL" error={errors.github?.message}>
              <Input {...register("github")} />
            </Field>
            <Field label="Personal website" error={errors.website?.message}>
              <Input {...register("website")} />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="Career information">
          <div className="grid gap-4 pb-4 sm:grid-cols-2">
            <SelectSetting
              id="careerLevel"
              label="Career level"
              value={careerLevel}
              onChange={(v) => {
                setValue("careerLevel", v as ProfileFormValues["careerLevel"], {
                  shouldValidate: true,
                });
                markDirty();
              }}
              options={[
                { value: "student", label: "Student" },
                { value: "graduate", label: "Graduate" },
                { value: "junior", label: "Junior" },
                { value: "mid-level", label: "Mid-Level" },
                { value: "senior", label: "Senior" },
                { value: "executive", label: "Executive" },
              ]}
            />
            <SelectSetting
              id="industry"
              label="Industry"
              value={industry}
              onChange={(v) => {
                setValue("industry", v as ProfileFormValues["industry"], {
                  shouldValidate: true,
                });
                markDirty();
              }}
              options={[
                { value: "technology", label: "Technology" },
                { value: "finance", label: "Finance" },
                { value: "healthcare", label: "Healthcare" },
                { value: "marketing", label: "Marketing" },
                { value: "design", label: "Design" },
                { value: "engineering", label: "Engineering" },
              ]}
            />
            <Field
              label="Years of experience"
              error={errors.yearsExperience?.message}
            >
              <Input
                type="number"
                min={0}
                {...register("yearsExperience", { valueAsNumber: true })}
              />
            </Field>
            <SelectSetting
              id="employmentStatus"
              label="Employment status"
              value={employmentStatus}
              onChange={(v) => {
                setValue("employmentStatus", v, { shouldValidate: true });
                markDirty();
              }}
              options={[
                { value: "employed", label: "Employed" },
                { value: "open", label: "Open to work" },
                { value: "seeking", label: "Seeking opportunities" },
                { value: "freelance", label: "Freelance" },
                { value: "student", label: "Student" },
                { value: "between", label: "Between roles" },
              ]}
            />
            <Field
              label="Career goals"
              error={errors.careerGoals?.message}
              className="sm:col-span-2"
            >
              <Textarea rows={4} {...register("careerGoals")} />
            </Field>
          </div>
        </SectionCard>

        <MobileBottomBar>
          <Button type="submit" shape="soft" className="w-full rounded-[8px]">
            Save profile
          </Button>
        </MobileBottomBar>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5">{label}</Label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
