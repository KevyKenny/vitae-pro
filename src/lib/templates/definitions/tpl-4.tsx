"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildMainSectionBlocks } from "@/components/document/templates/build-section-blocks";
import { buildSidebarBlocks } from "@/components/document/templates/sidebar-layout";
import { renderSidebarTemplatePage } from "@/components/document/templates/render-pages";

export const tpl4Definition: TemplateDefinition = {
  id: "tpl_4",
  slug: "tpl_4",
  name: "Red Sidebar",
  description: "Red-accent sidebar with icon contact details.",
  version: 1,
  layoutFamily: "sidebar",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_4"),
  fonts: {
    body: "var(--font-inter), Inter, system-ui, sans-serif",
    heading: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  cssClass: "tpl-4",
  contentHeightReserve: 44,
  buildBlocks(document: CvDocument, ctx) {
    return [
      ...buildSidebarBlocks(document, {
        withHeaderBand: false,
        withIcons: true,
      }),
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        entryStyle: "date-right",
        sectionHeadingVariant: "plain",
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
    const { personal } = props.ctx.document;
    const mainHeader =
      props.pageIndex === 0 ? (
        <header className="tpl-4-main-header">
          <h1 className="tpl-4-name">{personal.fullName}</h1>
        </header>
      ) : null;

    return renderSidebarTemplatePage({
      ...props,
      definition: tpl4Definition,
      sidebarVariant: "red",
      withIcons: true,
      mainHeader,
    });
  },
};
