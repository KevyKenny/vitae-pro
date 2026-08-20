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

export const tpl2Definition: TemplateDefinition = {
  id: "tpl_2",
  slug: "tpl_2",
  name: "Modern Single",
  description: "Single-column Poppins layout with contact icons and date-left entries.",
  version: 1,
  layoutFamily: "single-column",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_2"),
  fonts: {
    body: "var(--font-poppins), Poppins, system-ui, sans-serif",
    heading: "var(--font-poppins), Poppins, system-ui, sans-serif",
  },
  cssClass: "tpl-2",
  buildBlocks(document: CvDocument, ctx) {
    const state = createBlockBuilder();
    const { personal } = document;
    const contactItems = buildContactIconItems(personal);

    pushBlock(state, {
      id: nextId(state, "profile-name"),
      kind: "header",
      region: "main",
      keepWithNext: contactItems.length > 0,
      render: () => <h1 className="tpl-2-name">{personal.fullName}</h1>,
    });
    if (contactItems.length > 0) {
      pushBlock(state, {
        id: nextId(state, "profile-contacts"),
        kind: "header",
        region: "main",
        keepWithNext: true,
        render: () => <DocIconContactRow items={contactItems} />,
      });
    }

    return [
      ...state.blocks,
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        sectionOrder: [
          "summary",
          "education",
          "experience",
          "skills",
          "references",
          "certifications",
          "achievements",
          "projects",
        ],
      }),
    ];
  },
  renderPage(props) {
    return renderSingleColumnTemplatePage({
      ...props,
      definition: tpl2Definition,
    });
  },
};
