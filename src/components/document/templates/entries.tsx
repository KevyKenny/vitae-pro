"use client";

import {
  examBoardLabel,
  qualificationLabel,
} from "@/features/cv-editor/components/education/education-helpers";
import {
  experienceTypeLabel,
  formatDateRange,
} from "@/features/cv-editor/components/experience/experience-helpers";
import type {
  EducationEntry,
  ExperienceEntry,
  SubjectGrade,
} from "@/features/cv-editor/types";
import { formatEducationDateRange } from "@/lib/cvs/education-dates";
import { isBlankHtml, sanitizeCvHtml } from "@/lib/cvs/sanitize-html";
import { DocResolvedLink } from "@/components/document/document-links";
import { WholeWords } from "@/components/document/templates/whole-words";
import { cn } from "@/lib/utils";

export type EntryHeadingParts = {
  title: string;
  subtitle: string;
  date: string;
};

function joinParts(parts: (string | undefined)[]): string {
  return parts.map((p) => p?.trim()).filter(Boolean).join(", ");
}

const MONTH_ABBREVIATIONS: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

/** Reference layouts use short months and a hyphen range separator. */
export function shortenDateLabel(label: string): string {
  if (!label) return "";
  return label
    .replace(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g,
      (month) => MONTH_ABBREVIATIONS[month] ?? month,
    )
    .replace(/\s+[–—]\s+/g, " - ");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Title / organisation / date split used by date-right template families. */
export function experienceHeadingParts(entry: ExperienceEntry): EntryHeadingParts {
  switch (entry.experienceType) {
    case "industrial-attachment":
    case "internship":
      return {
        title: entry.role || experienceTypeLabel(entry.experienceType),
        subtitle: joinParts([entry.company, entry.department, entry.location]),
        date:
          entry.dateMode === "duration" && entry.duration
            ? entry.duration
            : formatDateRange(entry),
      };
    case "graduate-trainee":
      return {
        title: joinParts([entry.programmeName || "Graduate Trainee"]),
        subtitle: joinParts([entry.company, entry.department, entry.location]),
        date: formatDateRange(entry),
      };
    case "volunteer":
      return {
        title: entry.role || "Volunteer",
        subtitle: joinParts([entry.organization, entry.cause, entry.location]),
        date: formatDateRange(entry),
      };
    case "freelance":
      return {
        title: entry.projectName || "Freelance project",
        subtitle: joinParts([entry.clientName, entry.technologies.join(" / ")]),
        date:
          entry.dateMode === "duration" && entry.duration
            ? entry.duration
            : formatDateRange(entry),
      };
    default:
      return {
        title: entry.position || experienceTypeLabel(entry.experienceType),
        subtitle: joinParts([entry.company, entry.location]),
        date: formatDateRange(entry),
      };
  }
}

export type EducationEntryParts = EntryHeadingParts & {
  bullets: string[];
  subjects: SubjectGrade[];
  descriptionHtml?: string;
  verificationUrl?: string;
};

const LETTER_GRADE_RANK: Record<string, number> = {
  "a*": 0,
  "a+": 0,
  a: 1,
  distinction: 1,
  b: 2,
  merit: 2,
  c: 3,
  credit: 3,
  d: 4,
  e: 5,
  pass: 5,
  f: 6,
  g: 7,
  u: 8,
  ungraded: 8,
  fail: 9,
};

function gradeRank(grade: string): number {
  const normalised = grade.trim().toLowerCase().replace(/\s+/g, "");
  if (normalised in LETTER_GRADE_RANK) return LETTER_GRADE_RANK[normalised];
  const numeric = Number.parseInt(normalised, 10);
  // ZIMSEC 1–9 and similar: 1 is strongest. Unknown marks sink to the end.
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 9) return numeric;
  return 50;
}

