"use client";

import { useRef } from "react";
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
import { mockSettingsProfile } from "@/mocks/settings";
import { mockCountries } from "@/mocks/onboarding";
import { Button } from "@/components/ui/button";

export function ProfileSettingsView() {
  const formRef = useRef<HTMLFormElement>(null);
  const { saveStatus, scheduleSave, saveNow, retry } = useSettingsSave();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: mockSettingsProfile.firstName,
      lastName: mockSettingsProfile.lastName,
      title: mockSettingsProfile.title,
      email: mockSettingsProfile.email,
      phone: mockSettingsProfile.phone,
      location: mockSettingsProfile.location,
      country: mockSettingsProfile.country,
      linkedin: mockSettingsProfile.linkedin,
      portfolio: mockSettingsProfile.portfolio,
      github: mockSettingsProfile.github,
      website: mockSettingsProfile.website,
      careerLevel: mockSettingsProfile.careerLevel,
      industry: mockSettingsProfile.industry,
      yearsExperience: mockSettingsProfile.yearsExperience,
      employmentStatus: mockSettingsProfile.employmentStatus,
      careerGoals: mockSettingsProfile.careerGoals,
    },
  });

  const values = watch();
  const headerProfile = {
    ...mockSettingsProfile,
    ...values,
    profileCompletion: mockSettingsProfile.profileCompletion,
  };

  const onSubmit = handleSubmit(() => {
    void saveNow();
  });

  const markDirty = () => scheduleSave();

  return (
    <div className="space-y-6 pb-16">
      <SettingsPageHeader
        title="Profile"
        description="Manage your professional identity so VitatePro can coach with context."
        saveStatus={saveStatus}
        onRetry={retry}
        onSave={() => formRef.current?.requestSubmit()}
      />

      {!mockSettingsProfile.photoUrl ? (
        <EmptyState
          icon={ImageOff}
          title="No profile image"
          description="A photo helps personalize previews and shareable letters."
          actionLabel="Upload photo"
          onAction={() => toast.message("Photo upload (UI only)")}
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
        onChangePhoto={() => toast.message("Photo upload (UI only)")}
      />

      <form ref={formRef} onSubmit={onSubmit} className="space-y-6" onChange={markDirty}>
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
              value={values.country}
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
              <Input {...register("linkedin")} placeholder="https://linkedin.com/in/…" />
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
              value={values.careerLevel}
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
              value={values.industry}
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
              value={values.employmentStatus}
              onChange={(v) => {
                setValue("employmentStatus", v, { shouldValidate: true });
                markDirty();
              }}
              options={[
                { value: "employed", label: "Employed" },
                { value: "open", label: "Open to work" },
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

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
          <Button type="submit" shape="soft" className="w-full rounded-[8px]">
            Save profile
          </Button>
        </div>
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
