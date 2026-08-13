import type { CvDocument } from "@/features/cv-editor/types";
import type { CoverLetterDocument } from "@/features/cover-letter/types";
import type { TemplateCustomization } from "@/features/templates/types";

export type DocumentPageSize = "a4" | "letter";

export type DocumentRenderMode = "preview" | "print" | "export";

export type DocumentStyleVars = {
  accent: string;
  primary: string;
  background: string;
  text: string;
  fontFamily: string;
  fontHeading: string;
  fontSize: number;
  lineHeight: number;
  padX: number;
  padY: number;
  sectionSpacing: number;
  layout: "single" | "two-column" | "sidebar";
  pageSize: DocumentPageSize;
};

export type CvDocumentViewProps = {
  document: CvDocument;
  mode?: DocumentRenderMode;
  customization?: Partial<TemplateCustomization> | null;
  pageSize?: DocumentPageSize;
  /** When false, renders flow content without the fixed page shell (for live preview pagination). */
  shell?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type CoverLetterDocumentViewProps = {
  document: CoverLetterDocument;
  mode?: DocumentRenderMode;
  pageSize?: DocumentPageSize;
  className?: string;
  style?: React.CSSProperties;
};

export type ExportValidationResult = {
  canExport: boolean;
  warnings: string[];
  blockers: string[];
  completionPercent?: number;
  readyMessage?: string;
};

export type CvExportPayload = {
  cvId: string;
  document?: CvDocument;
  pageSize?: DocumentPageSize;
};

export type CoverLetterExportPayload = {
  coverLetterId: string;
  document?: CoverLetterDocument;
  pageSize?: DocumentPageSize;
};
