import type { MeasuredBlock } from "@/components/document/pagination/types";

export type PackInput = Pick<
  MeasuredBlock,
  "id" | "height" | "orphanGuard" | "keepWithNext"
>;

export type PackOptions = {
  contentHeight: number;
  /**
   * Height reserved on the final page (e.g. Classic sidebar footer mark).
   * Trailing blocks are spilled onto a new page until the last page fits.
   */
  lastPageReserve?: number;
};

/**
 * Assign blocks to fixed-height pages using keep-together / orphan rules.
 * Pure function — unit-testable without React.
 */
export function packBlocks(
  blocks: PackInput[],
  options: PackOptions,
): string[][] {
  const { contentHeight, lastPageReserve = 0 } = options;
  if (contentHeight <= 0 || blocks.length === 0) {
    return blocks.length ? [blocks.map((b) => b.id)] : [[]];
  }

  const pages: string[][] = [];
  let current: string[] = [];
  let used = 0;

  const flush = () => {
    if (current.length) pages.push(current);
    current = [];
    used = 0;
  };

  const blockFits = (height: number) => used + height <= contentHeight;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const h = Math.max(block.height, 1);

    if (h > contentHeight) {
      if (current.length) flush();
      pages.push([block.id]);
      continue;
    }

    if (!blockFits(h)) {
      if (current.length) flush();
    }

    if (block.orphanGuard) {
      const next = blocks[i + 1];
      const combined = h + (next?.height ?? 0);
      if (next && combined > contentHeight && blockFits(h) && !blockFits(combined)) {
        if (current.length) flush();
      }
    }

    if (!blockFits(h)) {
      flush();
    }

    current.push(block.id);
    used += h;

    if (block.keepWithNext && blocks[i + 1]) {
      const nextH = blocks[i + 1].height;
      if (used + nextH > contentHeight) {
        current.pop();
        used -= h;
        flush();
        current.push(block.id);
        used += h;
      }
    }
  }

  if (current.length) pages.push(current);

  if (lastPageReserve > 0 && pages.length > 0) {
    const heightById = new Map(
      blocks.map((block) => [block.id, Math.max(block.height, 1)] as const),
    );
    const lastPageBudget = Math.max(1, contentHeight - lastPageReserve);

    while (pages.length > 0) {
      const last = pages[pages.length - 1];
      const usedOnLast = last.reduce(
        (sum, id) => sum + (heightById.get(id) ?? 1),
        0,
      );
      if (usedOnLast <= lastPageBudget || last.length <= 1) break;
      const moved = last.pop();
      if (!moved) break;
      if (last.length === 0) {
        pages[pages.length - 1] = [moved];
        break;
      }
      pages.push([moved]);
    }
  }

  return pages.length ? pages : [[]];
}

export function toPageModels(pageBlockIds: string[][]): {
  index: number;
  blockIds: string[];
}[] {
  return pageBlockIds.map((blockIds, index) => ({ index, blockIds }));
}
