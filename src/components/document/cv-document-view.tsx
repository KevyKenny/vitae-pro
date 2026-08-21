"use client";

import { Fragment } from "react";
import { DocumentReadyMarker } from "@/components/document/document-ready";
import { renderContentBlock } from "@/components/document/pagination/build-cv-blocks";
import { useDocumentPages } from "@/components/document/pagination/use-document-pages";
import {
  documentStyleToCssVars,
  resolveCvDocumentStyle,
} from "@/components/document/resolve-document-style";
import type { CvDocumentViewProps } from "@/components/document/types";
import { resolveRendererKey } from "@/lib/templates/definitions";
import { cn } from "@/lib/utils";
import { normalizeCvDocument } from "@/lib/cvs/personal-info";

export function CvDocumentView({
  document: rawDocument,
  mode = "preview",
  customization,
  pageSize = "a4",
  shell = true,
  className,
  style,
}: CvDocumentViewProps) {
  const document = normalizeCvDocument(rawDocument);
  const rendererKey = resolveRendererKey({
    rendererKey: document.rendererKey,
    templateSlug: document.templateSlug,
    legacyTemplateId: document.templateId,
  });

  const {
    blockMap,
    regionPages,
    pageCount,
    ready,
    measureLayer,
    definition,
    renderCtx,
  } = useDocumentPages(document, customization, pageSize);

  const resolved = resolveCvDocumentStyle(
    document.templateId,
    customization,
    pageSize,
    definition,
  );
  const cssVars = documentStyleToCssVars(resolved);

  const pageStack = (
    <div className="doc-pages-stack">
      {Array.from({ length: pageCount }, (_, pageIndex) => (
        <Fragment key={`${definition.id}-${pageIndex}`}>
          {definition.renderPage({
            pageIndex,
            pageCount,
            regionPages,
            blockMap,
            ctx: { ...renderCtx, mode },
            mode,
          })}
        </Fragment>
      ))}
    </div>
  );

  if (!shell) {
    return (
      <div
        className={cn("doc-root", definition.cssClass, className)}
        style={{ ...cssVars, ...style }}
      >
        {measureLayer}
        <div className="doc-page-content">
          {[...blockMap.values()].map((block) => (
            <div key={block.id} data-block-id={block.id}>
              {renderContentBlock(block)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "doc-root",
        definition.cssClass,
        mode === "print" && "doc-root--print",
        resolved.pageSize === "a4" ? "doc-root--a4" : "doc-root--letter",
        className,
      )}
      style={{
        ...cssVars,
        // Each sheet paints its own paper, so the root stays clear and the
        // shell's stage colour fills the gutters between pages in either theme.
        background: "transparent",
        ...style,
      }}
      data-document-pages={pageCount}
      data-renderer-key={rendererKey}
    >
      {measureLayer}
      {pageStack}
      <DocumentReadyMarker
        key={`${rendererKey}-${pageCount}-${ready}-${blockMap.size}`}
        ready={ready}
      />
    </div>
  );
}
