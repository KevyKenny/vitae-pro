"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CvDocumentView } from "@/components/document";
import { TemplateSelector } from "@/features/cv-editor/components/template-selector";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { cn } from "@/lib/utils";

/** Preview is always A4 (210 × 297 mm → aspect ≈ 1 : 1.414). */
export const CV_PAGE_SIZE = "a4" as const;
const PAGE_ASPECT = 1.414;
const BASE_PAGE_WIDTH = 420;
const PAGE_GAP = 16;
/** Click-to-zoom cycle: full → 70% → 50% → full (CSS scale only). */
const ZOOM_STEPS = [100, 70, 50] as const;

export function CVPreview({ className }: { className?: string }) {
  const { document, zoom, setZoom } = useEditor();
  const stageRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(BASE_PAGE_WIDTH);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      setStageWidth(Math.max(240, el.clientWidth - 8));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const zoomScale =
    ZOOM_STEPS.includes(zoom as (typeof ZOOM_STEPS)[number]) ? zoom : 100;
  const scale = zoomScale / 100;
  const pageWidth = stageWidth;
  const sheetHeight = Math.round(pageWidth * PAGE_ASPECT);
  const fontSize = `${0.62 * (pageWidth / BASE_PAGE_WIDTH)}rem`;
  const pagePadX = Math.round(28 * (pageWidth / BASE_PAGE_WIDTH));
  const pagePadY = Math.round(32 * (pageWidth / BASE_PAGE_WIDTH));

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setContentHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [document, pageWidth, fontSize, pagePadX, pagePadY]);

  const pageCount = Math.max(1, Math.ceil((contentHeight || sheetHeight) / sheetHeight));
  const stackHeight =
    pageCount * sheetHeight + Math.max(0, pageCount - 1) * PAGE_GAP;

  const cycleZoom = () => {
    const index = ZOOM_STEPS.indexOf(
      zoomScale as (typeof ZOOM_STEPS)[number],
    );
    const next = ZOOM_STEPS[(index + 1) % ZOOM_STEPS.length];
    setZoom(next);
  };

  const sheetClass = cn(
    "relative overflow-hidden bg-surface shadow-m",
    document.templateId === "creative" && "border-t-4 border-t-gold",
    document.templateId === "executive" && "border-l-4 border-l-emerald",
  );

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col bg-surface", className)}>
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-3 py-2.5 sm:px-4">
        <h2 className="shrink-0 font-sans text-[0.88rem] font-semibold text-ink">
          Preview
        </h2>
        <TemplateSelector compact className="min-w-0 flex-1" />
        {pageCount > 1 ? (
          <p className="shrink-0 text-[0.72rem] tabular-nums text-ink-faint">
            {pageCount} pages
          </p>
        ) : null}
      </div>

      <div
        ref={stageRef}
        className="min-h-0 flex-1 overflow-auto bg-paper-dim px-1 py-1 sm:py-2"
      >
        {/* Off-screen measure: full content height at the live page width */}
        <div
          ref={measureRef}
          aria-hidden
          className="pointer-events-none absolute -left-[9999px] top-0 opacity-0"
          style={{
            width: pageWidth,
            padding: `${pagePadY}px ${pagePadX}px`,
            fontSize,
          }}
        >
          <CvDocumentView document={document} mode="preview" shell={false} />
        </div>

        <div
          className="mx-auto"
          style={{
            width: Math.round(pageWidth * scale),
            height: Math.round(stackHeight * scale),
          }}
        >
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`CV preview at ${zoomScale}% — ${pageCount} A4 page${pageCount === 1 ? "" : "s"} — click to zoom`}
            title={`Click to zoom (${zoomScale}%)`}
            onClick={cycleZoom}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cycleZoom();
              }
            }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1, scale }}
            transition={{ duration: 0.22 }}
            className={cn(
              "origin-top-left outline-none focus-visible:ring-2 focus-visible:ring-emerald/40",
              zoomScale === 50 ? "cursor-zoom-in" : "cursor-zoom-out",
            )}
            style={{ width: pageWidth }}
          >
            <div className="flex flex-col" style={{ gap: PAGE_GAP }}>
              {Array.from({ length: pageCount }, (_, pageIndex) => (
                <div
                  key={pageIndex}
                  className={sheetClass}
                  style={{ width: pageWidth, height: sheetHeight }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -pageIndex * sheetHeight,
                      left: 0,
                      width: pageWidth,
                      padding: `${pagePadY}px ${pagePadX}px`,
                      fontSize,
                    }}
                  >
                    <CvDocumentView document={document} mode="preview" shell={false} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
