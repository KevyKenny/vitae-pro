"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { PAGE_DIMENSIONS } from "@/components/document/page-geometry";
import type { ContentBlock } from "@/components/document/pagination/types";
import type { DocumentPageSize } from "@/components/document/types";
import type { TemplateLayoutFamily } from "@/lib/templates/definitions/types";
import { cn } from "@/lib/utils";

type BlockMeasureLayerProps = {
  blocks: ContentBlock[];
  pageSize: DocumentPageSize;
  cssVars: CSSProperties;
  templateClass?: string;
  layoutFamily?: TemplateLayoutFamily;
  onMeasured: (heights: Map<string, number>, contentHeight: number) => void;
};

function measureContentHeight(pageEl: HTMLElement) {
  const styles = getComputedStyle(pageEl);
  const padY =
    parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  return Math.max(0, pageEl.clientHeight - padY);
}

/**
 * Ratio between painted and layout pixels. Preview shells scale the document
 * with a CSS transform, which scales every getBoundingClientRect reading while
 * leaving clientHeight in layout pixels — mixing the two would let far too much
 * content onto a page.
 */
function visualScale(pageEl: HTMLElement) {
  const painted = pageEl.getBoundingClientRect().height;
  const layout = pageEl.offsetHeight;
  if (painted <= 0 || layout <= 0) return 1;
  return painted / layout;
}

/**
 * Consumed height per block measured from flow position rather than the
 * element box, so collapsed and negative (full-bleed) margins are included.
 */
function measureColumn(
  column: HTMLElement | null,
  into: Map<string, number>,
  scale: number,
) {
  if (!column) return;

  const elements = Array.from(
    column.querySelectorAll<HTMLElement>(":scope > [data-block-id]"),
  );
  if (elements.length === 0) return;

  const columnStyles = getComputedStyle(column);
  const columnTop =
    column.getBoundingClientRect().top +
    parseFloat(columnStyles.paddingTop || "0") * scale;

  const edges: number[] = [columnTop];
  for (let i = 1; i < elements.length; i += 1) {
    edges.push(elements[i].getBoundingClientRect().top);
  }
  const last = elements[elements.length - 1].getBoundingClientRect();
  edges.push(last.bottom);

  elements.forEach((el, index) => {
    const blockId = el.dataset.blockId;
    if (!blockId) return;
    const height = Math.max(0, (edges[index + 1] - edges[index]) / scale);
    into.set(blockId, height);
  });
}

export function BlockMeasureLayer({
  blocks,
  pageSize,
  cssVars,
  templateClass,
  layoutFamily = "single-column",
  onMeasured,
}: BlockMeasureLayerProps) {
  const pageRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const onMeasuredRef = useRef(onMeasured);
  const [fontsReady, setFontsReady] = useState(
    () =>
      typeof document !== "undefined" && document.fonts.status === "loaded",
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    onMeasuredRef.current = onMeasured;
  }, [onMeasured]);

  useEffect(() => {
    if (fontsReady) return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [fontsReady]);

  useEffect(() => {
    if (!fontsReady || !pageRef.current) return;

    let frame = 0;
    const measure = () => {
      const pageEl = pageRef.current;
      if (!pageEl) return;

      const scale = visualScale(pageEl);
      const heights = new Map<string, number>();
      measureColumn(mainRef.current, heights, scale);
      measureColumn(railRef.current, heights, scale);

      onMeasuredRef.current(heights, measureContentHeight(pageEl));
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    scheduleMeasure();
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(pageRef.current);
    if (mainRef.current) ro.observe(mainRef.current);
    if (railRef.current) ro.observe(railRef.current);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [
    blocks,
    fontsReady,
    mounted,
    pageSize,
    templateClass,
    layoutFamily,
    cssVars,
  ]);

  const dims = PAGE_DIMENSIONS[pageSize];
  const mainBlocks = blocks.filter((b) => (b.region ?? "main") === "main");
  const railBlocks = blocks.filter((b) => {
    const region = b.region ?? "main";
    return region === "sidebar" || region === "left";
  });

  const renderList = (list: ContentBlock[]) =>
    list.map((block) => (
      <div key={block.id} data-block-id={block.id}>
        {block.render()}
      </div>
    ));

  if (!mounted) return null;

  // Measured off <body> so preview zoom, scroll containers and clipping shells
  // never distort the geometry the paginator packs against.
  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed -left-[9999px] top-0 opacity-0"
    >
      <div className={cn("doc-root", templateClass)} style={cssVars}>
        <article
          ref={pageRef}
          className={cn("doc-page tpl-page", templateClass)}
          style={{ width: dims.width, height: dims.height }}
        >
          {layoutFamily === "sidebar" ? (
            <div className="tpl-sidebar-layout">
              <aside
                ref={railRef}
                className="tpl-sidebar-panel tpl-sidebar-panel--blue"
              >
                {renderList(railBlocks)}
              </aside>
              <div ref={mainRef} className="tpl-main-column">
                {renderList(mainBlocks)}
              </div>
            </div>
          ) : layoutFamily === "form-two-column" ? (
            <div className="tpl-form-layout">
              <div ref={railRef} className="tpl-form-left">
                {renderList(railBlocks)}
              </div>
              <div ref={mainRef} className="tpl-form-right">
                {renderList(mainBlocks)}
              </div>
            </div>
          ) : (
            <div
              ref={mainRef}
              className="doc-page-content tpl-single-column"
            >
              {renderList(mainBlocks)}
            </div>
          )}
        </article>
      </div>
    </div>,
    document.body,
  );
}
