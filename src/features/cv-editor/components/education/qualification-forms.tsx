"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EducationDateRangeFields } from "@/features/cv-editor/components/education/education-date-fields";
import { EducationDescriptionEditor } from "@/features/cv-editor/components/education/education-description-editor";
import {
  patchTertiaryEntry,
  type EducationFieldErrors,
} from "@/features/cv-editor/components/education/education-helpers";
import type {
  CertificateEducation,
  ProfessionalEducation,
  TertiaryEducation,
  VocationalEducation,
} from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

const fieldInputClass =
  "h-10 border-0 bg-paper-dim shadow-none focus-visible:border-line-strong focus-visible:shadow-none";

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

export function TertiaryForm({
  entry,
  onChange,
  errors,
}: {
  entry: TertiaryEducation;
  onChange: (next: TertiaryEducation) => void;
  errors: EducationFieldErrors;
}) {
  function patch(patch: Partial<TertiaryEducation>) {
    onChange(patchTertiaryEntry(entry, patch));
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor={`education-${entry.id}`} label="Education" />
        <Input
          id={`education-${entry.id}`}
          value={entry.qualification}
          onChange={(e) => patch({ qualification: e.target.value })}
          aria-invalid={errors.qualification ? true : undefined}
          className={cn(fieldInputClass, errors.qualification && "border-destructive")}
          placeholder="e.g. BSc (Hons) in Computer Science"
        />
        <FieldError message={errors.qualification} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <FieldLabel htmlFor={`institution-${entry.id}`} label="Institution" />
          <Input
            id={`institution-${entry.id}`}
            value={entry.institution}
            onChange={(e) => patch({ institution: e.target.value })}
            aria-invalid={errors.institution ? true : undefined}
            className={cn(fieldInputClass, errors.institution && "border-destructive")}
          />
          <FieldError message={errors.institution} />
        </div>
        <div>
          <FieldLabel htmlFor={`city-${entry.id}`} label="City" />
          <Input
            id={`city-${entry.id}`}
            value={entry.city}
            onChange={(e) => patch({ city: e.target.value })}
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
        onChange={patch}
        errors={errors}
      />

      <div>
        <FieldLabel label="Description" />
        <EducationDescriptionEditor
          value={entry.description}
          onChange={(description) => patch({ description })}
        />
      </div>
    </div>
  );
}

export function CertificateForm({
  entry,
  onChange,
  errors,
}: {
  entry: CertificateEducation;
  onChange: (next: CertificateEducation) => void;
  errors: EducationFieldErrors;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(
        [
          ["certificateName", "Certificate name"],
          ["institution", "Institution"],
          ["year", "Year"],
          ["credentialNumber", "Credential number (optional)"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-1.5">
          <FieldLabel label={label} />
          <Input
            value={entry[key]}
            onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
            aria-invalid={errors[key] ? true : undefined}
            className={cn(fieldInputClass, errors[key] && "border-destructive")}
          />
          <FieldError message={errors[key]} />
        </div>
      ))}
      <div className="space-y-1.5 sm:col-span-2">
        <FieldLabel label="Description" />
        <Textarea
          rows={3}
          value={entry.description}
          onChange={(e) => onChange({ ...entry, description: e.target.value })}
          className={fieldInputClass}
        />
      </div>
    </div>
  );
}

export function ProfessionalForm({
  entry,
  onChange,
  errors,
}: {
  entry: ProfessionalEducation;
  onChange: (next: ProfessionalEducation) => void;
  errors: EducationFieldErrors;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(
        [
          ["certificationName", "Certification name"],
          ["issuingOrganization", "Issuing organization"],
          ["issueDate", "Issue date"],
          ["expiryDate", "Expiry date (optional)"],
          ["credentialId", "Credential ID"],
          ["verificationUrl", "Verification URL"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-1.5">
          <FieldLabel label={label} />
          <Input
            value={entry[key]}
            onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
            aria-invalid={errors[key] ? true : undefined}
            className={cn(fieldInputClass, errors[key] && "border-destructive")}
          />
          <FieldError message={errors[key]} />
        </div>
      ))}
    </div>
  );
}

export function VocationalForm({
  entry,
  onChange,
  errors,
}: {
  entry: VocationalEducation;
  onChange: (next: VocationalEducation) => void;
  errors: EducationFieldErrors;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(
        [
          ["trainingProvider", "Training provider"],
          ["programmeName", "Programme name"],
          ["duration", "Duration"],
          ["completionDate", "Completion date"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-1.5">
          <FieldLabel label={label} />
          <Input
            value={entry[key]}
            onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
            aria-invalid={errors[key] ? true : undefined}
            className={cn(fieldInputClass, errors[key] && "border-destructive")}
          />
          <FieldError message={errors[key]} />
        </div>
      ))}
      <div className="space-y-1.5 sm:col-span-2">
        <FieldLabel label="Skills acquired" />
        <Textarea
          rows={3}
          value={entry.skillsAcquired}
          onChange={(e) =>
            onChange({ ...entry, skillsAcquired: e.target.value })
          }
          className={fieldInputClass}
          placeholder="e.g. Plumbing, site safety, customer service"
        />
      </div>
    </div>
  );
}
