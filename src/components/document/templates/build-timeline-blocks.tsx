"use client";

import { Fragment, type ReactNode } from "react";

import type { BlockKind, ContentBlock } from "@/components/document/pagination/types";
import { DocResolvedLink } from "@/components/document/document-links";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
  sectionTitle,
  sectionVisible,
  softSkillItems,
  splitHtmlBlocks,
  technicalSkillNames,
  SECTION_LABELS,
  type BlockBuilderState,
} from "@/components/document/templates/block-builder-utils";
import {
  DocExternalLinkIcon,
  educationEntryParts,
  experienceHeadingParts,
  shortenDateLabel,
} from "@/components/document/templates/entries";
import { experienceBulletLines } from "@/features/cv-editor/components/experience/experience-preview";
import type { CvDocument, CvSectionType } from "@/features/cv-editor/types";
import {
  formatEducationDateLabel,
  parseEducationDateParts,
} from "@/lib/cvs/education-dates";
import { isBlankHtml } from "@/lib/cvs/sanitize-html";
import { cn } from "@/lib/utils";

/**
 * Timeline layout used by `Resume Form (Compact)` (templates-layout/template-1.pdf).
 *
 * Every block is a row: a fixed-width aside holding the section heading or the
 * entry date, and a body column separated by the page's vertical rule. Rows are
 * individually packed so an entry can split across pages while its date stays
 * with the first fragment.
 */

type RowSpec = {
  key: string;
  kind: BlockKind;
  aside?: ReactNode;
  /** Draws the accent square straddling the vertical rule. */
  marker?: boolean;
  groupId?: string;
  keepWithNext?: boolean;
  /** Opens a new item, so it takes the inter-entry gap. */
  lead?: boolean;
  body?: ReactNode;
};

export function TimelineRow({
  aside,
  marker,
  children,
  variant,
}: {
  aside?: ReactNode;
  marker?: boolean;
  children?: ReactNode;
  /** `lead` opens an entry, `tight` carries an undated section's heading. */
  variant?: "lead" | "tight" | "heading";
}) {
  return (
    <div className={cn("tpl-tl-row", variant && `tpl-tl-row--${variant}`)}>
      <div className="tpl-tl-aside">{aside}</div>
      <div className="tpl-tl-main">
        {marker ? <span className="tpl-tl-marker" aria-hidden /> : null}
        {children}
      </div>
    </div>
  );
}

function TimelineHeading({ title }: { title: string }) {
  return <h2 className="tpl-tl-heading">{title}</h2>;
}

/**
 * Emits a section. Dated sections get a heading row of their own so the entry
 * dates line up underneath it; undated sections hang the heading in the aside
 * of their first row, matching the reference's tighter spacing.
 */
function labeled(
  document: CvDocument,
  type: CvSectionType,
  preferred: string,
  preferTemplateLabels: boolean,
) {
  return preferTemplateLabels
    ? preferred
    : sectionTitle(document, type, preferred);
}

function appendSection(
  state: BlockBuilderState,
  options: { heading: string; dated: boolean; rows: RowSpec[] },
) {
  const { heading, dated, rows } = options;
  if (rows.length === 0) return;

  if (dated) {
    pushBlock(state, {
      id: nextId(state, "tl-heading"),
      kind: "section-title",
      region: "main",
      orphanGuard: true,
      keepWithNext: true,
      render: () => (
        <TimelineRow
          aside={<TimelineHeading title={heading} />}
          variant="heading"
        />
      ),
    });
  }

  rows.forEach((row, index) => {
    const withHeading = !dated && index === 0;
    pushBlock(state, {
      id: nextId(state, row.key),
      kind: row.kind,
      region: "main",
      groupId: row.groupId,
      orphanGuard: withHeading || undefined,
      keepWithNext: row.keepWithNext,
      render: () => (
        <TimelineRow
          aside={
            withHeading ? <TimelineHeading title={heading} /> : row.aside
          }
          marker={row.marker}
          variant={withHeading ? "tight" : row.lead ? "lead" : undefined}
        >
          {row.body}
        </TimelineRow>
      ),
    });
  });
}

