"use client";

import { EducationEntryDocumentHeader, EducationPreview } from "@/features/cv-editor/components/education/education-preview";
import {
  ExperienceEntryDocument,
  experienceBulletLines,
} from "@/features/cv-editor/components/experience/experience-preview";
import type { CvDocument, CvSectionType, EducationEntry } from "@/features/cv-editor/types";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
  sectionTitle,
  sectionVisible,
  splitHtmlBlocks,
  SECTION_LABELS,
  type BlockBuilderState,
} from "@/components/document/templates/block-builder-utils";
import type { BlockRegion } from "@/components/document/pagination/types";
import type { TemplateRenderContext } from "@/lib/templates/definitions/types";
import {
  formatEducationDateLabel,
  parseEducationDateParts,
} from "@/lib/cvs/education-dates";
import { groupedSkills } from "@/features/cv-editor/constants/skills";
import { DocSectionHeading } from "@/components/document/templates/primitives";
import {
  DocAchievementBullet,
  DocCertificateRow,
  DocEducationDescription,
  DocEducationEntryHeader,
  DocEntryBullets,
  DocExperienceEntryHeader,
  DocExternalLinkIcon,
  DocNumberedProject,
  DocOpenResumeAward,
  DocOpenResumeCertificate,
  DocOpenResumeEducationHeader,
  DocOpenResumeExperienceHeader,
  DocReferenceEntry,
  DocSubjectGridRow,
  DocSubjectTableHeader,
  DocSubjectTableRow,
  DocTechBadges,
  educationEntryParts,
} from "@/components/document/templates/entries";
import { isBlankHtml } from "@/lib/cvs/sanitize-html";
import { DocResolvedLink } from "@/components/document/document-links";

export type SectionBlockOptions = {
  region?: BlockRegion;
  experienceLabel?: string;
  educationLabel?: string;
  summaryLabel?: string;
  projectsLabel?: string;
  certificationsLabel?: string;
  skillsLabel?: string;
  languagesLabel?: string;
  achievementsLabel?: string;
  referencesLabel?: string;
  /** Use the template's labels verbatim instead of the document's own wording. */
  preferTemplateLabels?: boolean;
  sectionHeadingVariant?: "default" | "uppercase" | "form" | "sidebar" | "plain";
  /**
   * `date-right` — bold title with date right-aligned; organisation on accent subtitle.
   * `open-resume` — company line, then title + date (template-0 / OpenResume).
   */
  entryStyle?: "default" | "date-right" | "open-resume";
  includeSkills?: boolean;
  includeReferences?: boolean;
  includeAchievements?: boolean;
  includeCertifications?: boolean;
  includeProjects?: boolean;
  includeLanguages?: boolean;
  sectionOrder?: CvSectionType[];
  /**
   * Two-up subject/grade rows, strongest first. Used by Professional to keep
   * O-Level / A-Level lists from stretching the document.
   */
  compactSubjects?: boolean;
};

const DEFAULT_ORDER: CvSectionType[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "achievements",
  "references",
];

function experienceCompanyKey(
  entry: CvDocument["experience"][number] | undefined,
): string {
  if (!entry) return "";
  switch (entry.experienceType) {
    case "volunteer":
      return entry.organization?.trim().toLowerCase() || "";
    case "freelance":
      return entry.clientName?.trim().toLowerCase() || "";
    default:
      return entry.company?.trim().toLowerCase() || "";
  }
}

function addSectionTitle(
  state: BlockBuilderState,
  document: CvDocument,
  type: CvSectionType,
  fallback: string,
  region: BlockRegion,
  variant: SectionBlockOptions["sectionHeadingVariant"],
  preferTemplateLabels?: boolean,
) {
  const title = preferTemplateLabels
    ? fallback
    : sectionTitle(document, type, fallback);
  pushBlock(state, {
    id: nextId(state, `section-${type}`),
    kind: "section-title",
    region,
    orphanGuard: true,
    keepWithNext: true,
    render: () => <DocSectionHeading title={title} variant={variant ?? "default"} />,
  });
}

