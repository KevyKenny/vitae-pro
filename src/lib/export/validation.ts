import type { CoverLetterDocument } from "@/features/cover-letter/types";
import type { CvDocument } from "@/features/cv-editor/types";
import { calculateCvCompletion } from "@/lib/cvs/completion";
import type { ExportValidationResult } from "@/components/document/types";

function hasText(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

function cvHasContent(document: CvDocument): boolean {
  return (
    hasText(document.summary) ||
    document.experience.length > 0 ||
    document.education.length > 0 ||
    document.skills.length > 0 ||
    document.projects.length > 0 ||
    document.certifications.length > 0 ||
    document.languages.length > 0 ||
    document.achievements.length > 0 ||
    document.references.length > 0 ||
    document.sections.some((s) => s.type === "custom" && hasText(s.content))
  );
}

export function validateCvExport(document: CvDocument): ExportValidationResult {
  const warnings: string[] = [];
  const blockers: string[] = [];
  const completionPercent = calculateCvCompletion(document);

  if (!cvHasContent(document)) {
    blockers.push(
      "Your CV has no content yet. Add at least one section before exporting.",
    );
  }

  if (!hasText(document.personal.fullName)) {
    warnings.push(
      "Your CV is missing a name. You can still download it, but we recommend adding your full name.",
    );
  }

  if (!hasText(document.personal.email) && !hasText(document.personal.phone)) {
    warnings.push(
      "Your CV is missing contact information. You can still download it, but we recommend completing this section first.",
    );
  }

  const readyMessage =
    completionPercent >= 80
      ? "Your CV is ready to download."
      : `Your CV is ${completionPercent}% complete.`;

  return {
    canExport: blockers.length === 0,
    warnings,
    blockers,
    completionPercent,
    readyMessage,
  };
}

export function validateCoverLetterExport(
  document: CoverLetterDocument,
): ExportValidationResult {
  const warnings: string[] = [];
  const blockers: string[] = [];

  const bodyText = [
    document.body.greeting,
    document.body.opening,
    document.body.experience,
    document.body.skills,
    document.body.closing,
    document.body.signature,
  ]
    .join(" ")
    .trim();

  if (!bodyText) {
    blockers.push(
      "Your cover letter is empty. Add content before exporting.",
    );
  }

  if (!hasText(document.body.headerName)) {
    warnings.push(
      "Your cover letter is missing your name in the header.",
    );
  }

  return {
    canExport: blockers.length === 0,
    warnings,
    blockers,
    readyMessage: bodyText ? "Your cover letter is ready to download." : undefined,
  };
}
