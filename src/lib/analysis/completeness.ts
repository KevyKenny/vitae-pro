import type { CvDocument } from "@/features/cv-editor/types";

export type CvCompletenessCheck = {
  isAnalyzable: boolean;
  completionPercent: number;
  missingAreas: string[];
  message: string | null;
};

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

/** Minimum content threshold before running a full AI analysis. */
export function checkCvCompleteness(doc: CvDocument): CvCompletenessCheck {
  const missingAreas: string[] = [];

  if (!hasText(doc.personal.fullName)) missingAreas.push("Contact information");
  if (!hasText(doc.personal.email) && !hasText(doc.personal.phone)) {
    if (!missingAreas.includes("Contact information")) {
      missingAreas.push("Contact information");
    }
  }
  if (!hasText(doc.summary)) missingAreas.push("Professional summary");
  if (doc.experience.length === 0) missingAreas.push("Work experience");
  if (doc.education.length === 0) missingAreas.push("Education");
  if (doc.skills.filter((s) => hasText(s.name)).length === 0) {
    missingAreas.push("Skills");
  }

  let filled = 0;
  const total = 5;
  if (hasText(doc.personal.fullName)) filled += 1;
  if (hasText(doc.personal.email) || hasText(doc.personal.phone)) filled += 1;
  if (hasText(doc.summary)) filled += 1;
  if (doc.experience.length > 0) filled += 1;
  if (doc.education.length > 0 || doc.skills.length > 0) filled += 1;

  const completionPercent = Math.round((filled / total) * 100);
  const isAnalyzable =
    filled >= 3 && doc.experience.length + doc.education.length > 0;

  return {
    isAnalyzable,
    completionPercent,
    missingAreas,
    message: isAnalyzable
      ? null
      : "Your CV needs a little more information before we can give you a useful assessment.",
  };
}
