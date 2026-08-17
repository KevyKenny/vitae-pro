"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateCustomization } from "@/features/templates/types";
import {
  documentStyleToCssVars,
  resolveCvDocumentStyle,
} from "@/components/document/resolve-document-style";
import { contentHeightBudget } from "@/components/document/page-geometry";
import { BlockMeasureLayer } from "@/components/document/pagination/block-measure-layer";
import { packBlocksByRegion } from "@/components/document/pagination/pack-regions";
import type { ContentBlock } from "@/components/document/pagination/types";
import type { DocumentPageSize } from "@/components/document/types";
import {
  getTemplateDefinition,
  resolveRendererKey,
} from "@/lib/templates/definitions";
import type {
  RegionPageModel,
  TemplateRegionId,
  TemplateRenderContext,
} from "@/lib/templates/definitions/types";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";

function mapsEqual(a: Map<string, number>, b: Map<string, number>) {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (Math.abs((b.get(key) ?? -1) - value) > 0.5) return false;
  }
  return true;
}

function mergeCustomization(
  definitionKey: ReturnType<typeof resolveRendererKey>,
  customization?: Partial<TemplateCustomization> | null,
): TemplateCustomization {
  const defaults = createTemplateDefaultCustomization(definitionKey);
  if (!customization) return defaults;
  return { ...defaults, ...customization, templateId: definitionKey };
}

export function useDocumentPages(
  document: CvDocument,
  customization: Partial<TemplateCustomization> | null | undefined,
  pageSize: DocumentPageSize = "a4",
) {
  const rendererKey = resolveRendererKey({
    rendererKey: document.rendererKey,
    templateSlug: document.templateSlug,
    legacyTemplateId: document.templateId,
  });
  const definition = getTemplateDefinition(rendererKey);
  const mergedCustomization = useMemo(
    () => mergeCustomization(rendererKey, customization),
    [rendererKey, customization],
  );

  const resolved = useMemo(
    () =>
      resolveCvDocumentStyle(
        document.templateId,
        mergedCustomization,
        pageSize,
        definition,
      ),
    [document.templateId, mergedCustomization, pageSize, definition],
  );
  const cssVars = useMemo(() => documentStyleToCssVars(resolved), [resolved]);

  const renderCtx: TemplateRenderContext = useMemo(
    () => ({
      document,
      resolved,
      customization: mergedCustomization,
      pageSize,
      mode: "preview",
    }),
    [document, resolved, mergedCustomization, pageSize],
  );

  const blocks = useMemo(
    () => definition.buildBlocks(document, renderCtx),
    [definition, document, renderCtx],
  );

  /** Regions come from the blocks themselves so each rail paginates. */
  const regions: TemplateRegionId[] = useMemo(() => {
    const found = new Set<TemplateRegionId>(["main"]);
    for (const block of blocks) {
      if (block.region) found.add(block.region);
    }
    return [...found];
  }, [blocks]);

  const contentHeightReserve = definition.contentHeightReserve ?? 0;
  const fallbackBudget = Math.max(
    0,
    contentHeightBudget(pageSize, resolved.padY) - contentHeightReserve,
  );

  const measureSignature = useMemo(
    () =>
      [
        rendererKey,
        blocks.map((b) => b.id).join("|"),
        JSON.stringify(cssVars),
        pageSize,
        resolved.padY,
        definition.cssClass,
        contentHeightReserve,
      ].join("::"),
    [
      rendererKey,
      blocks,
      cssVars,
      pageSize,
      resolved.padY,
      definition.cssClass,
      contentHeightReserve,
    ],
  );

  const [heights, setHeights] = useState<Map<string, number>>(new Map());
  const [measuredContentHeight, setMeasuredContentHeight] =
    useState(fallbackBudget);
  const [ready, setReady] = useState(false);
  const lastSignatureRef = useRef(measureSignature);

  useEffect(() => {
    if (lastSignatureRef.current !== measureSignature) {
      lastSignatureRef.current = measureSignature;
      setReady(false);
      setHeights(new Map());
      setMeasuredContentHeight(fallbackBudget);
    }
  }, [measureSignature, fallbackBudget]);

  const handleMeasured = useCallback(
    (nextHeights: Map<string, number>, contentHeight: number) => {
      setHeights((prev) => {
        if (mapsEqual(prev, nextHeights)) return prev;
        return nextHeights;
      });
      setMeasuredContentHeight((prev) => {
        const next = Math.max(
          0,
          contentHeight
            ? contentHeight - contentHeightReserve
            : fallbackBudget,
        );
        return Math.abs(prev - next) < 0.5 ? prev : next;
      });
      setReady(true);
    },
    [contentHeightReserve, fallbackBudget],
  );

  const blockMap = useMemo(() => {
    const map = new Map<string, ContentBlock>();
    for (const block of blocks) map.set(block.id, block);
    return map;
  }, [blocks]);

  const { regionPages, pageCount } = useMemo(() => {
    if (!ready || blocks.length === 0) {
      const fallback: RegionPageModel[] = [
        { index: 0, blockIds: blocks.map((b) => b.id), region: "main" },
      ];
      return {
        regionPages: new Map<TemplateRegionId, RegionPageModel[]>([
          ["main", fallback],
        ]),
        pageCount: 1,
      };
    }

    const measured = blocks.map((block) => ({
      ...block,
      height: heights.get(block.id) ?? 0,
    }));

    return packBlocksByRegion(measured, measuredContentHeight, regions, {
      lastPageReserveByRegion: definition.regionLastPageReserve,
    });
  }, [
    blocks,
    definition.regionLastPageReserve,
    heights,
    measuredContentHeight,
    ready,
    regions,
  ]);

  const measureLayer =
    blocks.length > 0 ? (
      <BlockMeasureLayer
        key={measureSignature}
        blocks={blocks}
        pageSize={pageSize}
        cssVars={cssVars}
        templateClass={definition.cssClass}
        layoutFamily={definition.layoutFamily}
        onMeasured={handleMeasured}
      />
    ) : null;

  return {
    blocks,
    blockMap,
    regionPages,
    pageCount,
    resolved,
    cssVars,
    ready: blocks.length === 0 ? true : ready,
    measureLayer,
    contentHeight: measuredContentHeight,
    definition,
    renderCtx,
    rendererKey,
  };
}
