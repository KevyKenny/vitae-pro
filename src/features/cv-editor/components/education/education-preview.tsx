"use client";

import {
  examBoardLabel,
  qualificationLabel,
} from "@/features/cv-editor/components/education/education-helpers";
import type { EducationEntry } from "@/features/cv-editor/types";

export function EducationPreview({
  education,
  compact = false,
}: {
  education: EducationEntry[];
  compact?: boolean;
}) {
  if (education.length === 0) return null;

  const titleClass = compact
    ? "text-[0.58rem] font-semibold text-ink"
    : "text-[0.58rem] font-semibold text-ink";
  const metaClass = compact
    ? "text-[0.5rem] text-ink-faint"
    : "text-[0.5rem] text-ink-faint";
  const bodyClass = compact
    ? "text-[0.55rem] text-ink-soft"
    : "text-[0.55rem] text-ink-soft";

  return (
    <div className="space-y-2">
      {education.map((entry) => (
        <div key={entry.id} className="mt-1.5">
          {renderEntry(entry, titleClass, metaClass, bodyClass)}
        </div>
      ))}
    </div>
  );
}

function renderEntry(
  entry: EducationEntry,
  titleClass: string,
  metaClass: string,
  bodyClass: string,
) {
  switch (entry.qualificationType) {
    case "o-level":
    case "a-level": {
      const board = examBoardLabel(
        entry.examinationBoard,
        entry.examinationBoardOther,
      );
      const level =
        entry.qualificationType === "o-level"
          ? "Ordinary Level"
          : "Advanced Level";
      const subjects = entry.subjects.filter((s) => s.name.trim());
      return (
        <>
          <p className={titleClass}>
            {board} – {level}
          </p>
          {entry.schoolName ? (
            <p className={metaClass}>{entry.schoolName}</p>
          ) : null}
          {entry.yearCompleted ? (
            <p className={metaClass}>Completed: {entry.yearCompleted}</p>
          ) : null}
          {subjects.length > 0 ? (
            <ul className="mt-1 space-y-0.5">
              {subjects.map((s) => (
                <li key={s.id} className={bodyClass}>
                  — {s.name}
                  {s.grade ? ` – ${s.grade}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      );
    }
    case "certificate":
      return (
        <>
          <p className={titleClass}>
            {entry.certificateName || qualificationLabel(entry.qualificationType)}
          </p>
          <p className={metaClass}>
            {[entry.institution, entry.year].filter(Boolean).join(" · ")}
          </p>
          {entry.description ? (
            <p className={bodyClass}>{entry.description}</p>
          ) : null}
        </>
      );
    case "professional":
      return (
        <>
          <p className={titleClass}>
            {entry.certificationName ||
              qualificationLabel(entry.qualificationType)}
          </p>
          <p className={metaClass}>
            {[entry.issuingOrganization, entry.issueDate]
              .filter(Boolean)
              .join(" · ")}
            {entry.expiryDate ? ` · Expires ${entry.expiryDate}` : ""}
          </p>
          {entry.credentialId ? (
            <p className={metaClass}>ID: {entry.credentialId}</p>
          ) : null}
        </>
      );
    case "vocational":
    case "short-course":
    case "apprenticeship":
      return (
        <>
          <p className={titleClass}>
            {entry.programmeName || qualificationLabel(entry.qualificationType)}
          </p>
          <p className={metaClass}>
            {[entry.trainingProvider, entry.duration, entry.completionDate]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {entry.skillsAcquired ? (
            <p className={bodyClass}>{entry.skillsAcquired}</p>
          ) : null}
        </>
      );
    default:
      return (
        <>
          <p className={titleClass}>
            {[entry.qualification, entry.field].filter(Boolean).join(" · ") ||
              qualificationLabel(entry.qualificationType)}
          </p>
          <p className={metaClass}>
            {[
              entry.institution,
              entry.startDate && entry.endDate
                ? `${entry.startDate} – ${entry.endDate}`
                : entry.endDate || entry.startDate,
              entry.grade,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {entry.achievements ? (
            <p className={bodyClass}>{entry.achievements}</p>
          ) : null}
          {entry.description ? (
            <p className={bodyClass}>{entry.description}</p>
          ) : null}
        </>
      );
  }
}