function EntryHead({
  title,
  org,
  orgTone = "accent",
  href,
  badges,
}: {
  title: string;
  org?: string;
  /** Projects set their strapline as body copy rather than an accent heading. */
  orgTone?: "accent" | "ink";
  /** Renders an open-in-new-tab affordance directly after the title. */
  href?: string;
  /** Muted chips trailing the title, e.g. a project's stack. */
  badges?: string[];
}) {
  const trimmedHref = href?.trim();
  const chips = badges?.filter((badge) => badge.trim()) ?? [];
  return (
    <>
      {title ? (
        <p className="tpl-tl-title">
          {title}
          {trimmedHref ? (
            <DocResolvedLink
              raw={trimmedHref}
              className="tpl-tl-open"
              kind="web"
            >
              <DocExternalLinkIcon />
            </DocResolvedLink>
          ) : null}
          {chips.map((badge) => (
            <span key={badge} className="tpl-tl-badge">
              {badge}
            </span>
          ))}
        </p>
      ) : null}
      {org ? (
        <p className={cn("tpl-tl-org", orgTone === "ink" && "tpl-tl-org--ink")}>
          {org}
        </p>
      ) : null}
    </>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <ul className="tpl-tl-bullets">
      <li>{text}</li>
    </ul>
  );
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Technical skills read as a wrapped keyword line so the section closes in two
 * or three rows. The separator carries a leading no-break space so a line can
 * only ever break after it, never onto a stranded bullet.
 */
function SkillFlow({ items }: { items: string[] }) {
  return (
    <p className="tpl-tl-skills">
      {items.map((item, index) => (
        <Fragment key={item}>
          {item}
          {index < items.length - 1 ? (
            <span className="tpl-tl-skills-sep">{"\u00a0\u00b7 "}</span>
          ) : null}
        </Fragment>
      ))}
    </p>
  );
}

function GridRow({
  cells,
  variant,
}: {
  cells: string[];
  variant: "skill" | "quality";
}) {
  return (
    <div className={cn("tpl-tl-grid", `tpl-tl-grid--${variant}`)}>
      {cells.map((cell) => (
        <span key={cell} className="tpl-tl-grid-cell">
          {cell}
        </span>
      ))}
    </div>
  );
}

/**
 * `qualities` is not a stored section: the reference splits soft skills out of
 * Skills into their own square-bulleted block, which `softSkillItems` already
 * models for the other templates.
 */
export type TimelineSection = CvSectionType | "qualities";

const DEFAULT_ORDER: TimelineSection[] = [
  "education",
  "experience",
  "skills",
  "references",
  "qualities",
  "certifications",
  "languages",
  "achievements",
  "projects",
];

export function buildTimelineBlocks(
  document: CvDocument,
  options: {
    sectionOrder?: TimelineSection[];
    preferTemplateLabels?: boolean;
  } = {},
): ContentBlock[] {
  const state = createBlockBuilder();
  const order = options.sectionOrder ?? DEFAULT_ORDER;
  const preferLabels = Boolean(options.preferTemplateLabels);

  for (const type of order) {
    switch (type) {
      case "education": {
        if (!sectionVisible(document, "education")) break;
        const rows: RowSpec[] = [];
        for (const entry of document.education) {
          const parts = educationEntryParts(entry);
          rows.push({
            key: `tl-edu-${entry.id}`,
            kind: "education-entry",
            groupId: entry.id,
            marker: true,
            lead: true,
            keepWithNext:
              parts.bullets.length > 0 || Boolean(parts.descriptionHtml),
            aside: parts.date ? (
              <p className="tpl-tl-date">{shortenDateLabel(parts.date)}</p>
            ) : undefined,
            body: <EntryHead title={parts.title} org={parts.subtitle} />,
          });
          if (parts.descriptionHtml) {
            splitHtmlBlocks(parts.descriptionHtml).forEach((part, index) => {
              rows.push({
                key: `tl-edu-d-${entry.id}-${index}`,
                kind: "education-table-row",
                groupId: entry.id,
                body: (
                  <div
                    className="tpl-tl-html"
                    dangerouslySetInnerHTML={{ __html: part }}
                  />
                ),
              });
            });
          }
          parts.bullets.forEach((bullet, index) => {
            rows.push({
              key: `tl-edu-b-${entry.id}-${index}`,
              kind: "education-table-row",
              groupId: entry.id,
              body: <Bullet text={bullet} />,
            });
          });
          if (parts.subjects.length > 0) {
            rows.push({
              key: `tl-edu-s-${entry.id}`,
              kind: "education-table-row",
              groupId: entry.id,
              body: (
                <Bullet
                  text={parts.subjects
                    .map((s) => `${s.name}: ${s.grade}`)
                    .join(", ")}
                />
              ),
            });
          }
          if (parts.verificationUrl) {
            rows.push({
              key: `tl-edu-v-${entry.id}`,
              kind: "education-table-row",
              groupId: entry.id,
              body: (
                <p className="tpl-tl-meta">
                  <DocResolvedLink
                    raw={parts.verificationUrl}
                    className="tpl-tl-link"
                  />
                </p>
              ),
            });
          }
        }
        appendSection(state, {
          heading: labeled(
            document,
            "education",
            SECTION_LABELS.education,
            preferLabels,
          ),
          dated: true,
          rows,
        });
        break;
      }

      case "experience": {
        if (!sectionVisible(document, "experience")) break;
        const rows: RowSpec[] = [];
        for (const entry of document.experience) {
          const parts = experienceHeadingParts(entry);
          const org =
            ("company" in entry && entry.company?.trim()) ||
            ("organization" in entry && entry.organization?.trim()) ||
            ("clientName" in entry && entry.clientName?.trim()) ||
            parts.subtitle;
          const bullets = experienceBulletLines(entry);
          rows.push({
            key: `tl-exp-${entry.id}`,
            kind: "experience-header",
            groupId: entry.id,
            marker: true,
            lead: true,
            keepWithNext: bullets.length > 0,
            aside: parts.date ? (
              <p className="tpl-tl-date">{shortenDateLabel(parts.date)}</p>
            ) : undefined,
            body: <EntryHead title={parts.title} org={org || undefined} />,
          });
          bullets.forEach((bullet, index) => {
            rows.push({
              key: `tl-exp-b-${entry.id}-${index}`,
              kind: "experience-bullet",
              groupId: entry.id,
              body: <Bullet text={bullet} />,
            });
          });
        }
        appendSection(state, {
          heading: labeled(
            document,
            "experience",
            SECTION_LABELS.experience,
            preferLabels,
          ),
          dated: true,
          rows,
        });
        break;
      }

      case "skills": {
        if (!sectionVisible(document, "skills")) break;
        const technical = technicalSkillNames(document);
        appendSection(state, {
          heading: labeled(
            document,
            "skills",
            SECTION_LABELS.skills,
            preferLabels,
          ),
          dated: false,
          // Chunked only so an unusually long list keeps page-break
          // opportunities; a normal one flows as a single wrapped run.
          rows: chunk(technical, 24).map((group, index) => ({
            key: `tl-skill-${index}`,
            kind: "skills-group",
            body: <SkillFlow items={group} />,
          })),
        });
        break;
      }

      case "qualities": {
        if (!sectionVisible(document, "skills")) break;
        appendSection(state, {
          heading: "Qualities",
          dated: false,
          rows: chunk(softSkillItems(document), 2).map((pair, index) => ({
            key: `tl-quality-${index}`,
            kind: "skills-group",
            lead: true,
            body: <GridRow cells={pair} variant="quality" />,
          })),
        });
        break;
      }

      case "references": {
        if (!sectionVisible(document, "references")) break;
        appendSection(state, {
          heading: labeled(
            document,
            "references",
            SECTION_LABELS.references,
            preferLabels,
          ),
          dated: false,
          rows: document.references.map((ref) => ({
            key: `tl-ref-${ref.id}`,
            kind: "reference" as const,
            groupId: ref.id,
            lead: true,
            body: (
              <>
                <EntryHead title={ref.name} org={ref.relationship} />
                {ref.contact ? (
                  <p className="tpl-tl-meta">{ref.contact}</p>
                ) : null}
              </>
            ),
          })),
        });
        break;
      }

      case "certifications": {
        if (!sectionVisible(document, "certifications")) break;
        appendSection(state, {
          heading: labeled(
            document,
            "certifications",
            "Certificates",
            preferLabels,
          ),
          dated: true,
          rows: document.certifications.map((cert) => {
            const { month, year } = parseEducationDateParts(cert.date);
            const dateLabel = formatEducationDateLabel(month, year, cert.date);
            return {
              key: `tl-cert-${cert.id}`,
              kind: "cert" as const,
              groupId: cert.id,
              marker: true,
              lead: true,
              aside: dateLabel ? (
                <p className="tpl-tl-date">{shortenDateLabel(dateLabel)}</p>
              ) : undefined,
              body: (
                <EntryHead
                  title={cert.name}
                  org={cert.provider}
                  href={cert.credentialUrl}
                />
              ),
            };
          }),
        });
        break;
      }

      case "languages": {
        if (!sectionVisible(document, "languages")) break;
        const labels = document.languages.map((lang) =>
          lang.proficiency ? `${lang.name} (${lang.proficiency})` : lang.name,
        );
        appendSection(state, {
          heading: labeled(
            document,
            "languages",
            SECTION_LABELS.languages,
            preferLabels,
          ),
          dated: false,
          rows: chunk(labels, 2).map((pair, index) => ({
            key: `tl-lang-${index}`,
            kind: "skills-group",
            lead: true,
            body: <GridRow cells={pair} variant="skill" />,
          })),
        });
        break;
      }

      case "achievements": {
        if (!sectionVisible(document, "achievements")) break;
        appendSection(state, {
          heading: labeled(
            document,
            "achievements",
            SECTION_LABELS.achievements,
            preferLabels,
          ),
          dated: false,
          rows: document.achievements.map((item) => ({
            key: `tl-ach-${item.id}`,
            kind: "achievement" as const,
            groupId: item.id,
            lead: true,
            body: (
              <Bullet
                text={[item.title, item.description]
                  .map((part) => part?.trim())
                  .filter(Boolean)
                  .join(" — ")}
              />
            ),
          })),
        });
        break;
      }

      case "projects": {
        if (!sectionVisible(document, "projects")) break;
        appendSection(state, {
          heading: labeled(document, "projects", "PROJECTS", preferLabels),
          dated: false,
          rows: document.projects.map((project) => ({
            key: `tl-proj-${project.id}`,
            kind: "project" as const,
            groupId: project.id,
            marker: true,
            lead: true,
            body: (
              <EntryHead
                title={project.name}
                org={project.description}
                orgTone="ink"
                href={project.link}
                badges={project.technologies}
              />
            ),
          })),
        });
        break;
      }

      default:
        break;
    }
  }

  for (const section of document.sections) {
    if (section.type !== "custom" || !section.visible) continue;
    if (!section.content?.trim() || isBlankHtml(section.content)) continue;
    appendSection(state, {
      heading: section.label || SECTION_LABELS.custom,
      dated: false,
      rows: splitHtmlBlocks(section.content).map((part, index) => ({
        key: `tl-custom-${section.id}-${index}`,
        kind: "custom-html" as const,
        body: (
          <div
            className="tpl-tl-html"
            dangerouslySetInnerHTML={{ __html: part }}
          />
        ),
      })),
    });
  }

  return state.blocks;
}
