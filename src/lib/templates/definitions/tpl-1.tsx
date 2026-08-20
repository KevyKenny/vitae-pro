"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildMainSectionBlocks } from "@/components/document/templates/build-section-blocks";
import { renderSingleColumnTemplatePage } from "@/components/document/templates/render-pages";
import {
  buildContactIconItems,
  DocIconContactRow,
} from "@/components/document/templates/primitives";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
} from "@/components/document/templates/block-builder-utils";

/**
 * Professional — visual match for `templates-layout/template-0.pdf`
 * (OpenResume / react-pdf single-column: Roboto, sky accent, icon contacts).
 *
 * Keeps registry identity `tpl_1` / "Professional".
 */
export const tpl1Definition: TemplateDefinition = {
  id: "tpl_1",
  slug: "tpl_1",
  name: "Professional",
  description:
    "Single-column OpenResume-style layout with icon contacts and uppercase sections.",
  version: 1,
  layoutFamily: "single-column",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_1"),
  fonts: {
    body: "var(--font-roboto), Roboto, system-ui, sans-serif",
    heading: "var(--font-roboto), Roboto, system-ui, sans-serif",
  },
  cssClass: "tpl-1",
  // template-0.pdf: 30pt side margins, ~24pt top margin.
  pagePaddingRatio: { x: 0.9, y: 0.73 },
  buildBlocks(document: CvDocument, ctx) {
    const state = createBlockBuilder();
    const { personal } = document;
    const contactItems = buildContactIconItems(personal);

    // Centred name then a wrapped icon contact row — both measured so the
    // masthead participates in pagination instead of overflowing page one.
    pushBlock(state, {
      id: nextId(state, "profile-name"),
      kind: "header",
      region: "main",
      keepWithNext: true,
      render: () => <h1 className="tpl-1-name">{personal.fullName}</h1>,
    });

    if (contactItems.length > 0) {
      pushBlock(state, {
        id: nextId(state, "profile-contacts"),
        kind: "header",
        region: "main",
        keepWithNext: true,
        render: () => (
          <DocIconContactRow
            items={contactItems}
            inline
            className="tpl-1-contact"
          />
        ),
      });
    }

    return [
      ...state.blocks,
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        sectionHeadingVariant: "uppercase",
        entryStyle: "open-resume",
        preferTemplateLabels: true,
        summaryLabel: "Professional Summary",
        experienceLabel: "Work Experience",
        educationLabel: "Education",
        projectsLabel: "Projects",
        skillsLabel: "Skills",
        certificationsLabel: "Certificates",
        languagesLabel: "Languages",
        achievementsLabel: "Awards",
        referencesLabel: "References",
        compactSubjects: true,
        sectionOrder: [
          "summary",
          "experience",
          "education",
          "projects",
          "skills",
          "certifications",
          "languages",
          "achievements",
          "references",
        ],
      }),
    ];
  },
  renderPage(props) {
    return renderSingleColumnTemplatePage({
      ...props,
      definition: tpl1Definition,
    });
  },
};
