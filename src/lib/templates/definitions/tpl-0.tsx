"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildMainSectionBlocks } from "@/components/document/templates/build-section-blocks";
import { renderSidebarTemplatePage } from "@/components/document/templates/render-pages";
import {
  buildContactIconItems,
  buildPersonalContactItems,
  DocIconContactRow,
  DocLabelValueList,
  DocSectionHeading,
} from "@/components/document/templates/primitives";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
  softSkillItems,
} from "@/components/document/templates/block-builder-utils";
import { groupedSkills } from "@/features/cv-editor/constants/skills";
import { isOptionalFieldVisible } from "@/lib/cvs/personal-info";
import { resolveDocumentLink } from "@/lib/document-links";

/**
 * Full-bleed charcoal header: white name + muted icon contacts (email / phone / location).
 * Matched to templates-layout/template-2.pdf.
 */
function ContrastHeader({ document }: { document: CvDocument }) {
  const allowed = new Set(
    buildPersonalContactItems(document.personal)
      .filter(
        (item) =>
          item.kind === "email" ||
          item.kind === "phone" ||
          item.kind === "location",
      )
      .map((item) => item.label),
  );
  const items = buildContactIconItems(document.personal).filter((item) =>
    allowed.has(item.label),
  );

  return (
    <header className="tpl-0-header">
      <h1 className="tpl-0-name">{document.personal.fullName}</h1>
      {items.length > 0 ? (
        <DocIconContactRow items={items} inline className="tpl-0-contacts" />
      ) : null}
    </header>
  );
}

function contrastMetaDetails(document: CvDocument) {
  const { personal } = document;
  const items: { label: string; value: string; href?: string }[] = [];

  if (
    isOptionalFieldVisible(personal, "driversLicense") &&
    personal.driversLicense?.trim()
  ) {
    items.push({
      label: "Driver's license",
      value: personal.driversLicense.trim(),
    });
  }

  if (isOptionalFieldVisible(personal, "website") && personal.portfolio?.trim()) {
    const link = resolveDocumentLink(personal.portfolio, { kind: "web" });
    items.push({
      label: "Website",
      value: link.label,
      href: link.href ?? undefined,
    });
  }

  if (isOptionalFieldVisible(personal, "linkedin") && personal.linkedin?.trim()) {
    const link = resolveDocumentLink(personal.linkedin, {
      kind: "web",
      platformHint: "linkedin",
      preferProfileLabel: true,
    });
    items.push({
      label: "LinkedIn",
      value: link.label,
      href: link.href ?? undefined,
    });
  }

  return items;
}

/**
 * Right rail: Personal details (meta), Skills (flat list), Qualities (squares).
 * Email / phone / address live in the header, not here.
 */
function buildContrastRailBlocks(document: CvDocument) {
  const state = createBlockBuilder();
  const meta = contrastMetaDetails(document);

  if (meta.length > 0) {
    pushBlock(state, {
      id: nextId(state, "contrast-personal-title"),
      kind: "section-title",
      region: "sidebar",
      keepWithNext: true,
      render: () => (
        <DocSectionHeading title="Personal details" variant="plain" />
      ),
    });
    meta.forEach((item, index) => {
      pushBlock(state, {
        id: nextId(state, `contrast-personal-${index}`),
        kind: "paragraph",
        region: "sidebar",
        render: () => <DocLabelValueList items={[item]} />,
      });
    });
  }

  const skillNames = groupedSkills(document)
    .filter((group) => !group.label.toLowerCase().includes("soft"))
    .flatMap((group) =>
      group.skills.map((skill) => skill.name).filter(Boolean),
    );

  if (skillNames.length > 0) {
    pushBlock(state, {
      id: nextId(state, "contrast-skills-title"),
      kind: "section-title",
      region: "sidebar",
      keepWithNext: true,
      render: () => <DocSectionHeading title="Skills" variant="plain" />,
    });
    skillNames.forEach((name, index) => {
      pushBlock(state, {
        id: nextId(state, `contrast-skill-${index}`),
        kind: "skills-group",
        region: "sidebar",
        render: () => <p className="tpl-skill-line">{name}</p>,
      });
    });
  }

  const qualities = softSkillItems(document);
  if (qualities.length > 0) {
    pushBlock(state, {
      id: nextId(state, "contrast-qualities-title"),
      kind: "section-title",
      region: "sidebar",
      keepWithNext: true,
      render: () => <DocSectionHeading title="Qualities" variant="plain" />,
    });
    qualities.forEach((quality, index) => {
      pushBlock(state, {
        id: nextId(state, `contrast-quality-${index}`),
        kind: "paragraph",
        region: "sidebar",
        render: () => <p className="tpl-quality-item">{quality}</p>,
      });
    });
  }

  return state.blocks;
}

/**
 * Contrast — visual parity with templates-layout/template-2.pdf.
 *
 * Internal id `tpl_0` is kept so existing saved CVs that selected
 * "Classic Sidebar (Plain)" keep rendering without migration.
 */
export const tpl0Definition: TemplateDefinition = {
  id: "tpl_0",
  slug: "tpl_0",
  name: "Contrast",
  description:
    "Dark charcoal header with a white two-column body — high-contrast layout matched to template-2.pdf.",
  version: 2,
  layoutFamily: "sidebar",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_0"),
  fonts: {
    body: "var(--font-inter), Inter, system-ui, sans-serif",
    heading: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  cssClass: "tpl-0",
  // template-2.pdf: 25pt margins on every edge.
  pagePaddingRatio: { x: 1, y: 1 },
  // Full-bleed header band on page one (~100pt including bottom gap).
  contentHeightReserve: 140,
  buildBlocks(document: CvDocument, ctx) {
    return [
      ...buildContrastRailBlocks(document),
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        entryStyle: "date-right",
        sectionHeadingVariant: "plain",
        preferTemplateLabels: true,
        summaryLabel: "Summary",
        educationLabel: "Education",
        experienceLabel: "Experience",
        referencesLabel: "References",
        certificationsLabel: "Certificates",
        achievementsLabel: "Achievements",
        projectsLabel: "PROJECTS",
        projectsAsEntries: true,
        sectionOrder: [
          "summary",
          "education",
          "experience",
          "references",
          "certifications",
          "achievements",
          "projects",
        ],
        includeSkills: false,
      }),
    ];
  },
  renderPage(props) {
    return renderSidebarTemplatePage({
      ...props,
      definition: tpl0Definition,
      sidebarVariant: "plain",
      withIcons: false,
      mainHeader:
        props.pageIndex === 0 ? (
          <ContrastHeader document={props.ctx.document} />
        ) : null,
    });
  },
};
