"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildMainSectionBlocks } from "@/components/document/templates/build-section-blocks";
import { buildSidebarBlocks } from "@/components/document/templates/sidebar-layout";
import { renderSidebarTemplatePage } from "@/components/document/templates/render-pages";

export const tplDefaultDefinition: TemplateDefinition = {
  id: "tpl_default",
  slug: "tpl_default",
  name: "Classic Sidebar",
  description: "Blue sidebar with grouped skills — ideal for technical roles.",
  version: 1,
  layoutFamily: "sidebar",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_default"),
  fonts: {
    body: "var(--font-inter), Inter, system-ui, sans-serif",
    heading: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  cssClass: "tpl-default",
  // Matches .tpl-sidebar-footer-mark height (2.4rem) reserved only on the last rail page.
  regionLastPageReserve: { sidebar: 40 },
  buildBlocks(document: CvDocument, ctx) {
    return [
      ...buildSidebarBlocks(document, {
        withHeaderBand: true,
        withIcons: true,
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
      definition: tplDefaultDefinition,
      sidebarVariant: "blue",
      withIcons: true,
      sidebarFooterMark: true,
    });
  },
};
