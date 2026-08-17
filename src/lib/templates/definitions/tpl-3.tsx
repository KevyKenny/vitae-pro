"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildMainSectionBlocks } from "@/components/document/templates/build-section-blocks";
import { renderFormTemplatePage } from "@/components/document/templates/render-pages";
import {
  buildPersonalLabelValues,
  DocLabelValueList,
  DocResumeBadge,
  DocSectionHeading,
} from "@/components/document/templates/primitives";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
} from "@/components/document/templates/block-builder-utils";

export const tpl3Definition: TemplateDefinition = {
  id: "tpl_3",
  slug: "tpl_3",
  name: "Resume Form",
  description: "Formal two-column resume with labeled personal details.",
  version: 1,
  layoutFamily: "form-two-column",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_3"),
  fonts: {
    body: "var(--font-inter), Inter, system-ui, sans-serif",
    heading: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  cssClass: "tpl-3",
  contentHeightReserve: 40,
  buildBlocks(document: CvDocument, ctx) {
    const state = createBlockBuilder();
    const personalItems = buildPersonalLabelValues(document);

    pushBlock(state, {
      id: nextId(state, "form-resume-badge"),
      kind: "header",
      region: "left",
      keepWithNext: true,
      render: () => <DocResumeBadge />,
    });
    pushBlock(state, {
      id: nextId(state, "form-personal-title"),
      kind: "section-title",
      region: "left",
      keepWithNext: personalItems.length > 0,
      render: () => (
        <DocSectionHeading title="Personal details" variant="form" />
      ),
    });
    personalItems.forEach((item, index) => {
      pushBlock(state, {
        id: nextId(state, `form-personal-${index}`),
        kind: "paragraph",
        region: "left",
        render: () => <DocLabelValueList items={[item]} />,
      });
    });

    return [
      ...state.blocks,
      ...buildMainSectionBlocks(document, ctx, {
        region: "main",
        sectionHeadingVariant: "form",
        sectionOrder: [
          "summary",
          "education",
          "experience",
          "skills",
          "references",
          "achievements",
          "certifications",
          "projects",
        ],
      }),
    ];
  },
  renderPage(props) {
    const { personal } = props.ctx.document;
    return renderFormTemplatePage({
      ...props,
      definition: tpl3Definition,
      leftPanel: null,
      title: `Resume ${personal.fullName}`,
    });
  },
};
