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
  // template-default.pdf: ~15pt side inset, ~25pt top/bottom on the main column.
  pagePaddingRatio: { x: 0.61, y: 1 },
  // Quarter-circle footer mark on the last rail page (~4.2rem).
  regionLastPageReserve: { sidebar: 68 },
  buildBlocks(document: CvDocument, ctx) {
    return [
      ...buildSidebarBlocks(document, {
        withHeaderBand: true,
        withIcons: true,
        skillGroupLabel: (group) => {
          if (group.id === "technical") return "Programming Languages";
          if (group.id === "frameworks") return "Frameworks";
          if (group.id === "tools") return "Tools";
          return group.label;
        },
      }),
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        entryStyle: "date-right",
        sectionHeadingVariant: "plain",
        preferTemplateLabels: true,
        summaryLabel: "Professional Summary",
        experienceLabel: "Employment",
        certificationsLabel: "Certificates",
        achievementsLabel: "Achievements",
        projectsLabel: "PROJECTS",
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
