import type { DocumentPageSize } from "@/components/document/types";

/** CSS dimensions for each paper size — single source of truth for layout. */
export const PAGE_DIMENSIONS: Record<
  DocumentPageSize,
  { width: string; height: string; widthMm: number; heightMm: number }
> = {
  a4: {
    width: "210mm",
    height: "297mm",
    widthMm: 210,
    heightMm: 297,
  },
  letter: {
    width: "8.5in",
    height: "11in",
    widthMm: 215.9,
    heightMm: 279.4,
  },
};

/** Approximate px at 96 CSS dpi — used by packer unit tests only. */
export function pageSizeToPx(pageSize: DocumentPageSize): {
  widthPx: number;
  heightPx: number;
} {
  const spec = PAGE_DIMENSIONS[pageSize];
  if (pageSize === "letter") {
    return { widthPx: 816, heightPx: 1056 };
  }
  const mmToPx = 96 / 25.4;
  return {
    widthPx: Math.round(spec.widthMm * mmToPx),
    heightPx: Math.round(spec.heightMm * mmToPx),
  };
}

/** Usable vertical space inside a page after padding (box-sizing: border-box). */
export function contentHeightBudget(
  pageSize: DocumentPageSize,
  padY: number,
): number {
  const { heightPx } = pageSizeToPx(pageSize);
  return Math.max(0, heightPx - padY * 2);
}

export const PREVIEW_PAGE_GAP_PX = 16;
