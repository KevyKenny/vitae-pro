"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildTimelineBlocks } from "@/components/document/templates/build-timeline-blocks";
import { WholeWords } from "@/components/document/templates/whole-words";
import { renderSingleColumnTemplatePage } from "@/components/document/templates/render-pages";
import {
  buildPersonalLabelValues,
  DocLabelValueList,
} from "@/components/document/templates/primitives";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
  sectionVisible,
} from "@/components/document/templates/block-builder-utils";

export const tpl3Definition: TemplateDefinition = {
  id: "tpl_3",
  slug: "tpl_3",
  name: "Formal",
  description:
    "Centered Resume title, labeled personal details, and a 175pt date rail matching template-5.pdf.",
  version: 1,
  layoutFamily: "single-column",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_3"),
  fonts: {
    body: "var(--font-inter), Inter, system-ui, sans-serif",
    heading: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  cssClass: "tpl-3",
  // template-5.pdf: 30pt margins on every edge.
  pagePaddingRatio: { x: 1, y: 1 },
  buildBlocks(document: CvDocument) {
    const state = createBlockBuilder();
    const personalItems = buildPersonalLabelValues(document);
    const summary =
      sectionVisible(document, "summary") && document.summary?.trim()
        ? document.summary.trim()
        : "";

    pushBlock(state, {
      id: nextId(state, "form-header"),
      kind: "header",
      region: "main",
      keepWithNext: true,
      render: () => (
        <header className="tpl-3-header">
          <h1 className="tpl-3-title">Resume</h1>
        </header>
      ),
    });

    if (personalItems.length > 0) {
      pushBlock(state, {
        id: nextId(state, "form-personal-title"),
        kind: "section-title",
        region: "main",
        keepWithNext: true,
        render: () => <h2 className="tpl-3-heading">Personal details</h2>,
      });
      personalItems.forEach((item, index) => {
        pushBlock(state, {
          id: nextId(state, `form-personal-${index}`),
          kind: "paragraph",
          region: "main",
          keepWithNext: index < personalItems.length - 1 || Boolean(summary),
          render: () => <DocLabelValueList items={[item]} />,
        });
      });
    }

    if (summary) {
      pushBlock(state, {
        id: nextId(state, "form-summary-title"),
        kind: "section-title",
        region: "main",
        keepWithNext: true,
        render: () => <h2 className="tpl-3-heading">Summary</h2>,
      });
      pushBlock(state, {
        id: nextId(state, "form-summary"),
        kind: "paragraph",
        region: "main",
        render: () => (
          <p className="tpl-3-summary">
            <WholeWords text={summary} />
          </p>
        ),
      });
    }

    return [
      ...state.blocks,
      ...buildTimelineBlocks(document, {
        preferTemplateLabels: true,
        showMarkers: false,
        skillsAsGrid: true,
        undatedFullWidth: true,
        datedProjects: true,
        sectionOrder: [
          "education",
          "experience",
          "skills",
          "references",
          "qualities",
          "certifications",
          "languages",
          "achievements",
          "projects",
        ],
      }),
    ];
  },
  renderPage(props) {
    return renderSingleColumnTemplatePage({
      ...props,
      definition: tpl3Definition,
    });
  },
};
