"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AchievementEditor } from "@/features/cv-editor/components/experience/achievement-editor";
import { SkillsTagSelector } from "@/features/cv-editor/components/experience/skills-tag-selector";
import { MonthYearFields } from "@/features/cv-editor/components/experience/month-year-fields";
import { SupervisorFields } from "@/features/cv-editor/components/experience/supervisor-fields";
import {
  DURATION_OPTIONS,
  type ExperienceFieldErrors,
} from "@/features/cv-editor/components/experience/experience-helpers";
import type {
  AttachmentExperience,
  EmploymentExperience,
  FreelanceExperience,
  GraduateTraineeExperience,
  VolunteerExperience,
} from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[0.72rem] text-destructive">{message}</p>;
}

function DateModeToggle({
  mode,
  onChange,
  currentLabel,
  current,
  onCurrentChange,
}: {
  mode: "range" | "duration";
  onChange: (mode: "range" | "duration") => void;
  currentLabel?: string;
  current?: boolean;
  onCurrentChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex gap-2" role="group" aria-label="Date entry mode">
        <button
          type="button"
          className={cn(
            "rounded-full px-3 py-1.5 text-[0.78rem] font-semibold",
            mode === "range"
              ? "bg-emerald text-paper"
              : "bg-paper-dim text-ink-soft",
          )}
          onClick={() => onChange("range")}
        >
          Start & end dates
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full px-3 py-1.5 text-[0.78rem] font-semibold",
            mode === "duration"
              ? "bg-emerald text-paper"
              : "bg-paper-dim text-ink-soft",
          )}
          onClick={() => onChange("duration")}
        >
          Duration only
        </button>
      </div>
      {currentLabel && onCurrentChange ? (
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <Checkbox
            checked={Boolean(current)}
            onCheckedChange={(v) => onCurrentChange(Boolean(v))}
          />
          {currentLabel}
        </label>
      ) : null}
    </div>
  );
}

export function IndustrialAttachmentForm({
  entry,
  onChange,
  errors,
}: {
  entry: AttachmentExperience;
  onChange: (next: AttachmentExperience) => void;
  errors: ExperienceFieldErrors;
}) {
  const isInternship = entry.experienceType === "internship";
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["company", "Company name"],
            ["department", "Department"],
            [
              "role",
              isInternship ? "Internship role" : "Position / attachment role",
            ],
            ["location", "Location"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              {label}
            </Label>
            <Input
              value={entry[key]}
              onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
              aria-invalid={errors[key] ? true : undefined}
              className={cn("bg-surface", errors[key] && "border-destructive")}
            />
            <FieldError message={errors[key]} />
          </div>
        ))}
      </div>

      <DateModeToggle
        mode={entry.dateMode}
        onChange={(dateMode) => onChange({ ...entry, dateMode })}
        currentLabel={
          isInternship
            ? "I am currently on this internship"
            : "I am currently on attachment"
        }
        current={entry.current}
        onCurrentChange={(current) => onChange({ ...entry, current })}
      />

      {entry.dateMode === "range" ? (
        <MonthYearFields
          startMonth={entry.startMonth}
          startYear={entry.startYear}
          endMonth={entry.endMonth}
          endYear={entry.endYear}
          current={entry.current}
          onChange={(patch) => onChange({ ...entry, ...patch })}
          errors={errors}
        />
      ) : (
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Duration
          </Label>
          <Select
            value={entry.duration || undefined}
            onValueChange={(duration) => onChange({ ...entry, duration })}
          >
            <SelectTrigger
              className={cn("bg-surface", errors.duration && "border-destructive")}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.duration} />
        </div>
      )}

      <AchievementEditor
        label="Responsibilities"
        items={entry.responsibilities}
        onChange={(responsibilities) =>
          onChange({ ...entry, responsibilities })
        }
        experienceType={entry.experienceType}
      />
      <SkillsTagSelector
        value={entry.skillsGained}
        onChange={(skillsGained) => onChange({ ...entry, skillsGained })}
      />
      <AchievementEditor
        label="Achievements"
        items={entry.achievements}
        onChange={(achievements) => onChange({ ...entry, achievements })}
        experienceType={entry.experienceType}
        showAi={false}
      />
      <SupervisorFields
        supervisor={entry.supervisor}
        includeOnExport={entry.includeSupervisorOnExport}
        onChange={(supervisor) => onChange({ ...entry, supervisor })}
        onIncludeChange={(includeSupervisorOnExport) =>
          onChange({ ...entry, includeSupervisorOnExport })
        }
      />
    </div>
  );
}

