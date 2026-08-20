import type { ReactNode } from "react";
import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateCustomization } from "@/features/templates/types";
import type { ContentBlock } from "@/components/document/pagination/types";
import type { PageModel } from "@/components/document/pagination/types";
import type { DocumentPageSize, DocumentStyleVars } from "@/components/document/types";

export type TemplateRendererKey =
  | "tpl_default"
  | "tpl_0"
  | "tpl_1"
  | "tpl_2"
  | "tpl_3"
  | "tpl_4"
  | "tpl_5";

export type TemplateLayoutFamily =
  | "sidebar"
  | "single-column"
  | "form-two-column";

export type TemplateRegionId = "main" | "sidebar" | "left" | "right";

export type TemplateRenderContext = {
  document: CvDocument;
  resolved: DocumentStyleVars;
  customization: Partial<TemplateCustomization> | null | undefined;
  pageSize: DocumentPageSize;
  mode: "preview" | "print" | "export";
};

export type RegionPageModel = PageModel & {
  region: TemplateRegionId;
};

export type TemplateDefinition = {
  id: TemplateRendererKey;
  slug: string;
  name: string;
  description: string;
  version: number;
  layoutFamily: TemplateLayoutFamily;
  pageSize: DocumentPageSize;
  defaultCustomization: TemplateCustomization;
  fonts: { body: string; heading: string };
  cssClass: string;
  /**
   * Multipliers turning the `margins` customization into page padding.
   * Defaults to `{ x: 0.9, y: 1 }`; templates whose side margins differ from
   * their top margin override it.
   */
  pagePaddingRatio?: { x: number; y: number };
  /**
   * Height reserved for fixed page chrome rendered outside the block regions.
   * Applied conservatively to every page to prevent clipping.
   */
  contentHeightReserve?: number;
  /**
   * Extra height reserved on the final packed page of a region
   * (Default / Classic Sidebar decorative footer mark).
   */
  regionLastPageReserve?: Partial<Record<TemplateRegionId, number>>;
  /** Build measurable content blocks assigned to regions. */
  buildBlocks: (
    document: CvDocument,
    ctx: TemplateRenderContext,
  ) => ContentBlock[];
  /** Optional fixed sidebar/left rail (repeated each page, not packed). */
  renderFixedRegion?: (
    region: TemplateRegionId,
    ctx: TemplateRenderContext,
  ) => ReactNode;
  /** Render one page shell with region content. */
  renderPage: (props: {
    pageIndex: number;
    pageCount: number;
    regionPages: Map<TemplateRegionId, RegionPageModel[]>;
    blockMap: Map<string, ContentBlock>;
    ctx: TemplateRenderContext;
    mode: "preview" | "print" | "export";
  }) => ReactNode;
};

export const DEFAULT_RENDERER_KEY: TemplateRendererKey = "tpl_default";

export function isTemplateRendererKey(value: string): value is TemplateRendererKey {
  return (
    value === "tpl_default" ||
    value === "tpl_0" ||
    value === "tpl_1" ||
    value === "tpl_2" ||
    value === "tpl_3" ||
    value === "tpl_4" ||
    value === "tpl_5"
  );
}
