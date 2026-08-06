"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EducationFieldErrors } from "@/features/cv-editor/components/education/education-helpers";
import type {
  CertificateEducation,
  ProfessionalEducation,
  TertiaryEducation,
  VocationalEducation,
} from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

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
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          ["institution", "Institution"],
          ["qualification", "Qualification"],
          ["field", "Field of study"],
          ["startDate", "Start year"],
          ["endDate", "End year"],
          ["grade", "Grade / classification"],
          ["achievements", "Achievements"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
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
          Description
        </Label>
        <Textarea
          rows={2}
          value={entry.description}
          onChange={(e) => onChange({ ...entry, description: e.target.value })}
          className="bg-surface"
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
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          ["certificateName", "Certificate name"],
          ["institution", "Institution"],
          ["year", "Year"],
          ["credentialNumber", "Credential number (optional)"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
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
          Description
        </Label>
        <Textarea
          rows={2}
          value={entry.description}
          onChange={(e) => onChange({ ...entry, description: e.target.value })}
          className="bg-surface"
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
    <div className="grid gap-3 sm:grid-cols-2">
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
          <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
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
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          ["trainingProvider", "Training provider"],
          ["programmeName", "Programme name"],
          ["duration", "Duration"],
          ["completionDate", "Completion date"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
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
          Skills acquired
        </Label>
        <Textarea
          rows={2}
          value={entry.skillsAcquired}
          onChange={(e) =>
            onChange({ ...entry, skillsAcquired: e.target.value })
          }
          className="bg-surface"
          placeholder="e.g. Plumbing, site safety, customer service"
        />
      </div>
    </div>
  );
}
