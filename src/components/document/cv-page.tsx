import type { ReactNode } from "react";
import type { EditorTemplateId } from "@/features/cv-editor/types";
import { PAGE_DIMENSIONS } from "@/components/document/page-geometry";
import type { DocumentPageSize, DocumentRenderMode } from "@/components/document/types";
import { cn } from "@/lib/utils";

export type CvPageProps = {
  pageIndex: number;
  pageCount: number;
  pageSize: DocumentPageSize;
  templateId?: EditorTemplateId | string;
  showSidebar?: boolean;
  mode?: DocumentRenderMode;
  className?: string;
  children: ReactNode;
};

export function CvPage({
  pageIndex,
  pageCount,
  pageSize,
  templateId = "modern",
  showSidebar = false,
  mode = "preview",
  className,
  children,
}: CvPageProps) {
  const dims = PAGE_DIMENSIONS[pageSize];

  return (
    <article
      className={cn(
        "doc-page",
        pageSize === "letter" && "doc-page--letter",
        templateId === "creative" && "doc-template-creative",
        templateId === "executive" && "doc-template-executive",
        showSidebar && "doc-layout-sidebar",
        pageIndex > 0 && "doc-page--continued",
        className,
      )}
      style={{ width: dims.width, height: dims.height }}
      data-page-index={pageIndex}
      data-page-count={pageCount}
      aria-label={`Page ${pageIndex + 1} of ${pageCount}`}
    >
      <div
        className={cn(
          "doc-page-content",
          showSidebar && "doc-page-content--sidebar",
        )}
        data-render-mode={mode}
      >
        {children}
      </div>
    </article>
  );
}