export const InternshipForm = IndustrialAttachmentForm;

export function GraduateTraineeForm({
  entry,
  onChange,
  errors,
}: {
  entry: GraduateTraineeExperience;
  onChange: (next: GraduateTraineeExperience) => void;
  errors: ExperienceFieldErrors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["programmeName", "Programme name"],
            ["company", "Company"],
            ["department", "Department"],
            ["location", "Location"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              {label}
            </Label>
            <Input
              value={entry[key]}
              onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
              aria-invalid={errors[key] ? true : undefined}
              className={cn("bg-surface", errors[key] && "border-destructive")}
            />
            <FieldError message={errors[key]} />
          </div>
        ))}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Rotation details (optional)
          </Label>
          <Textarea
            rows={2}
            value={entry.rotationDetails}
            onChange={(e) =>
              onChange({ ...entry, rotationDetails: e.target.value })
            }
            className="bg-surface"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <Checkbox
          checked={entry.current}
          onCheckedChange={(v) => onChange({ ...entry, current: Boolean(v) })}
        />
        I am currently on this programme
      </label>
      <MonthYearFields
        startMonth={entry.startMonth}
        startYear={entry.startYear}
        endMonth={entry.endMonth}
        endYear={entry.endYear}
        current={entry.current}
        onChange={(patch) => onChange({ ...entry, ...patch })}
        errors={errors}
      />
      <AchievementEditor
        label="Responsibilities"
        items={entry.responsibilities}
        onChange={(responsibilities) =>
          onChange({ ...entry, responsibilities })
        }
        experienceType={entry.experienceType}
      />
      <SkillsTagSelector
        value={entry.skillsGained}
        onChange={(skillsGained) => onChange({ ...entry, skillsGained })}
      />
      <AchievementEditor
        label="Achievements"
        items={entry.achievements}
        onChange={(achievements) => onChange({ ...entry, achievements })}
        experienceType={entry.experienceType}
        showAi={false}
      />
    </div>
  );
}

export function VolunteerForm({
  entry,
  onChange,
  errors,
}: {
  entry: VolunteerExperience;
  onChange: (next: VolunteerExperience) => void;
  errors: ExperienceFieldErrors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["organization", "Organization"],
            ["role", "Role"],
            ["cause", "Cause"],
            ["location", "Location"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              {label}
            </Label>
            <Input
              value={entry[key]}
              onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
              aria-invalid={errors[key] ? true : undefined}
              className={cn("bg-surface", errors[key] && "border-destructive")}
            />
            <FieldError message={errors[key]} />
          </div>
        ))}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Impact
          </Label>
          <Textarea
            rows={2}
            value={entry.impact}
            onChange={(e) => onChange({ ...entry, impact: e.target.value })}
            className="bg-surface"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <Checkbox
          checked={entry.current}
          onCheckedChange={(v) => onChange({ ...entry, current: Boolean(v) })}
        />
        I currently volunteer here
      </label>
      <MonthYearFields
        startMonth={entry.startMonth}
        startYear={entry.startYear}
        endMonth={entry.endMonth}
        endYear={entry.endYear}
        current={entry.current}
        onChange={(patch) => onChange({ ...entry, ...patch })}
        errors={errors}
      />
      <AchievementEditor
        label="Responsibilities"
        items={entry.responsibilities}
        onChange={(responsibilities) =>
          onChange({ ...entry, responsibilities })
        }
        experienceType={entry.experienceType}
      />
      <AchievementEditor
        label="Achievements"
        items={entry.achievements}
        onChange={(achievements) => onChange({ ...entry, achievements })}
        experienceType={entry.experienceType}
        showAi={false}
      />
    </div>
  );
}

