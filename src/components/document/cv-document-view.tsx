import { EducationPreview } from "@/features/cv-editor/components/education/education-preview";
import { ExperiencePreview } from "@/features/cv-editor/components/experience/experience-preview";
import type { CvDocument, CvSectionType } from "@/features/cv-editor/types";
import { DocContactLine } from "@/components/document/document-links";
import {
  documentStyleToCssVars,
  resolveCvDocumentStyle,
} from "@/components/document/resolve-document-style";
import type { CvDocumentViewProps } from "@/components/document/types";
import { cn } from "@/lib/utils";
import { sanitizeCvHtml, isBlankHtml } from "@/lib/cvs/sanitize-html";
import {
  formatPersonalContactLine,
  isOptionalFieldVisible,
  normalizeCvDocument,
  visibleOptionalPersonalDetails,
} from "@/lib/cvs/personal-info";
import { groupedSkills } from "@/features/cv-editor/constants/skills";
import {
  formatEducationDateLabel,
  parseEducationDateParts,
} from "@/lib/cvs/education-dates";

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

function DocSection({
  title,
  spacing,
  children,
}: {
  title: string;
  spacing: number;
  children: React.ReactNode;
}) {
  return (
    <section className="doc-section" style={{ marginTop: spacing }}>
      <h2 className="doc-section-title">{title}</h2>
      {children}
    </section>
  );
}