function appendEducationEntryBlocks(
  state: BlockBuilderState,
  entry: EducationEntry,
  region: BlockRegion,
  dateRight: boolean,
  openResume: boolean,
  compactSubjects: boolean,
) {
  const parts = educationEntryParts(entry);
  const renderHeader = () =>
    openResume ? (
      <DocOpenResumeEducationHeader entry={entry} />
    ) : dateRight ? (
      <DocEducationEntryHeader entry={entry} />
    ) : (
      <EducationEntryDocumentHeader entry={entry} />
    );
  const tableVariant = dateRight ? "tpl" : "doc";
  const hasSubjects = parts.subjects.length > 0;
  const splittable =
    hasSubjects ||
    Boolean(parts.descriptionHtml) ||
    Boolean(parts.verificationUrl);

  if (!splittable) {
    pushBlock(state, {
      id: nextId(state, `edu-${entry.id}`),
      kind: "education-entry",
      region,
      groupId: entry.id,
      render: () =>
        openResume ? (
          <DocOpenResumeEducationHeader entry={entry} />
        ) : dateRight ? (
          <DocEducationEntryHeader entry={entry} />
        ) : (
          <EducationPreview education={[entry]} variant="document" />
        ),
    });
    return;
  }

  pushBlock(state, {
    id: nextId(state, `edu-h-${entry.id}`),
    kind: "education-entry",
    region,
    groupId: entry.id,
    keepWithNext:
      Boolean(parts.descriptionHtml) ||
      Boolean(parts.verificationUrl) ||
      hasSubjects,
    render: renderHeader,
  });

  if (parts.descriptionHtml) {
    pushBlock(state, {
      id: nextId(state, `edu-d-${entry.id}`),
      kind: "education-entry",
      region,
      groupId: entry.id,
      keepWithNext: Boolean(parts.verificationUrl) || hasSubjects,
      render: () => <DocEducationDescription html={parts.descriptionHtml!} />,
    });
  }

  if (parts.verificationUrl) {
    pushBlock(state, {
      id: nextId(state, `edu-v-${entry.id}`),
      kind: "education-entry",
      region,
      groupId: entry.id,
      keepWithNext: hasSubjects,
      render: () => (
        <p className="tpl-entry-meta">
          <DocResolvedLink
            raw={parts.verificationUrl!}
            className="tpl-contact-link"
          />
        </p>
      ),
    });
  }

  if (hasSubjects) {
    if (compactSubjects) {
      for (let i = 0; i < parts.subjects.length; i += 2) {
        const pair = parts.subjects.slice(i, i + 2);
        pushBlock(state, {
          id: nextId(state, `edu-tr-${entry.id}-${pair[0].id}`),
          kind: "education-table-row",
          region,
          groupId: entry.id,
          render: () => <DocSubjectGridRow cells={pair} lead={i === 0} />,
        });
      }
      return;
    }

    pushBlock(state, {
      id: nextId(state, `edu-th-${entry.id}`),
      kind: "education-table-header",
      region,
      groupId: entry.id,
      keepWithNext: true,
      render: () => <DocSubjectTableHeader variant={tableVariant} />,
    });

    for (const subject of parts.subjects) {
      pushBlock(state, {
        id: nextId(state, `edu-tr-${entry.id}-${subject.id}`),
        kind: "education-table-row",
        region,
        groupId: entry.id,
        render: () => (
          <DocSubjectTableRow
            name={subject.name}
            grade={subject.grade}
            variant={tableVariant}
          />
        ),
      });
    }
  }
}

