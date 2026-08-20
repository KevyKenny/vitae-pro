"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildMainSectionBlocks } from "@/components/document/templates/build-section-blocks";
import { buildSidebarBlocks } from "@/components/document/templates/sidebar-layout";
import { renderSidebarTemplatePage } from "@/components/document/templates/render-pages";

export const tpl0Definition: TemplateDefinition = {
  id: "tpl_0",
  slug: "tpl_0",
  name: "Classic Sidebar (Plain)",
  description: "Clean sidebar layout without icons — Roboto typography.",
  version: 1,
  layoutFamily: "sidebar",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_0"),
  fonts: {
    body: "var(--font-roboto), Roboto, system-ui, sans-serif",
    heading: "var(--font-roboto), Roboto, system-ui, sans-serif",
  },
  cssClass: "tpl-0",
  buildBlocks(document: CvDocument, ctx) {
    return [
      ...buildSidebarBlocks(document, {
        withHeaderBand: true,
        withIcons: false,
      }),
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        entryStyle: "date-right",
        sectionHeadingVariant: "plain",
        summaryLabel: "Professional Summary",
        experienceLabel: "Employment",
        certificationsLabel: "Certificates",
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
    });
  },
};
