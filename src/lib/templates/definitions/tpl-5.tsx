"use client";

import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";
import { buildTimelineBlocks } from "@/components/document/templates/build-timeline-blocks";
import { renderSingleColumnTemplatePage } from "@/components/document/templates/render-pages";
import {
  buildContactIconItems,
  DocIconContactRow,
} from "@/components/document/templates/primitives";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
  sectionVisible,
} from "@/components/document/templates/block-builder-utils";

export const tpl5Definition: TemplateDefinition = {
  id: "tpl_5",
  slug: "tpl_5",
  name: "Resume Form (Compact)",
  description:
    "Compact timeline resume with a full-width intro band and dated left rail.",
  version: 1,
  layoutFamily: "single-column",
  pageSize: "a4",
  defaultCustomization: createTemplateDefaultCustomization("tpl_5"),
  fonts: {
    body: "var(--font-montserrat), Montserrat, system-ui, sans-serif",
    heading: "var(--font-montserrat), Montserrat, system-ui, sans-serif",
  },
  cssClass: "tpl-5",
  // template-1.pdf: 20pt margins on every edge.
  pagePaddingRatio: { x: 1, y: 1 },
  buildBlocks(document: CvDocument) {
    const state = createBlockBuilder();
    const { personal } = document;
    const contactItems = buildContactIconItems(personal);
    const summary =
      sectionVisible(document, "summary") && document.summary?.trim()
        ? document.summary.trim()
        : "";

    // Full-bleed intro band: name, wrapped icon contacts and the summary all
    // sit on the grey panel that the reference runs to the page edges.
    pushBlock(state, {
      id: nextId(state, "tl-band"),
      kind: "header",
      region: "main",
      keepWithNext: true,
      render: () => (
        <header className="tpl-5-band">
          <h1 className="tpl-5-name">{personal.fullName}</h1>
          {contactItems.length > 0 ? (
            <DocIconContactRow
              items={contactItems}
              inline
              className="tpl-5-contact"
            />
          ) : null}
          {summary ? <p className="tpl-5-summary">{summary}</p> : null}
        </header>
      ),
    });

    return [
      ...state.blocks,
      ...buildTimelineBlocks(document, {
        preferTemplateLabels: true,
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
      definition: tpl5Definition,
      pageChrome: <span className="tpl-5-rule" aria-hidden />,
    });
  },
};
