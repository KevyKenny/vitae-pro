"use client";

import { CvPage } from "@/components/document/cv-page";
import { renderContentBlock } from "@/components/document/pagination/build-cv-blocks";
import type { ContentBlock } from "@/components/document/pagination/types";
import { regionBlockIdsForPage } from "@/components/document/pagination/pack-regions";
import type {
  RegionPageModel,
  TemplateDefinition,
  TemplateRegionId,
  TemplateRenderContext,
} from "@/lib/templates/definitions/types";
import {
  sidebarPanelClass,
} from "@/components/document/templates/sidebar-layout";
import { cn } from "@/lib/utils";

function renderBlocks(
  blockMap: Map<string, ContentBlock>,
  blockIds: string[],
) {
  return blockIds.map((blockId) => {
    const block = blockMap.get(blockId);
    if (!block) return null;
    return (
      <div key={blockId} data-block-id={blockId}>
        {renderContentBlock(block)}
      </div>
    );
  });
}

export function renderSidebarTemplatePage(props: {
  definition: TemplateDefinition;
  pageIndex: number;
  pageCount: number;
  regionPages: Map<TemplateRegionId, RegionPageModel[]>;
  blockMap: Map<string, ContentBlock>;
  ctx: TemplateRenderContext;
  mode: "preview" | "print" | "export";
  sidebarVariant?: "blue" | "red" | "plain";
  withIcons?: boolean;
  mainHeader?: React.ReactNode;
  /** Decorative block closing the rail on the final page. */
  sidebarFooterMark?: boolean;
}) {
  const {
    definition,
    pageIndex,
    pageCount,
    regionPages,
    blockMap,
    ctx,
    mode,
    sidebarVariant = "blue",
    withIcons: _withIcons = true,
    mainHeader,
    sidebarFooterMark = false,
  } = props;

  void _withIcons;

  const mainIds = regionBlockIdsForPage(regionPages, "main", pageIndex);
  const sidebarIds = regionBlockIdsForPage(regionPages, "sidebar", pageIndex);
  const hasSidebarBlocks = (regionPages.get("sidebar")?.length ?? 0) > 0;
  const isLastPage = pageIndex === pageCount - 1;

  return (
    <CvPage
      pageIndex={pageIndex}
      pageCount={pageCount}
      pageSize={ctx.pageSize}
      templateId={definition.id}
      mode={mode}
      className={cn("tpl-page", definition.cssClass)}
    >
      {mainHeader}
      <div className="tpl-sidebar-layout">
        {hasSidebarBlocks ? (
          <aside className={sidebarPanelClass(sidebarVariant)}>
            {renderBlocks(blockMap, sidebarIds)}
            {sidebarFooterMark && isLastPage ? (
              <div className="tpl-sidebar-footer-mark" />
            ) : null}
          </aside>
        ) : (
          <aside
            className={sidebarPanelClass(sidebarVariant)}
            aria-hidden
          />
        )}
        <div className="tpl-main-column">{renderBlocks(blockMap, mainIds)}</div>
      </div>
    </CvPage>
  );
}

export function renderSingleColumnTemplatePage(props: {
  definition: TemplateDefinition;
  pageIndex: number;
  pageCount: number;
  regionPages: Map<TemplateRegionId, RegionPageModel[]>;
  blockMap: Map<string, ContentBlock>;
  ctx: TemplateRenderContext;
  mode: "preview" | "print" | "export";
  header?: React.ReactNode;
  /** Decoration repeated on every page, behind the block flow. */
  pageChrome?: React.ReactNode;
}) {
  const {
    definition,
    pageIndex,
    pageCount,
    regionPages,
    blockMap,
    ctx,
    mode,
    header,
    pageChrome,
  } = props;

  const mainIds = regionBlockIdsForPage(regionPages, "main", pageIndex);

  return (
    <CvPage
      pageIndex={pageIndex}
      pageCount={pageCount}
      pageSize={ctx.pageSize}
      templateId={definition.id}
      mode={mode}
      className={cn("tpl-page", definition.cssClass)}
    >
      {pageChrome}
      {pageIndex === 0 && header ? header : null}
      <div className="tpl-single-column">{renderBlocks(blockMap, mainIds)}</div>
    </CvPage>
  );
}

export function renderFormTemplatePage(props: {
  definition: TemplateDefinition;
  pageIndex: number;
  pageCount: number;
  regionPages: Map<TemplateRegionId, RegionPageModel[]>;
  blockMap: Map<string, ContentBlock>;
  ctx: TemplateRenderContext;
  mode: "preview" | "print" | "export";
  leftPanel: React.ReactNode | null;
  title?: string;
}) {
  const {
    definition,
    pageIndex,
    pageCount,
    regionPages,
    blockMap,
    ctx,
    mode,
    leftPanel,
    title,
  } = props;

  const mainIds = regionBlockIdsForPage(regionPages, "main", pageIndex);
  const leftIds = regionBlockIdsForPage(regionPages, "left", pageIndex);
  const hasPackedLeftContent = leftIds.length > 0;
  const showLegacyLeftPanel =
    pageIndex === 0 && Boolean(leftPanel) && !hasPackedLeftContent;
  const showLeftColumn = hasPackedLeftContent || showLegacyLeftPanel;

  return (
    <CvPage
      pageIndex={pageIndex}
      pageCount={pageCount}
      pageSize={ctx.pageSize}
      templateId={definition.id}
      mode={mode}
      className={cn("tpl-page", definition.cssClass)}
    >
      {pageIndex === 0 && title ? (
        <h1 className="tpl-form-title">{title}</h1>
      ) : null}
      <div
        className={cn(
          "tpl-form-layout",
          !showLeftColumn && "tpl-form-layout--continued",
        )}
      >
        {showLeftColumn ? (
          <div className="tpl-form-left">
            {hasPackedLeftContent
              ? renderBlocks(blockMap, leftIds)
              : leftPanel}
          </div>
        ) : null}
        <div className="tpl-form-right">{renderBlocks(blockMap, mainIds)}</div>
      </div>
    </CvPage>
  );
}