export function CvDocumentView({
  document: rawDocument,
  mode = "preview",
  customization,
  pageSize = "a4",
  shell = true,
  className,
  style,
}: CvDocumentViewProps) {
  const document = normalizeCvDocument(rawDocument);
  const resolved = resolveCvDocumentStyle(
    document.templateId,
    customization,
    pageSize,
  );
  const cssVars = documentStyleToCssVars(resolved);
  const { personal } = document;
  const showSidebar = resolved.layout === "sidebar";

  const contactItems = [
    { label: personal.email, href: personal.email ? `mailto:${personal.email}` : undefined },
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

  const skillGroups =
    sectionVisible(document, "skills") && document.skills.length > 0
      ? groupedSkills(document)
      : [];

  const skillsBlocks = skillGroups.map((group) => (
    <DocSection key={group.id} title={group.label} spacing={resolved.sectionSpacing}>
      <p className="doc-body">{group.skills.map((s) => s.name).join(" · ")}</p>
    </DocSection>
  ));

  const mainSections = (
    <>
      {sectionVisible(document, "summary") && document.summary ? (
        <DocSection title={sectionTitle(document, "summary", SECTION_LABELS.summary)} spacing={resolved.sectionSpacing}>
          <p className="doc-body">{document.summary}</p>
        </DocSection>
      ) : null}

      {sectionVisible(document, "experience") && document.experience.length > 0 ? (
        <DocSection title={sectionTitle(document, "experience", SECTION_LABELS.experience)} spacing={resolved.sectionSpacing}>
          <ExperiencePreview experience={document.experience} variant="document" />
        </DocSection>
      ) : null}

      {sectionVisible(document, "education") && document.education.length > 0 ? (
        <DocSection title={sectionTitle(document, "education", SECTION_LABELS.education)} spacing={resolved.sectionSpacing}>
          <EducationPreview education={document.education} variant="document" />
        </DocSection>
      ) : null}

      {!showSidebar ? skillsBlocks : null}

      {sectionVisible(document, "projects") && document.projects.length > 0 ? (
        <DocSection title={sectionTitle(document, "projects", SECTION_LABELS.projects)} spacing={resolved.sectionSpacing}>
          {document.projects.map((project) => (
            <div key={project.id} className="doc-entry">
              <p className="doc-entry-title">{project.name}</p>
              {project.description ? (
                <p className="doc-entry-meta">{project.description}</p>
              ) : null}
              {project.technologies.length ? (
                <p className="doc-entry-meta">{project.technologies.join(" · ")}</p>
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
          ))}
        </DocSection>
      ) : null}

      {sectionVisible(document, "certifications") &&
      document.certifications.length > 0 ? (
        <DocSection
          title={sectionTitle(document, "certifications", SECTION_LABELS.certifications)}
          spacing={resolved.sectionSpacing}
        >
          {document.certifications.map((cert) => {
            const { month, year } = parseEducationDateParts(cert.date);
            const dateLabel = formatEducationDateLabel(month, year, cert.date);
            return (
            <div key={cert.id} className="doc-entry">
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
            );
          })}
        </DocSection>
      ) : null}

      {sectionVisible(document, "languages") && document.languages.length > 0 ? (
        <DocSection title={sectionTitle(document, "languages", SECTION_LABELS.languages)} spacing={resolved.sectionSpacing}>
          <p className="doc-body">
            {document.languages
              .map((lang) =>
                lang.proficiency
                  ? `${lang.name} (${lang.proficiency})`
                  : lang.name,
              )
              .join(" · ")}
          </p>
        </DocSection>
      ) : null}

      {sectionVisible(document, "achievements") &&
      document.achievements.length > 0 ? (
        <DocSection
          title={sectionTitle(document, "achievements", SECTION_LABELS.achievements)}
          spacing={resolved.sectionSpacing}
        >
          {document.achievements.map((item) => (
            <div key={item.id} className="doc-entry">
              <p className="doc-entry-title">{item.title}</p>
              {item.description ? (
                <p className="doc-entry-meta">{item.description}</p>
              ) : null}
            </div>
          ))}
        </DocSection>
      ) : null}

      {sectionVisible(document, "references") && document.references.length > 0 ? (
        <DocSection title={sectionTitle(document, "references", SECTION_LABELS.references)} spacing={resolved.sectionSpacing}>
          {document.references.map((ref) => (
            <div key={ref.id} className="doc-entry">
              <p className="doc-entry-title">{ref.name}</p>
              <p className="doc-entry-meta">
                {[ref.relationship, ref.contact].filter(Boolean).join(" · ")}
              </p>
            </div>
          ))}
        </DocSection>
      ) : null}

      {document.sections
        .filter(
          (s) =>
            s.type === "custom" &&
            s.visible &&
            s.content?.trim() &&
            !isBlankHtml(s.content),
        )
        .map((section) => (
          <DocSection
            key={section.id}
            title={section.label || SECTION_LABELS.custom}
            spacing={resolved.sectionSpacing}
          >
            <div
              className="doc-body prose-cv"
              dangerouslySetInnerHTML={{
                __html: sanitizeCvHtml(section.content ?? ""),
              }}
            />
          </DocSection>
        ))}
    </>
  );

  const inner = (
    <>
      {showSidebar ? (
        <>
          <aside className="doc-sidebar">
            <p className="font-semibold">{personal.fullName.split(" ")[0]}</p>
            <DocContactLine items={contactItems} className="doc-cl-meta mt-2" />
            {skillsBlocks}
          </aside>
          <div className="doc-main">
            {sectionVisible(document, "personal") ? (
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
                <DocContactLine items={contactItems} className="doc-contact" />
                <DocContactLine items={linkItems} className="doc-contact" />
              </header>
            ) : null}
            {mainSections}
          </div>
        </>
      ) : (
        <>
          {sectionVisible(document, "personal") ? (
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
              <DocContactLine items={contactItems} className="doc-contact" />
              <DocContactLine items={linkItems} className="doc-contact" />
            </header>
          ) : null}
          {mainSections}
        </>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "doc-root",
        mode === "print" && "doc-root--print",
        className,
      )}
      style={{ ...cssVars, ...style }}
    >
      {shell ? (
        <article
          className={cn(
            "doc-page",
            resolved.pageSize === "letter" && "doc-page--letter",
            document.templateId === "creative" && "doc-template-creative",
            document.templateId === "executive" && "doc-template-executive",
            showSidebar && "doc-layout-sidebar",
          )}
        >
          {inner}
        </article>
      ) : (
        inner
      )}
    </div>
  );
}
