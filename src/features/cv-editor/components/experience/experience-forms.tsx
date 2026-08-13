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
import { EducationDateRangeFields } from "@/features/cv-editor/components/education/education-date-fields";
import { ExperienceDescriptionEditor } from "@/features/cv-editor/components/experience/experience-description-editor";
import { SkillsTagSelector } from "@/features/cv-editor/components/experience/skills-tag-selector";
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

const fieldInputClass =
  "h-10 border-0 bg-paper-dim shadow-none focus-visible:border-[#7c3aed] focus-visible:shadow-none";

function FieldLabel({
  htmlFor,
  label,
}: {
  htmlFor?: string;
  label: string;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-[0.82rem] font-medium text-ink-soft">
      {label}
    </Label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[0.72rem] text-destructive">{message}</p>;
}

function DateModeToggle({
  mode,
  onChange,
}: {
  mode: "range" | "duration";
  onChange: (mode: "range" | "duration") => void;
}) {
  return (
    <div className="flex gap-2" role="group" aria-label="Date entry mode">
      <button
        type="button"
        className={cn(
          "rounded-md px-3 py-1.5 text-[0.78rem] font-medium",
          mode === "range"
            ? "bg-[#7c3aed] text-white"
            : "border border-line bg-surface text-ink-soft",
        )}
        onClick={() => onChange("range")}
      >
        Start & end dates
      </button>
      <button
        type="button"
        className={cn(
          "rounded-md px-3 py-1.5 text-[0.78rem] font-medium",
          mode === "duration"
            ? "bg-[#7c3aed] text-white"
            : "border border-line bg-surface text-ink-soft",
        )}
        onClick={() => onChange("duration")}
      >
        Duration only
      </button>
    </div>
  );
}

function DurationField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (duration: string) => void;
  error?: string;
}) {
  const isPreset = (DURATION_OPTIONS as readonly string[]).includes(value);
  const selectValue = isPreset ? value : value ? "custom" : undefined;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <FieldLabel label="Duration" />
        <Select
          value={selectValue}
          onValueChange={(next) => {
            if (next === "custom") {
              onChange(isPreset || !value ? "" : value);
              return;
            }
            onChange(next);
          }}
        >
          <SelectTrigger
            className={cn(fieldInputClass, error && "border-destructive")}
            aria-invalid={error ? true : undefined}
          >
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((duration) => (
              <SelectItem key={duration} value={duration}>
                {duration}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom duration</SelectItem>
          </SelectContent>
        </Select>
        <FieldError message={error} />
      </div>
      {!isPreset ? (
        <div className="space-y-1.5">
          <FieldLabel label="Custom duration" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. 8 months"
            className={fieldInputClass}
          />
        </div>
      ) : null}
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
  const hasAchievements = entry.achievements.some((item) => item.trim());

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor={`position-${entry.id}`} label="Position" />
        <Input
          id={`position-${entry.id}`}
          value={entry.position}
          onChange={(e) => onChange({ ...entry, position: e.target.value })}
          aria-invalid={errors.position ? true : undefined}
          className={cn(fieldInputClass, errors.position && "border-destructive")}
          placeholder="e.g. Software Developer Intern"
        />
        <FieldError message={errors.position} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <FieldLabel htmlFor={`employer-${entry.id}`} label="Employer" />
          <Input
            id={`employer-${entry.id}`}
            value={entry.company}
            onChange={(e) => onChange({ ...entry, company: e.target.value })}
            aria-invalid={errors.company ? true : undefined}
            className={cn(fieldInputClass, errors.company && "border-destructive")}
          />
          <FieldError message={errors.company} />
        </div>
        <div>
          <FieldLabel htmlFor={`city-${entry.id}`} label="City" />
          <Input
            id={`city-${entry.id}`}
            value={entry.location}
            onChange={(e) => onChange({ ...entry, location: e.target.value })}
            className={fieldInputClass}
          />
        </div>
      </div>

      <EducationDateRangeFields
        startMonth={entry.startMonth}
        startYear={entry.startYear}
        endMonth={entry.endMonth}
        endYear={entry.endYear}
        current={entry.current}
        onChange={(patch) => onChange({ ...entry, ...patch })}
        errors={errors}
      />

      <div>
        <FieldLabel label="Description" />
        <ExperienceDescriptionEditor
          items={entry.responsibilities}
          onChange={(responsibilities) =>
            onChange({ ...entry, responsibilities })
          }
          experienceId={entry.id}
          jobTitle={entry.position}
          company={entry.company}
          field="responsibilities"
        />
      </div>

      {hasAchievements ? (
        <div>
          <FieldLabel label="Achievements (optional)" />
          <ExperienceDescriptionEditor
            items={entry.achievements}
            onChange={(achievements) => onChange({ ...entry, achievements })}
            experienceId={entry.id}
            jobTitle={entry.position}
            company={entry.company}
            field="achievements"
          />
        </div>
      ) : (
        <button
          type="button"
          className="text-[0.82rem] font-medium text-ink-soft underline-offset-2 hover:text-ink hover:underline"
          onClick={() => onChange({ ...entry, achievements: [""] })}
        >
          + Add achievements
        </button>
      )}
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
      <div>
        <FieldLabel
          htmlFor={`role-${entry.id}`}
          label={isInternship ? "Internship role" : "Position"}
        />
        <Input
          id={`role-${entry.id}`}
          value={entry.role}
          onChange={(e) => onChange({ ...entry, role: e.target.value })}
          aria-invalid={errors.role ? true : undefined}
          className={cn(fieldInputClass, errors.role && "border-destructive")}
        />
        <FieldError message={errors.role} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <FieldLabel htmlFor={`company-${entry.id}`} label="Employer" />
          <Input
            id={`company-${entry.id}`}
            value={entry.company}
            onChange={(e) => onChange({ ...entry, company: e.target.value })}
            aria-invalid={errors.company ? true : undefined}
            className={cn(fieldInputClass, errors.company && "border-destructive")}
          />
          <FieldError message={errors.company} />
        </div>
        <div>
          <FieldLabel htmlFor={`city-${entry.id}`} label="City" />
          <Input
            id={`city-${entry.id}`}
            value={entry.location}
            onChange={(e) => onChange({ ...entry, location: e.target.value })}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={`department-${entry.id}`} label="Department (optional)" />
        <Input
          id={`department-${entry.id}`}
          value={entry.department}
          onChange={(e) => onChange({ ...entry, department: e.target.value })}
          className={fieldInputClass}
        />
      </div>

      <DateModeToggle
        mode={entry.dateMode}
        onChange={(dateMode) => onChange({ ...entry, dateMode })}
      />

      {entry.dateMode === "range" ? (
        <EducationDateRangeFields
          startMonth={entry.startMonth}
          startYear={entry.startYear}
          endMonth={entry.endMonth}
          endYear={entry.endYear}
          current={entry.current}
          onChange={(patch) => onChange({ ...entry, ...patch })}
          errors={errors}
        />
      ) : (
        <DurationField
          value={entry.duration}
          onChange={(duration) => onChange({ ...entry, duration })}
          error={errors.duration}
        />
      )}

      <div>
        <FieldLabel label="Description" />
        <ExperienceDescriptionEditor
          items={entry.responsibilities}
          onChange={(responsibilities) =>
            onChange({ ...entry, responsibilities })
          }
          experienceId={entry.id}
          jobTitle={entry.role}
          company={entry.company}
        />
      </div>

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
      <div>
        <FieldLabel htmlFor={`programme-${entry.id}`} label="Programme name" />
        <Input
          id={`programme-${entry.id}`}
          value={entry.programmeName}
          onChange={(e) => onChange({ ...entry, programmeName: e.target.value })}
          aria-invalid={errors.programmeName ? true : undefined}
          className={cn(
            fieldInputClass,
            errors.programmeName && "border-destructive",
          )}
        />
        <FieldError message={errors.programmeName} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <FieldLabel htmlFor={`company-${entry.id}`} label="Employer" />
          <Input
            id={`company-${entry.id}`}
            value={entry.company}
            onChange={(e) => onChange({ ...entry, company: e.target.value })}
            aria-invalid={errors.company ? true : undefined}
            className={cn(fieldInputClass, errors.company && "border-destructive")}
          />
          <FieldError message={errors.company} />
        </div>
        <div>
          <FieldLabel htmlFor={`city-${entry.id}`} label="City" />
          <Input
            id={`city-${entry.id}`}
            value={entry.location}
            onChange={(e) => onChange({ ...entry, location: e.target.value })}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={`department-${entry.id}`} label="Department (optional)" />
        <Input
          id={`department-${entry.id}`}
          value={entry.department}
          onChange={(e) => onChange({ ...entry, department: e.target.value })}
          className={fieldInputClass}
        />
      </div>

      <div>
        <FieldLabel label="Rotation details (optional)" />
        <Textarea
          rows={2}
          value={entry.rotationDetails}
          onChange={(e) =>
            onChange({ ...entry, rotationDetails: e.target.value })
          }
          className={cn(fieldInputClass, "min-h-[72px] py-2")}
        />
      </div>

      <EducationDateRangeFields
        startMonth={entry.startMonth}
        startYear={entry.startYear}
        endMonth={entry.endMonth}
        endYear={entry.endYear}
        current={entry.current}
        onChange={(patch) => onChange({ ...entry, ...patch })}
        errors={errors}
      />

      <div>
        <FieldLabel label="Description" />
        <ExperienceDescriptionEditor
          items={entry.responsibilities}
          onChange={(responsibilities) =>
            onChange({ ...entry, responsibilities })
          }
          experienceId={entry.id}
          jobTitle={entry.programmeName}
          company={entry.company}
        />
      </div>
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
      <div>
        <FieldLabel htmlFor={`role-${entry.id}`} label="Position" />
        <Input
          id={`role-${entry.id}`}
          value={entry.role}
          onChange={(e) => onChange({ ...entry, role: e.target.value })}
          aria-invalid={errors.role ? true : undefined}
          className={cn(fieldInputClass, errors.role && "border-destructive")}
        />
        <FieldError message={errors.role} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <FieldLabel htmlFor={`org-${entry.id}`} label="Organization" />
          <Input
            id={`org-${entry.id}`}
            value={entry.organization}
            onChange={(e) =>
              onChange({ ...entry, organization: e.target.value })
            }
            aria-invalid={errors.organization ? true : undefined}
            className={cn(
              fieldInputClass,
              errors.organization && "border-destructive",
            )}
          />
          <FieldError message={errors.organization} />
        </div>
        <div>
          <FieldLabel htmlFor={`city-${entry.id}`} label="City" />
          <Input
            id={`city-${entry.id}`}
            value={entry.location}
            onChange={(e) => onChange({ ...entry, location: e.target.value })}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={`cause-${entry.id}`} label="Cause (optional)" />
        <Input
          id={`cause-${entry.id}`}
          value={entry.cause}
          onChange={(e) => onChange({ ...entry, cause: e.target.value })}
          className={fieldInputClass}
        />
      </div>

      <EducationDateRangeFields
        startMonth={entry.startMonth}
        startYear={entry.startYear}
        endMonth={entry.endMonth}
        endYear={entry.endYear}
        current={entry.current}
        onChange={(patch) => onChange({ ...entry, ...patch })}
        errors={errors}
      />

      <div>
        <FieldLabel label="Description" />
        <ExperienceDescriptionEditor
          items={entry.responsibilities}
          onChange={(responsibilities) =>
            onChange({ ...entry, responsibilities })
          }
          experienceId={entry.id}
          jobTitle={entry.role}
          company={entry.organization}
        />
      </div>
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
      <div>
        <FieldLabel htmlFor={`project-${entry.id}`} label="Project name" />
        <Input
          id={`project-${entry.id}`}
          value={entry.projectName}
          onChange={(e) => onChange({ ...entry, projectName: e.target.value })}
          aria-invalid={errors.projectName ? true : undefined}
          className={cn(
            fieldInputClass,
            errors.projectName && "border-destructive",
          )}
        />
        <FieldError message={errors.projectName} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <FieldLabel htmlFor={`client-${entry.id}`} label="Client (optional)" />
          <Input
            id={`client-${entry.id}`}
            value={entry.clientName}
            onChange={(e) => onChange({ ...entry, clientName: e.target.value })}
            className={fieldInputClass}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`portfolio-${entry.id}`} label="Portfolio link" />
          <Input
            id={`portfolio-${entry.id}`}
            value={entry.portfolioLink}
            onChange={(e) =>
              onChange({ ...entry, portfolioLink: e.target.value })
            }
            className={fieldInputClass}
            placeholder="https://"
          />
        </div>
      </div>

      <DateModeToggle
        mode={entry.dateMode}
        onChange={(dateMode) => onChange({ ...entry, dateMode })}
      />

      {entry.dateMode === "range" ? (
        <EducationDateRangeFields
          startMonth={entry.startMonth}
          startYear={entry.startYear}
          endMonth={entry.endMonth}
          endYear={entry.endYear}
          current={false}
          showPresent={false}
          onChange={(patch) => {
            onChange({
              ...entry,
              startMonth: patch.startMonth ?? entry.startMonth,
              startYear: patch.startYear ?? entry.startYear,
              endMonth: patch.endMonth ?? entry.endMonth,
              endYear: patch.endYear ?? entry.endYear,
            });
          }}
          errors={errors}
        />
      ) : (
        <DurationField
          value={entry.duration}
          onChange={(duration) => onChange({ ...entry, duration })}
          error={errors.duration}
        />
      )}

      <SkillsTagSelector
        label="Technologies"
        value={entry.technologies}
        onChange={(technologies) => onChange({ ...entry, technologies })}
      />

      <div>
        <FieldLabel label="Description" />
        <ExperienceDescriptionEditor
          items={entry.achievements}
          onChange={(achievements) => onChange({ ...entry, achievements })}
          experienceId={entry.id}
          jobTitle={entry.projectName}
          company={entry.clientName}
          field="achievements"
        />
      </div>
    </div>
  );
}
