"use client";

import { EducationPreview } from "@/features/cv-editor/components/education/education-preview";
import {
  ExperienceEntryDocument,
  experienceBulletLines,
} from "@/features/cv-editor/components/experience/experience-preview";
import type { CvDocument, CvSectionType } from "@/features/cv-editor/types";
import { DocContactLine } from "@/components/document/document-links";
import { DocTechBadges } from "@/components/document/templates/entries";
import type { DocumentStyleVars } from "@/components/document/types";
import type { ContentBlock } from "@/components/document/pagination/types";
import { groupedSkills } from "@/features/cv-editor/constants/skills";
import {
  formatEducationDateLabel,
  parseEducationDateParts,
} from "@/lib/cvs/education-dates";
import {
  formatPersonalContactLine,
  isOptionalFieldVisible,
  normalizeCvDocument,
  visibleOptionalPersonalDetails,
} from "@/lib/cvs/personal-info";
import { isBlankHtml, sanitizeCvHtml } from "@/lib/cvs/sanitize-html";

const SECTION_LABELS: Record<CvSectionType, string> = {
  personal: "Contact",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
  references: "References",
  custom: "Additional",
};

function sectionVisible(document: CvDocument, type: CvSectionType): boolean {
  const meta = document.sections.find((s) => s.type === type);
  return meta?.visible ?? false;
}

function sectionTitle(
  document: CvDocument,
  type: CvSectionType,
  fallback: string,
): string {
  return document.sections.find((s) => s.type === type)?.label?.trim() || fallback;
}

function splitHtmlBlocks(html: string): string[] {
  const sanitized = sanitizeCvHtml(html);
  if (isBlankHtml(sanitized)) return [];
  const parts = sanitized
    .split(/(?=<(?:p|li|h[1-6]|div|ul|ol|blockquote)\b)/i)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [sanitized];
}

export type BuildCvBlocksOptions = {
  includeHeader?: boolean;
  layout?: DocumentStyleVars["layout"];
};

