import type { PackInput } from "@/components/document/pagination/pack";
import { packBlocks, toPageModels } from "@/components/document/pagination/pack";
import type { BlockRegion, ContentBlock, PageModel } from "@/components/document/pagination/types";
import type { RegionPageModel, TemplateRegionId } from "@/lib/templates/definitions/types";

export type RegionPackResult = {
  regionPages: Map<TemplateRegionId, RegionPageModel[]>;
  pageCount: number;
};

export type RegionPackOptions = {
  lastPageReserveByRegion?: Partial<Record<TemplateRegionId, number>>;
};

export function packBlocksByRegion(
  blocks: ContentBlock[],
  contentHeight: number,
  regions: TemplateRegionId[] = ["main"],
  options: RegionPackOptions = {},
): RegionPackResult {
  const regionPages = new Map<TemplateRegionId, RegionPageModel[]>();
  let maxPages = 1;

  for (const region of regions) {
    const regionBlocks = blocks.filter(
      (b) => (b.region ?? "main") === region,
    );
    const inputs: PackInput[] = regionBlocks.map((b) => ({
      id: b.id,
      height: b.height,
      orphanGuard: b.orphanGuard,
      keepWithNext: b.keepWithNext,
    }));

    const packed = packBlocks(inputs, {
      contentHeight,
      lastPageReserve: options.lastPageReserveByRegion?.[region] ?? 0,
    });
    const models: RegionPageModel[] = toPageModels(packed).map((p) => ({
      ...p,
      region,
    }));

    regionPages.set(region, models.length ? models : [{ index: 0, blockIds: [], region }]);
    maxPages = Math.max(maxPages, models.length);
  }

  return { regionPages, pageCount: maxPages };
}

export function mergeRegionPageModels(
  regionPages: Map<TemplateRegionId, RegionPageModel[]>,
): PageModel[] {
  const pageCount = Math.max(
    1,
    ...[...regionPages.values()].map((pages) => pages.length),
  );

  return Array.from({ length: pageCount }, (_, index) => ({
    index,
    blockIds: [],
  }));
}

/**
 * Blocks for one page of a region. A region that ran out of content leaves
 * later pages empty rather than repeating its last page.
 */
export function regionBlockIdsForPage(
  regionPages: Map<TemplateRegionId, RegionPageModel[]>,
  region: BlockRegion,
  pageIndex: number,
): string[] {
  const pages = regionPages.get(region);
  if (!pages?.length || pageIndex >= pages.length) return [];
  return pages[pageIndex]?.blockIds ?? [];
}
