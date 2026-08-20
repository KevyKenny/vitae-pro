"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CvDocumentView } from "@/components/document";
import { PAGE_DIMENSIONS, pageSizeToPx } from "@/components/document/page-geometry";
import {
  getTemplateDefinition,
  resolveRendererKey,
} from "@/lib/templates/definitions";
import { kennedySitholeReferenceFixture } from "@/lib/templates/reference/kennedy-sithole.fixture";
import { cn } from "@/lib/utils";

type TemplateThumbnailProps = {
  templateId: string;
  className?: string;
};

/** Scaled first-page preview from the real CV renderer. */
export function TemplateThumbnail({
  templateId,
  className,
}: TemplateThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(200);

  const rendererKey = resolveRendererKey({ templateSlug: templateId });
  const definition = getTemplateDefinition(rendererKey);

  const document = useMemo(
    () => ({
      ...kennedySitholeReferenceFixture,
      rendererKey,
      templateSlug: templateId,
    }),
    [rendererKey, templateId],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(Math.max(120, el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pageWidth = pageSizeToPx("a4").widthPx;
  const scale = containerWidth / pageWidth;
  const cssWidth = PAGE_DIMENSIONS.a4.width;
  const cssHeight = PAGE_DIMENSIONS.a4.height;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[8px] border border-line bg-paper shadow-s",
        className,
      )}
      aria-hidden
    >
      <div
        className="pointer-events-none origin-top-left"
        style={{
          width: cssWidth,
          height: cssHeight,
          transform: `scale(${scale})`,
        }}
      >
        <CvDocumentView
          document={document}
          customization={definition.defaultCustomization}
          pageSize="a4"
          mode="preview"
        />
      </div>
    </div>
  );
}
