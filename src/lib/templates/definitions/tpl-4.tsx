"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildMainSectionBlocks } from "@/components/document/templates/build-section-blocks";
import { buildSidebarBlocks } from "@/components/document/templates/sidebar-layout";
import { renderSidebarTemplatePage } from "@/components/document/templates/render-pages";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
} from "@/components/document/templates/block-builder-utils";

export const tpl4Definition: TemplateDefinition = {
  id: "tpl_4",
  slug: "tpl_4",
  name: "Split",
  description:
    "Inset pale-red rail with a 25pt name in the main column, matching template-4.pdf.",
  version: 1,
  layoutFamily: "sidebar",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_4"),
  fonts: {
    body: "var(--font-inter), Inter, system-ui, sans-serif",
    heading: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  cssClass: "tpl-4",
  // template-4.pdf: 30pt page inset; the pale rail bleeds only vertically.
  pagePaddingRatio: { x: 1, y: 1 },
  buildBlocks(document: CvDocument, ctx) {
    const state = createBlockBuilder();
    const name = document.personal.fullName?.trim();
    if (name) {
      pushBlock(state, {
        id: nextId(state, "red-name"),
        kind: "header",
        region: "main",
        keepWithNext: true,
        render: () => (
          <header className="tpl-4-main-header">
            <h1 className="tpl-4-name">{name}</h1>
          </header>
        ),
      });
    }

    return [
      ...buildSidebarBlocks(document, {
        withHeaderBand: false,
        withIcons: true,
        flatSkillList: true,
      }),
      ...state.blocks,
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        entryStyle: "date-right",
        sectionHeadingVariant: "plain",
        preferTemplateLabels: true,
        summaryLabel: "Summary",
        experienceLabel: "Experience",
        certificationsLabel: "Certificates",
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
      definition: tpl4Definition,
      sidebarVariant: "red",
      withIcons: true,
    });
  },
};
