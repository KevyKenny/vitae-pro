
import {
  examBoardLabel,
  qualificationLabel,
} from "@/features/cv-editor/components/education/education-helpers";
import type { EducationEntry, TertiaryEducation } from "@/features/cv-editor/types";
import { formatEducationDateRange } from "@/lib/cvs/education-dates";
import { isBlankHtml, sanitizeCvHtml } from "@/lib/cvs/sanitize-html";

export function EducationPreview({
  education,
  variant = "preview",
}: {
  education: EducationEntry[];
  compact?: boolean;
  variant?: "preview" | "document";
}) {
  if (education.length === 0) return null;

  const titleClass =
    variant === "document"
      ? "doc-entry-title"
      : "text-[0.58rem] font-semibold text-ink";
  const metaClass =
    variant === "document" ? "doc-entry-meta" : "text-[0.5rem] text-ink-faint";
  const bodyClass =
    variant === "document" ? "doc-body" : "text-[0.55rem] text-ink-soft";
  const entryClass = variant === "document" ? "doc-entry" : "mt-1.5";

  return (
    <div className={variant === "document" ? undefined : "space-y-2"}>
      {education.map((entry) => (
        <div key={entry.id} className={entryClass}>
          {renderEntry(
            entry,
            titleClass,
            metaClass,
            bodyClass,
            variant,
          )}
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
  variant: "preview" | "document",
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
            variant === "document" ? (
              <table className="doc-subject-table mt-2 w-full text-left text-[0.88rem]">
                <thead>
                  <tr>
                    <th className="pb-1 font-semibold">Subject</th>
                    <th className="pb-1 font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td className="py-0.5 pr-4 align-top">{subject.name}</td>
                      <td className="py-0.5 align-top">{subject.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <ul className="mt-1 space-y-0.5">
                {subjects.map((subject) => (
                  <li key={subject.id} className={bodyClass}>
                    {subject.name}
                    {subject.grade ? ` – ${subject.grade}` : ""}
                  </li>
                ))}
              </ul>
            )
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
      return renderTertiaryEntry(
        entry,
        titleClass,
        metaClass,
        bodyClass,
        variant,
      );
  }
}

function renderTertiaryEntry(
  entry: TertiaryEducation,
  titleClass: string,
  metaClass: string,
  bodyClass: string,
  variant: "preview" | "document",
  options?: { includeDescription?: boolean },
) {
  const includeDescription = options?.includeDescription ?? true;
  const title =
    entry.qualification.trim() ||
    qualificationLabel(entry.qualificationType);
  const meta = [
    entry.institution,
    entry.city,
    formatEducationDateRange(entry),
    entry.grade,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <p className={titleClass}>{title}</p>
      {meta ? <p className={metaClass}>{meta}</p> : null}
      {entry.field ? <p className={metaClass}>{entry.field}</p> : null}
      {entry.achievements ? (
        <p className={bodyClass}>{entry.achievements}</p>
      ) : null}
      {includeDescription &&
      entry.description &&
      !isBlankHtml(entry.description) ? (
        variant === "document" ? (
          <div
            className="doc-body prose-cv mt-1"
            dangerouslySetInnerHTML={{
              __html: sanitizeCvHtml(entry.description),
            }}
          />
        ) : (
          <p className={bodyClass}>{stripHtml(entry.description)}</p>
        )
      ) : null}
    </>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Header/meta for document pagination blocks; omits subject tables and rich descriptions. */
export function EducationEntryDocumentHeader({
  entry,
}: {
  entry: EducationEntry;
}) {
  const titleClass = "doc-entry-title";
  const metaClass = "doc-entry-meta";
  const bodyClass = "doc-body";

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
      return (
        <div className="doc-entry">
          <p className={titleClass}>
            {board} – {level}
          </p>
          {entry.schoolName ? (
            <p className={metaClass}>{entry.schoolName}</p>
          ) : null}
          {entry.yearCompleted ? (
            <p className={metaClass}>Completed: {entry.yearCompleted}</p>
          ) : null}
          {entry.candidateNumber ? (
            <p className={metaClass}>Candidate number: {entry.candidateNumber}</p>
          ) : null}
        </div>
      );
    }
    case "certificate":
      return (
        <div className="doc-entry">
          <p className={titleClass}>
            {entry.certificateName || qualificationLabel(entry.qualificationType)}
          </p>
          <p className={metaClass}>
            {[entry.institution, entry.year].filter(Boolean).join(" · ")}
          </p>
          {entry.description ? (
            <p className={bodyClass}>{entry.description}</p>
          ) : null}
        </div>
      );
    case "professional":
      return (
        <div className="doc-entry">
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
        </div>
      );
    case "vocational":
    case "short-course":
    case "apprenticeship":
      return (
        <div className="doc-entry">
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
        </div>
      );
    default:
      return (
        <div className="doc-entry">
          {renderTertiaryEntry(
            entry,
            titleClass,
            metaClass,
            bodyClass,
            "document",
            { includeDescription: false },
          )}
        </div>
      );
  }
}
