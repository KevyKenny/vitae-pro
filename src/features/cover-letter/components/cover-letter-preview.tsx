"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CoverLetterDocumentView } from "@/components/document";
import { PAGE_DIMENSIONS } from "@/components/document/page-geometry";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { letterTemplates } from "@/mocks/cover-letter-builder";
import { cn } from "@/lib/utils";

const ZOOM_STEPS = [100, 70, 50] as const;

export function CoverLetterPreview({ className }: { className?: string }) {
  const { document, zoom, setZoom, setTemplate } = useCoverLetter();
  const stageRef = useRef<HTMLDivElement>(null);
  const docRootRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(480);
  const [canonicalWidthPx, setCanonicalWidthPx] = useState(794);
  const [stackHeightPx, setStackHeightPx] = useState(1123);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageWidth(Math.max(240, el.clientWidth - 16));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const node = docRootRef.current;
    if (!node) return;

    const sync = () => {
      const firstPage = node.querySelector(".doc-page") as HTMLElement | null;
      if (firstPage && firstPage.offsetWidth > 0) {
        setCanonicalWidthPx(firstPage.offsetWidth);
      }
      const stack = node.querySelector(".doc-pages-stack") as HTMLElement | null;
      if (stack && stack.offsetHeight > 0) {
        setStackHeightPx(stack.offsetHeight);
      }
      const root = node.querySelector(
        "[data-document-pages]",
      ) as HTMLElement | null;
      setPageCount(Number(root?.dataset.documentPages) || 1);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    return () => ro.disconnect();
  }, [document]);

  const zoomScale = ZOOM_STEPS.includes(zoom as (typeof ZOOM_STEPS)[number])
    ? zoom
    : 100;
  const userScale = zoomScale / 100;
  const fitScale = Math.min(1, Math.max(200, stageWidth) / canonicalWidthPx);
  const effectiveScale = fitScale * userScale;
  const scaledWidth = Math.round(canonicalWidthPx * effectiveScale);
  const scaledHeight = Math.round(stackHeightPx * effectiveScale);

  const cycleZoom = () => {
    const index = ZOOM_STEPS.indexOf(zoomScale as (typeof ZOOM_STEPS)[number]);
    setZoom(ZOOM_STEPS[(index + 1) % ZOOM_STEPS.length]);
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col bg-paper-dim",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-surface px-3 py-2.5 sm:px-4">
        <h2 className="shrink-0 font-sans text-[0.88rem] font-semibold text-ink">
          Preview
        </h2>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {letterTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={cn(
                "h-8 shrink-0 rounded-full border px-3 text-[0.72rem] font-semibold transition-colors",
                document.templateId === t.id
                  ? "border-emerald bg-emerald text-paper"
                  : "border-line-strong text-ink-soft hover:border-emerald/40",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
        {pageCount > 1 ? (
          <p className="shrink-0 text-[0.72rem] tabular-nums text-ink-faint">
            {pageCount} pages
          </p>
        ) : null}
      </div>

      <div
        ref={stageRef}
        className="min-h-0 flex-1 overflow-auto bg-paper-dim px-2 py-2 pb-mobile-bar sm:py-3 lg:pb-3"
      >
        <div
          className="mx-auto overflow-hidden"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`Cover letter preview at ${zoomScale}% — ${pageCount} A4 page${pageCount === 1 ? "" : "s"} — click to zoom`}
            title={`Click to zoom (${zoomScale}%)`}
            onClick={cycleZoom}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cycleZoom();
              }
            }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            className={cn(
              "origin-top-left outline-none focus-visible:ring-2 focus-visible:ring-emerald/40",
              zoomScale === 50 ? "cursor-zoom-in" : "cursor-zoom-out",
            )}
            style={{
              width: PAGE_DIMENSIONS.a4.width,
              transform: `scale(${effectiveScale})`,
              transformOrigin: "top left",
            }}
          >
            <div ref={docRootRef}>
              <CoverLetterDocumentView document={document} mode="preview" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