export function FreelanceForm({
  entry,
  onChange,
  errors,
}: {
  entry: FreelanceExperience;
  onChange: (next: FreelanceExperience) => void;
  errors: ExperienceFieldErrors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Client name (optional)
          </Label>
          <Input
            value={entry.clientName}
            onChange={(e) => onChange({ ...entry, clientName: e.target.value })}
            className="bg-surface"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Project name
          </Label>
          <Input
            value={entry.projectName}
            onChange={(e) =>
              onChange({ ...entry, projectName: e.target.value })
            }
            aria-invalid={errors.projectName ? true : undefined}
            className={cn(
              "bg-surface",
              errors.projectName && "border-destructive",
            )}
          />
          <FieldError message={errors.projectName} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Portfolio link
          </Label>
          <Input
            value={entry.portfolioLink}
            onChange={(e) =>
              onChange({ ...entry, portfolioLink: e.target.value })
            }
            className="bg-surface"
            placeholder="https://"
          />
        </div>
      </div>
      <DateModeToggle
        mode={entry.dateMode}
        onChange={(dateMode) => onChange({ ...entry, dateMode })}
      />
      {entry.dateMode === "range" ? (
        <MonthYearFields
          startMonth={entry.startMonth}
          startYear={entry.startYear}
          endMonth={entry.endMonth}
          endYear={entry.endYear}
          onChange={(patch) => onChange({ ...entry, ...patch })}
          errors={errors}
        />
      ) : (
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Duration
          </Label>
          <Select
            value={entry.duration || undefined}
            onValueChange={(duration) => onChange({ ...entry, duration })}
          >
            <SelectTrigger
              className={cn("bg-surface", errors.duration && "border-destructive")}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.duration} />
        </div>
      )}
      <SkillsTagSelector
        label="Technologies"
        value={entry.technologies}
        onChange={(technologies) => onChange({ ...entry, technologies })}
      />
      <AchievementEditor
        label="Achievements"
        items={entry.achievements}
        onChange={(achievements) => onChange({ ...entry, achievements })}
        experienceType={entry.experienceType}
      />
    </div>
  );
}

export function EmploymentForm({
  entry,
  onChange,
  errors,
}: {
  entry: EmploymentExperience;
  onChange: (next: EmploymentExperience) => void;
  errors: ExperienceFieldErrors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["company", "Company"],
            ["position", "Position"],
            ["location", "Location"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              {label}
            </Label>
            <Input
              value={entry[key]}
              onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
              aria-invalid={errors[key] ? true : undefined}
              className={cn("bg-surface", errors[key] && "border-destructive")}
            />
            <FieldError message={errors[key]} />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <Checkbox
          checked={entry.current}
          onCheckedChange={(v) => onChange({ ...entry, current: Boolean(v) })}
        />
        I currently work here
      </label>
      <MonthYearFields
        startMonth={entry.startMonth}
        startYear={entry.startYear}
        endMonth={entry.endMonth}
        endYear={entry.endYear}
        current={entry.current}
        onChange={(patch) => onChange({ ...entry, ...patch })}
        errors={errors}
      />
      <AchievementEditor
        label="Responsibilities"
        items={entry.responsibilities}
        onChange={(responsibilities) =>
          onChange({ ...entry, responsibilities })
        }
        experienceType={entry.experienceType}
      />
      <SkillsTagSelector
        value={entry.skillsGained}
        onChange={(skillsGained) => onChange({ ...entry, skillsGained })}
      />
      <AchievementEditor
        label="Achievements"
        items={entry.achievements}
        onChange={(achievements) => onChange({ ...entry, achievements })}
        experienceType={entry.experienceType}
        showAi={false}
      />
    </div>
  );
}
