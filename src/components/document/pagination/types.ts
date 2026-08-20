import type { ReactNode } from "react";

export type BlockKind =
  | "header"
  | "sidebar-rail"
  | "section-title"
  | "paragraph"
  | "experience-header"
  | "experience-bullet"
  | "experience-footer"
  | "education-entry"
  | "education-table-header"
  | "education-table-row"
  | "project"
  | "cert"
  | "achievement"
  | "reference"
  | "skills-group"
  | "custom-html";

export type MeasuredBlock = {
  id: string;
  kind: BlockKind;
  height: number;
  /** Section titles must not sit alone at the bottom of a page. */
  orphanGuard?: boolean;
  /** Keep with the immediately following block when possible. */
  keepWithNext?: boolean;
  groupId?: string;
};

export type BlockRegion = "main" | "sidebar" | "left" | "right";

export type ContentBlock = MeasuredBlock & {
  region?: BlockRegion;
  render: () => ReactNode;
};

export type PageModel = {
  index: number;
  blockIds: string[];
};

export type PaginationResult = {
  pages: PageModel[];
  blocks: Map<string, ContentBlock>;
  contentHeight: number;
  pageCount: number;
};

export type ColumnLayout = "single" | "sidebar" | "two-column";
