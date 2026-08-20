import type { TemplateCustomization } from "@/features/templates/types";
import type { DocumentPageSize } from "@/components/document/types";
import type { EditorTemplateId } from "@/features/cv-editor/types";
import { resolveCvDocumentStyle } from "@/components/document/resolve-document-style";

export type CvRenderConfig = {
  templateStyle: EditorTemplateId;
  galleryTemplateSlug: string | null;
  customization: Partial<TemplateCustomization> | null;
  pageSize: DocumentPageSize;
  resolved: ReturnType<typeof resolveCvDocumentStyle>;
};

export function buildCvRenderConfig(
  templateStyle: EditorTemplateId,
  customization: Partial<TemplateCustomization> | null | undefined,
  pageSize: DocumentPageSize = "a4",
  galleryTemplateSlug?: string | null,
): CvRenderConfig {
  const resolved = resolveCvDocumentStyle(templateStyle, customization, pageSize);
  return {
    templateStyle,
    galleryTemplateSlug: galleryTemplateSlug ?? null,
    customization: customization ?? null,
    pageSize: resolved.pageSize,
    resolved,
  };
}
