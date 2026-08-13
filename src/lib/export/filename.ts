import type { CoverLetterDocument } from "@/features/cover-letter/types";
import type { CvDocument } from "@/features/cv-editor/types";

const UNSAFE_FILENAME = /[^a-zA-Z0-9._-]+/g;

function sanitizePart(value: string | undefined | null, fallback: string): string {
  const cleaned = (value ?? "")
    .trim()
    .replace(UNSAFE_FILENAME, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned || fallback;
}

export function buildCvFilename(document: CvDocument, suffix: "CV" | "Resume" = "CV"): string {
  const name = sanitizePart(
    document.personal.fullName.replace(/\s+/g, "_"),
    "VitatePro",
  );
  return `${name}_${suffix}.pdf`;
}

export function buildCoverLetterFilename(
  document: CoverLetterDocument,
): string {
  const name = sanitizePart(
    document.body.headerName.replace(/\s+/g, "_") ||
      document.candidate.name.replace(/\s+/g, "_"),
    "VitatePro",
  );
  const company = sanitizePart(
    document.job.companyName.replace(/\s+/g, "_"),
    "",
  );
  if (company) {
    return `${name}_Cover_Letter_${company}.pdf`;
  }
  return `${name}_Cover_Letter.pdf`;
}