export function buildCvContentBlocks(
  rawDocument: CvDocument,
  resolved: DocumentStyleVars,
  options: BuildCvBlocksOptions = {},
): ContentBlock[] {
  const document = normalizeCvDocument(rawDocument);
  const { personal } = document;
  const showSidebar = (options.layout ?? resolved.layout) === "sidebar";
  const includeHeader = options.includeHeader ?? true;
  const blocks: ContentBlock[] = [];
  let seq = 0;
  const id = (prefix: string) => `${prefix}-${seq++}`;

  const push = (block: Omit<ContentBlock, "height"> & { height?: number }) => {
    blocks.push({ ...block, height: block.height ?? 0 });
  };

  const contactItems = [
    {
      label: personal.email,
      href: personal.email ? `mailto:${personal.email}` : undefined,
    },
    {
      label: personal.phone,
      href: personal.phone ? `tel:${personal.phone}` : undefined,
    },
    ...formatPersonalContactLine(personal).map((line) => ({ label: line })),
    ...visibleOptionalPersonalDetails(personal).map((item) => ({
      label: `${item.label}: ${item.value}`,
    })),
  ];

  const linkItems = [
    ...(isOptionalFieldVisible(personal, "linkedin") && personal.linkedin
      ? [{ label: personal.linkedin, href: personal.linkedin }]
      : []),
    ...(isOptionalFieldVisible(personal, "website") && personal.portfolio
      ? [{ label: personal.portfolio, href: personal.portfolio }]
      : []),
    ...(personal.socialLinks ?? []).map((link) => ({ label: link, href: link })),
  ];

  if (showSidebar) {
    // Sidebar chrome is repeated per page in CvDocumentView — not packed in main flow.
  }

  if (includeHeader && sectionVisible(document, "personal")) {
    push({
      id: id("header"),
      kind: "header",
      render: () => (
        <header>
          <h1
            className="doc-name"
            style={{ fontFamily: resolved.fontHeading }}
          >
            {personal.fullName}
          </h1>
          {personal.useAsHeadline && personal.title ? (
            <p className="doc-title">{personal.title}</p>
          ) : null}
          {!showSidebar ? (
            <>
              <DocContactLine items={contactItems} className="doc-contact" />
              <DocContactLine items={linkItems} className="doc-contact" />
            </>
          ) : (
            <>
              <DocContactLine items={contactItems} className="doc-contact" />
              <DocContactLine items={linkItems} className="doc-contact" />
            </>
          )}
        </header>
      ),
    });
  }

  const addSectionTitle = (type: CvSectionType) => {
    push({
      id: id(`section-${type}`),
      kind: "section-title",
      orphanGuard: true,
      keepWithNext: true,
      render: () => (
        <h2 className="doc-section-title">
          {sectionTitle(document, type, SECTION_LABELS[type])}
        </h2>
      ),
    });
  };

  if (sectionVisible(document, "summary") && document.summary) {
    addSectionTitle("summary");
    push({
      id: id("summary"),
      kind: "paragraph",
      render: () => <p className="doc-body">{document.summary}</p>,
    });
  }

  if (sectionVisible(document, "experience") && document.experience.length > 0) {
    addSectionTitle("experience");
    for (const entry of document.experience) {
      const bullets = experienceBulletLines(entry);
      push({
        id: id(`exp-h-${entry.id}`),
        kind: "experience-header",
        groupId: entry.id,
        render: () => <ExperienceEntryDocument entry={entry} part="header" />,
      });
      for (const bullet of bullets) {
        push({
          id: id(`exp-b-${entry.id}-${bullet.slice(0, 12)}`),
          kind: "experience-bullet",
          groupId: entry.id,
          render: () => (
            <ExperienceEntryDocument
              entry={entry}
              part="bullets"
              bullets={[bullet]}
            />
          ),
        });
      }
      const hasFooter =
        (entry.experienceType === "industrial-attachment" ||
          entry.experienceType === "internship") &&
        (entry.skillsGained.length > 0 ||
          (entry.includeSupervisorOnExport && entry.supervisor.name));
      if (hasFooter) {
        push({
          id: id(`exp-f-${entry.id}`),
          kind: "experience-footer",
          groupId: entry.id,
          render: () => <ExperienceEntryDocument entry={entry} part="footer" />,
        });
      }
    }
  }

  if (sectionVisible(document, "education") && document.education.length > 0) {
    addSectionTitle("education");
    for (const entry of document.education) {
      push({
        id: id(`edu-${entry.id}`),
        kind: "education-entry",
        groupId: entry.id,
        render: () => (
          <EducationPreview education={[entry]} variant="document" />
        ),
      });
    }
  }

  if (!showSidebar && sectionVisible(document, "skills") && document.skills.length > 0) {
    const groups = groupedSkills(document);
    if (groups.length > 0) {
      addSectionTitle("skills");
      for (const group of groups) {
        push({
          id: id(`skills-${group.id}`),
          kind: "skills-group",
          render: () => (
            <>
              <p className="doc-entry-title">{group.label}</p>
              <p className="doc-body">{group.skills.map((s) => s.name).join(" · ")}</p>
            </>
          ),
        });
      }
    }
  }

  if (sectionVisible(document, "projects") && document.projects.length > 0) {
    addSectionTitle("projects");
    for (const project of document.projects) {
      push({
        id: id(`proj-${project.id}`),
        kind: "project",
        render: () => (
          <div className="doc-entry">
            <p className="doc-entry-title">
              {project.name}
              <DocTechBadges items={project.technologies} />
            </p>
            {project.description ? (
              <p className="doc-entry-meta">{project.description}</p>
            ) : null}
            {project.link ? (
              <p className="doc-entry-meta">
                <a
                  href={
                    project.link.startsWith("http")
                      ? project.link
                      : `https://${project.link}`
                  }
                >
                  {project.link}
                </a>
              </p>
            ) : null}
          </div>
        ),
      });
    }
  }

  if (
    sectionVisible(document, "certifications") &&
    document.certifications.length > 0
  ) {
    addSectionTitle("certifications");
    for (const cert of document.certifications) {
      const { month, year } = parseEducationDateParts(cert.date);
      const dateLabel = formatEducationDateLabel(month, year, cert.date);
      push({
        id: id(`cert-${cert.id}`),
        kind: "cert",
        render: () => (
          <div className="doc-entry">
            <p className="doc-entry-title">{cert.name}</p>
            <p className="doc-entry-meta">
              {[cert.provider, dateLabel].filter(Boolean).join(" · ")}
            </p>
            {cert.credentialUrl ? (
              <p className="doc-entry-meta">
                <a
                  href={
                    cert.credentialUrl.startsWith("http")
                      ? cert.credentialUrl
                      : `https://${cert.credentialUrl}`
                  }
                >
                  {cert.credentialUrl}
                </a>
              </p>
            ) : null}
          </div>
        ),
      });
    }
  }

  if (sectionVisible(document, "languages") && document.languages.length > 0) {
    addSectionTitle("languages");
    push({
      id: id("languages"),
      kind: "paragraph",
      render: () => (
        <p className="doc-body">
          {document.languages
            .map((lang) =>
              lang.proficiency ? `${lang.name} (${lang.proficiency})` : lang.name,
            )
            .join(" · ")}
        </p>
      ),
    });
  }

  if (sectionVisible(document, "achievements") && document.achievements.length > 0) {
    addSectionTitle("achievements");
    for (const item of document.achievements) {
      push({
        id: id(`ach-${item.id}`),
        kind: "achievement",
        render: () => (
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

  if (sectionVisible(document, "references") && document.references.length > 0) {
    addSectionTitle("references");
    for (const ref of document.references) {
      push({
        id: id(`ref-${ref.id}`),
        kind: "reference",
        render: () => (
          <div className="doc-entry">
            <p className="doc-entry-title">{ref.name}</p>
            <p className="doc-entry-meta">
              {[ref.relationship, ref.contact].filter(Boolean).join(" · ")}
            </p>
          </div>
        ),
      });
    }
  }

  for (const section of document.sections.filter(
    (s) =>
      s.type === "custom" &&
      s.visible &&
      s.content?.trim() &&
      !isBlankHtml(s.content),
  )) {
    push({
      id: id(`section-custom-${section.id}`),
      kind: "section-title",
      orphanGuard: true,
      keepWithNext: true,
      render: () => (
        <h2 className="doc-section-title">
          {section.label || SECTION_LABELS.custom}
        </h2>
      ),
    });
    const htmlParts = splitHtmlBlocks(section.content ?? "");
    htmlParts.forEach((part, index) => {
      push({
        id: id(`custom-${section.id}-${index}`),
        kind: "custom-html",
        render: () => (
          <div
            className="doc-body prose-cv"
            dangerouslySetInnerHTML={{ __html: part }}
          />
        ),
      });
    });
  }

  return blocks;
}

export function renderContentBlock(block: ContentBlock): React.ReactNode {
  return block.render();
}