/** Strongest grade first, then A–Z, so a compact two-up list still reads as ranked. */
export function sortSubjectsForDocument(
  subjects: SubjectGrade[],
): SubjectGrade[] {
  return [...subjects].sort((a, b) => {
    const byGrade = gradeRank(a.grade) - gradeRank(b.grade);
    if (byGrade !== 0) return byGrade;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

/** One or two subject/grade pairs on a single compact row. */
export function DocSubjectGridRow({
  cells,
  lead = false,
}: {
  cells: SubjectGrade[];
  lead?: boolean;
}) {
  if (cells.length === 0) return null;
  return (
    <div className={cn("tpl-subject-grid", lead && "tpl-subject-grid--lead")}>
      {cells.map((subject) => (
        <span key={subject.id} className="tpl-subject-cell">
          <span className="tpl-subject-name">{subject.name}</span>
          {subject.grade?.trim() ? (
            <span className="tpl-subject-grade">{subject.grade.trim()}</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function educationEntryParts(entry: EducationEntry): EducationEntryParts {
  switch (entry.qualificationType) {
    case "o-level":
    case "a-level": {
      const level =
        entry.qualificationType === "o-level"
          ? "Ordinary Level"
          : "Advanced Level";
      return {
        title: `${examBoardLabel(
          entry.examinationBoard,
          entry.examinationBoardOther,
        )} – ${level}`,
        subtitle: entry.schoolName,
        date: entry.yearCompleted,
        bullets: entry.candidateNumber
          ? [`Candidate number: ${entry.candidateNumber}`]
          : [],
        // Keep the user's subject order. Alignment is CSS-only.
        subjects: entry.subjects.filter((s) => s.name.trim()),
      };
    }
    case "certificate":
      return {
        title: entry.certificateName || qualificationLabel(entry.qualificationType),
        subtitle: entry.institution,
        date: entry.year,
        bullets: [entry.description].filter((v): v is string => Boolean(v?.trim())),
        subjects: [],
      };
    case "professional":
      return {
        title:
          entry.certificationName || qualificationLabel(entry.qualificationType),
        subtitle: entry.issuingOrganization,
        date: entry.issueDate,
        bullets: [
          entry.credentialId ? `Credential ID: ${entry.credentialId}` : "",
          entry.expiryDate ? `Expires ${entry.expiryDate}` : "",
        ].filter(Boolean),
        subjects: [],
        verificationUrl: entry.verificationUrl?.trim() || undefined,
      };
    case "vocational":
    case "short-course":
    case "apprenticeship":
      return {
        title: entry.programmeName || qualificationLabel(entry.qualificationType),
        subtitle: joinParts([entry.trainingProvider, entry.duration]),
        date: entry.completionDate,
        bullets: [entry.skillsAcquired].filter((v): v is string =>
          Boolean(v?.trim()),
        ),
        subjects: [],
      };
    default: {
      const bullets = [entry.achievements]
        .filter((v): v is string => Boolean(v?.trim()))
        .flatMap((value) =>
          value
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean),
        );
      const hasHtmlDescription =
        Boolean(entry.description) && !isBlankHtml(entry.description);
      return {
        title: entry.qualification || qualificationLabel(entry.qualificationType),
        subtitle: joinParts([entry.institution, entry.city]),
        date: formatEducationDateRange(entry),
        bullets,
        subjects: [],
        descriptionHtml: hasHtmlDescription
          ? sanitizeCvHtml(entry.description)
          : undefined,
      };
    }
  }
}

/** Bold title on the left, date right-aligned on the same baseline. */
export function DocEntryTitleRow({
  title,
  date,
  className,
}: {
  title: string;
  date?: string;
  className?: string;
}) {
  return (
    <div className={cn("tpl-entry-row", className)}>
      <span className="tpl-entry-title">{title}</span>
      {date ? (
        <span className="tpl-entry-date">{shortenDateLabel(date)}</span>
      ) : null}
    </div>
  );
}

export function DocEntrySubtitle({ text }: { text: string }) {
  if (!text) return null;
  return <p className="tpl-entry-subtitle">{text}</p>;
}

export function DocEntryBullets({ items }: { items: string[] }) {
  const lines = items.map((item) => item.trim()).filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className="tpl-entry-bullets">
      {lines.map((line, index) => (
        <li key={`${line}-${index}`}>
          <WholeWords text={line} />
        </li>
      ))}
    </ul>
  );
}

export function DocExperienceEntryHeader({ entry }: { entry: ExperienceEntry }) {
  const { title, subtitle, date } = experienceHeadingParts(entry);
  const portfolioLink =
    entry.experienceType === "freelance" ? entry.portfolioLink?.trim() : "";

  return (
    <div className="tpl-entry">
      <DocEntryTitleRow title={title} date={date} />
      <DocEntrySubtitle text={subtitle} />
      {portfolioLink ? (
        <p className="tpl-entry-subtitle">
          <DocResolvedLink raw={portfolioLink} className="tpl-contact-link" />
        </p>
      ) : null}
    </div>
  );
}

function experienceCompanyLine(entry: ExperienceEntry): string {
  switch (entry.experienceType) {
    case "volunteer":
      return entry.organization?.trim() || "";
    case "freelance":
      return entry.clientName?.trim() || "";
    default:
      return entry.company?.trim() || "";
  }
}

/**
 * OpenResume / template-0 experience header: company on its own line,
 * then job title left + date right.
 */
export function DocOpenResumeExperienceHeader({
  entry,
  hideCompany,
}: {
  entry: ExperienceEntry;
  hideCompany?: boolean;
}) {
  const { title, date } = experienceHeadingParts(entry);
  const company = experienceCompanyLine(entry);
  const portfolioLink =
    entry.experienceType === "freelance" ? entry.portfolioLink?.trim() : "";

  const showCompany = !hideCompany && Boolean(company);

  return (
    <div
      className={cn(
        "tpl-entry tpl-entry--open-resume",
        !showCompany && "tpl-entry--continues",
      )}
    >
      {showCompany ? <p className="tpl-entry-company">{company}</p> : null}
      <DocEntryTitleRow title={title} date={date} />
      {portfolioLink ? (
        <p className="tpl-entry-subtitle">
          <DocResolvedLink raw={portfolioLink} className="tpl-contact-link" />
        </p>
      ) : null}
    </div>
  );
}

/**
 * Technology chips shown inline with a project heading. Kept as spans so they
 * can sit inside heading paragraphs across every template family.
 */
export function DocTechBadges({ items }: { items?: string[] }) {
  const values = (items ?? []).map((item) => item.trim()).filter(Boolean);
  if (!values.length) return null;
  return (
    <span className="tpl-tech-badges">
      {values.map((value) => (
        <span key={value} className="tpl-tech-badge">
          {value}
        </span>
      ))}
    </span>
  );
}

/** Compact external-link glyph used where template-0 shows an icon, not a URL. */
export function DocExternalLinkIcon() {
  return (
    <svg
      className="tpl-link-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/**
 * Title extras shared by every template family: open-in-new-tab icon first,
 * then technology chips. Call immediately after the title text.
 */
export function DocTitleLinkAndBadges({
  href,
  badges,
  srLabel,
}: {
  href?: string;
  badges?: string[];
  srLabel: string;
}) {
  const trimmed = href?.trim();
  return (
    <>
      {trimmed ? (
        <>
          {" "}
          <DocResolvedLink raw={trimmed} className="tpl-link" kind="web">
            <DocExternalLinkIcon />
            <span className="sr-only">{srLabel}</span>
          </DocResolvedLink>
        </>
      ) : null}
      <DocTechBadges items={badges} />
    </>
  );
}

/** OpenResume education header: institution bold, then qualification + date. */
export function DocOpenResumeEducationHeader({
  entry,
}: {
  entry: EducationEntry;
}) {
  const parts = educationEntryParts(entry);
  return (
    <div className="tpl-entry tpl-entry--open-resume">
      {parts.subtitle ? (
        <p className="tpl-entry-company">{parts.subtitle}</p>
      ) : null}
      <DocEntryTitleRow title={parts.title} date={parts.date} />
      <DocEntryBullets items={parts.bullets} />
    </div>
  );
}

/** OpenResume award: bold title with the issuer inline, description bulleted. */
export function DocOpenResumeAward({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="tpl-entry tpl-entry--open-resume">
      {title ? <p className="tpl-entry-company">{title}</p> : null}
      {description ? <DocEntryBullets items={[stripHtml(description)]} /> : null}
    </div>
  );
}

/** OpenResume certificate using the shared name/link/date row. */
export function DocOpenResumeCertificate({
  name,
  provider,
  date,
  credentialUrl,
}: {
  name: string;
  provider?: string;
  date?: string;
  credentialUrl?: string;
}) {
  return (
    <DocCertificateRow
      name={name}
      provider={provider}
      date={date}
      credentialUrl={credentialUrl}
    />
  );
}

export function DocEducationEntryHeader({ entry }: { entry: EducationEntry }) {
  const parts = educationEntryParts(entry);
  return (
    <div className="tpl-entry">
      <DocEntryTitleRow title={parts.title} date={parts.date} />
      <DocEntrySubtitle text={parts.subtitle} />
      <DocEntryBullets items={parts.bullets} />
    </div>
  );
}

export function DocEducationDescription({
  html,
}: {
  html: string;
}) {
  return (
    <div
      className="tpl-entry-body prose-cv"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function DocSubjectTableHeader({ variant = "tpl" }: { variant?: "tpl" | "doc" }) {
  const className =
    variant === "doc"
      ? "doc-subject-table mt-2 w-full text-left text-[0.88rem]"
      : "tpl-subject-table";
  return (
    <table className={className}>
      <thead>
        <tr>
          <th className={variant === "doc" ? "pb-1 font-semibold" : undefined}>
            Subject
          </th>
          <th className={variant === "doc" ? "pb-1 font-semibold" : undefined}>
            Grade
          </th>
        </tr>
      </thead>
    </table>
  );
}

export function DocSubjectTableRow({
  name,
  grade,
  variant = "tpl",
}: {
  name: string;
  grade: string;
  variant?: "tpl" | "doc";
}) {
  const className =
    variant === "doc"
      ? "doc-subject-table w-full text-left text-[0.88rem] tpl-subject-table--row"
      : "tpl-subject-table tpl-subject-table--row";
  return (
    <table className={className}>
      <tbody>
        <tr>
          <td className={variant === "doc" ? "py-0.5 pr-4 align-top" : undefined}>
            {name}
          </td>
          <td className={variant === "doc" ? "py-0.5 align-top" : undefined}>
            {grade}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function DocEducationEntry({ entry }: { entry: EducationEntry }) {
  const parts = educationEntryParts(entry);
  return (
    <div className="tpl-entry">
      <DocEntryTitleRow title={parts.title} date={parts.date} />
      <DocEntrySubtitle text={parts.subtitle} />
      <DocEntryBullets items={parts.bullets} />
      {parts.descriptionHtml ? (
        <div
          className="tpl-entry-body prose-cv"
          dangerouslySetInnerHTML={{ __html: parts.descriptionHtml }}
        />
      ) : null}
      {parts.subjects.length > 0 ? (
        <table className="tpl-subject-table">
          <tbody>
            {parts.subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{subject.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {parts.verificationUrl ? (
        <p className="tpl-entry-meta">
          <DocResolvedLink
            raw={parts.verificationUrl}
            className="tpl-contact-link"
          />
        </p>
      ) : null}
    </div>
  );
}

/** Certification name/link, provider body immediately after the name, date at line end. */
export function DocCertificateRow({
  name,
  provider,
  date,
  credentialUrl,
}: {
  name: string;
  provider?: string;
  date?: string;
  credentialUrl?: string;
}) {
  const body = provider?.trim();
  return (
    <div className="tpl-cert-row">
      <span className="tpl-cert-copy">
        <span className="tpl-cert-name">
          {name}
          <DocTitleLinkAndBadges
            href={credentialUrl}
            srLabel={`Open credential for ${name}`}
          />
        </span>
        {body ? <span className="tpl-cert-provider">{body}</span> : null}
      </span>
      {date ? (
        <span className="tpl-entry-date">{shortenDateLabel(date)}</span>
      ) : null}
    </div>
  );
}

export function DocReferenceEntry({
  name,
  relationship,
  contact,
}: {
  name: string;
  relationship?: string;
  contact?: string;
}) {
  return (
    <div className="tpl-entry tpl-reference-entry">
      <p className="tpl-entry-title">{name}</p>
      {relationship ? <DocEntrySubtitle text={relationship} /> : null}
      {contact ? <p className="tpl-entry-contact">{contact}</p> : null}
    </div>
  );
}

/** Numbered project row: bold name followed by an inline description. */
export function DocNumberedProject({
  index,
  name,
  description,
  technologies,
  link,
}: {
  index: number;
  name: string;
  description?: string;
  technologies?: string[];
  link?: string;
}) {
  const detail = description?.trim();

  return (
    <div className="tpl-numbered-row">
      <span className="tpl-numbered-marker">{index}.</span>
      <span className="tpl-numbered-body">
        <strong>{name}</strong>
        <DocTitleLinkAndBadges
          href={link}
          badges={technologies}
          srLabel={`Open project ${name}`}
        />
        {detail ? ` (${detail})` : ""}
      </span>
    </div>
  );
}

export function DocAchievementBullet({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <ul className="tpl-entry-bullets">
      <li>
        {title ? <strong>{title}</strong> : null}
        {title && description ? " — " : null}
        {description ? stripHtml(description) : null}
      </li>
    </ul>
  );
}