export function appendMainSectionBlocks(
  state: BlockBuilderState,
  document: CvDocument,
  ctx: TemplateRenderContext,
  options: SectionBlockOptions = {},
) {
  const region = options.region ?? "main";
  const headingVariant = options.sectionHeadingVariant ?? "default";
  const order = options.sectionOrder ?? DEFAULT_ORDER;
  const dateRight =
    options.entryStyle === "date-right" || options.entryStyle === "open-resume";
  const openResume = options.entryStyle === "open-resume";
  const preferLabels = options.preferTemplateLabels;
  const compactSubjects = Boolean(options.compactSubjects);

  for (const type of order) {
    switch (type) {
      case "summary":
        if (sectionVisible(document, "summary") && document.summary) {
          addSectionTitle(
            state,
            document,
            "summary",
            options.summaryLabel ?? SECTION_LABELS.summary,
            region,
            headingVariant,
            preferLabels,
          );
          pushBlock(state, {
            id: nextId(state, "summary"),
            kind: "paragraph",
            region,
            render: () => <p className="doc-body tpl-summary">{document.summary}</p>,
          });
        }
        break;

      case "experience":
        if (sectionVisible(document, "experience") && document.experience.length > 0) {
          addSectionTitle(
            state,
            document,
            "experience",
            options.experienceLabel ?? SECTION_LABELS.experience,
            region,
            headingVariant,
            preferLabels,
          );
          document.experience.forEach((entry, entryIndex) => {
            const bullets = experienceBulletLines(entry);
            const prev = document.experience[entryIndex - 1];
            const hideCompany =
              openResume &&
              Boolean(prev) &&
              experienceCompanyKey(entry) === experienceCompanyKey(prev) &&
              Boolean(experienceCompanyKey(entry));

            pushBlock(state, {
              id: nextId(state, `exp-h-${entry.id}`),
              kind: "experience-header",
              region,
              groupId: entry.id,
              keepWithNext: bullets.length > 0,
              render: () =>
                openResume ? (
                  <DocOpenResumeExperienceHeader
                    entry={entry}
                    hideCompany={hideCompany}
                  />
                ) : dateRight ? (
                  <DocExperienceEntryHeader entry={entry} />
                ) : (
                  <ExperienceEntryDocument entry={entry} part="header" />
                ),
            });
            if (bullets.length > 0) {
              bullets.forEach((bullet, bulletIndex) => {
                pushBlock(state, {
                  id: nextId(state, `exp-b-${entry.id}-${bulletIndex}`),
                  kind: "experience-bullet",
                  region,
                  groupId: entry.id,
                  render: () =>
                    dateRight || openResume ? (
                      <DocEntryBullets items={[bullet]} />
                    ) : (
                      <ExperienceEntryDocument
                        entry={entry}
                        part="bullets"
                        bullets={[bullet]}
                      />
                    ),
                });
              });
            }
            const hasFooter =
              (entry.experienceType === "industrial-attachment" ||
                entry.experienceType === "internship") &&
              (entry.skillsGained.length > 0 ||
                (entry.includeSupervisorOnExport && entry.supervisor.name));
            if (hasFooter) {
              pushBlock(state, {
                id: nextId(state, `exp-f-${entry.id}`),
                kind: "experience-footer",
                region,
                groupId: entry.id,
                render: () => (
                  <ExperienceEntryDocument entry={entry} part="footer" />
                ),
              });
            }
          });
        }
        break;

      case "education":
        if (sectionVisible(document, "education") && document.education.length > 0) {
          addSectionTitle(
            state,
            document,
            "education",
            options.educationLabel ?? SECTION_LABELS.education,
            region,
            headingVariant,
            preferLabels,
          );
          for (const entry of document.education) {
            appendEducationEntryBlocks(
              state,
              entry,
              region,
              dateRight,
              openResume,
              compactSubjects,
            );
          }
        }
        break;

      case "skills":
        if (
          options.includeSkills !== false &&
          sectionVisible(document, "skills") &&
          document.skills.length > 0
        ) {
          const groups = groupedSkills(document);
          if (groups.length > 0) {
            addSectionTitle(
              state,
              document,
              "skills",
              options.skillsLabel ?? SECTION_LABELS.skills,
              region,
              headingVariant,
              preferLabels,
            );
            for (const group of groups) {
              pushBlock(state, {
                id: nextId(state, `skills-${group.id}`),
                kind: "skills-group",
                region,
                render: () =>
                  openResume ? (
                    <div className="tpl-entry tpl-entry--open-resume">
                      <p className="tpl-entry-company">{group.label}</p>
                      <DocEntryBullets
                        items={[group.skills.map((s) => s.name).join(", ")]}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="doc-entry-title">{group.label}</p>
                      <p className="doc-body">
                        {group.skills.map((s) => s.name).join(" · ")}
                      </p>
                    </>
                  ),
              });
            }
          }
        }
        break;

      case "projects":
        if (
          options.includeProjects !== false &&
          sectionVisible(document, "projects") &&
          document.projects.length > 0
        ) {
          addSectionTitle(
            state,
            document,
            "projects",
            options.projectsLabel ?? SECTION_LABELS.projects,
            region,
            headingVariant,
            preferLabels,
          );
          document.projects.forEach((project, projectIndex) => {
            pushBlock(state, {
              id: nextId(state, `proj-${project.id}`),
              kind: "project",
              region,
              render: () =>
                openResume ? (
                  <div className="tpl-entry tpl-entry--open-resume">
                    <p className="tpl-entry-company">
                      {project.name}
                      <DocTechBadges items={project.technologies} />
                      {project.link?.trim() ? (
                        <>
                          {" "}
                          <DocResolvedLink raw={project.link} className="tpl-link">
                            <DocExternalLinkIcon />
                            <span className="sr-only">
                              Open project {project.name}
                            </span>
                          </DocResolvedLink>
                        </>
                      ) : null}
                    </p>
                    <DocEntryBullets items={[project.description]} />
                  </div>
                ) : dateRight ? (
                  <DocNumberedProject
                    index={projectIndex + 1}
                    name={project.name}
                    description={project.description}
                    technologies={project.technologies}
                    link={project.link}
                  />
                ) : (
                  <div className="doc-entry tpl-project-entry">
                    <p className="doc-entry-title">
                      {project.name}
                      <DocTechBadges items={project.technologies} />
                      {project.link?.trim() ? (
                        <>
                          {" "}
                          <DocResolvedLink
                            raw={project.link}
                            className="tpl-link"
                          >
                            <DocExternalLinkIcon />
                            <span className="sr-only">
                              Open project {project.name}
                            </span>
                          </DocResolvedLink>
                        </>
                      ) : null}
                    </p>
                    {project.description ? (
                      <p className="doc-entry-meta">{project.description}</p>
                    ) : null}
                  </div>
                ),
            });
          });
        }
        break;

      case "certifications":
        if (
          options.includeCertifications !== false &&
          sectionVisible(document, "certifications") &&
          document.certifications.length > 0
        ) {
          addSectionTitle(
            state,
            document,
            "certifications",
            options.certificationsLabel ?? SECTION_LABELS.certifications,
            region,
            headingVariant,
            preferLabels,
          );
          for (const cert of document.certifications) {
            const { month, year } = parseEducationDateParts(cert.date);
            const dateLabel = formatEducationDateLabel(month, year, cert.date);
            pushBlock(state, {
              id: nextId(state, `cert-${cert.id}`),
              kind: "cert",
              region,
              render: () =>
                openResume ? (
                  <DocOpenResumeCertificate
                    name={cert.name}
                    provider={cert.provider}
                    date={dateLabel}
                    credentialUrl={cert.credentialUrl}
                  />
                ) : dateRight ? (
                  <DocCertificateRow
                    name={cert.name}
                    provider={cert.provider}
                    date={dateLabel}
                    credentialUrl={cert.credentialUrl}
                  />
                ) : (
                  <DocCertificateRow
                    name={cert.name}
                    provider={cert.provider}
                    date={dateLabel}
                    credentialUrl={cert.credentialUrl}
                  />
                ),
            });
          }
        }
        break;

      case "languages":
        if (
          options.includeLanguages !== false &&
          sectionVisible(document, "languages") &&
          document.languages.length > 0
        ) {
          addSectionTitle(
            state,
            document,
            "languages",
            options.languagesLabel ?? SECTION_LABELS.languages,
            region,
            headingVariant,
            preferLabels,
          );
          pushBlock(state, {
            id: nextId(state, "languages"),
            kind: "paragraph",
            region,
            render: () => (
              <p className="doc-body">
                {document.languages
                  .map((lang) =>
                    lang.proficiency
                      ? `${lang.name} (${lang.proficiency})`
                      : lang.name,
                  )
                  .join(" · ")}
              </p>
            ),
          });
        }
        break;

      case "achievements":
        if (
          options.includeAchievements !== false &&
          sectionVisible(document, "achievements") &&
          document.achievements.length > 0
        ) {
          addSectionTitle(
            state,
            document,
            "achievements",
            options.achievementsLabel ?? SECTION_LABELS.achievements,
            region,
            headingVariant,
            preferLabels,
          );
          for (const item of document.achievements) {
            pushBlock(state, {
              id: nextId(state, `ach-${item.id}`),
              kind: "achievement",
              region,
              render: () =>
                openResume ? (
                  <DocOpenResumeAward
                    title={item.title}
                    description={item.description}
                  />
                ) : dateRight ? (
                  <DocAchievementBullet
                    title={item.title}
                    description={item.description}
                  />
                ) : (
                  <div className="doc-entry">
                    <p className="doc-entry-title">{item.title}</p>
                    {item.description ? (
                      <p className="doc-entry-meta">{item.description}</p>
                    ) : null}
                  </div>
                ),
            });
          }
        }
        break;

      case "references":
        if (
          options.includeReferences !== false &&
          sectionVisible(document, "references") &&
          document.references.length > 0
        ) {
          addSectionTitle(
            state,
            document,
            "references",
            options.referencesLabel ?? SECTION_LABELS.references,
            region,
            headingVariant,
            preferLabels,
          );
          for (const ref of document.references) {
            pushBlock(state, {
              id: nextId(state, `ref-${ref.id}`),
              kind: "reference",
              region,
              render: () =>
                openResume ? (
                  <DocEntryBullets
                    items={[
                      [ref.name, ref.relationship, ref.contact]
                        .map((part) => part?.trim())
                        .filter(Boolean)
                        .join(", "),
                    ]}
                  />
                ) : dateRight ? (
                  <DocReferenceEntry
                    name={ref.name}
                    relationship={ref.relationship}
                    contact={ref.contact}
                  />
                ) : (
                  <div className="doc-entry tpl-reference-entry">
                    <p className="doc-entry-title">{ref.name}</p>
                    <p className="doc-entry-meta">
                      {[ref.relationship, ref.contact].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                ),
            });
          }
        }
        break;

      default:
        break;
    }
  }

  for (const section of document.sections.filter(
    (s) =>
      s.type === "custom" &&
      s.visible &&
      s.content?.trim() &&
      !isBlankHtml(s.content),
  )) {
    pushBlock(state, {
      id: nextId(state, `section-custom-${section.id}`),
      kind: "section-title",
      region,
      orphanGuard: true,
      keepWithNext: true,
      render: () => (
        <DocSectionHeading
          title={section.label || SECTION_LABELS.custom}
          variant={headingVariant}
        />
      ),
    });
    splitHtmlBlocks(section.content ?? "").forEach((part, index) => {
      pushBlock(state, {
        id: nextId(state, `custom-${section.id}-${index}`),
        kind: "custom-html",
        region,
        render: () => (
          <div
            className="doc-body prose-cv"
            dangerouslySetInnerHTML={{ __html: part }}
          />
        ),
      });
    });
  }

  void ctx;
}

export function buildMainSectionBlocks(
  document: CvDocument,
  ctx: TemplateRenderContext,
  options: SectionBlockOptions = {},
) {
  const state = createBlockBuilder();
  appendMainSectionBlocks(state, document, ctx, options);
  return state.blocks;
}
