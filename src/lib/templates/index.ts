export { templateErrorMessage } from "@/lib/templates/errors";
export {
  customizationToJson,
  parseEditorStyle,
  parseTemplateCustomization,
  rowToGalleryTemplate,
  rowToSavedTemplateEntry,
  type CustomizationRow,
  type TemplateRow,
} from "@/lib/templates/mappers";
export {
  applyGalleryTemplateToCv,
  getTemplateBySlugOrId,
  getTemplateCustomization,
  getTemplateDbIdBySlug,
  getUserDefaultTemplateId,
  listActiveTemplates,
  listUserCustomizations,
  resolveCvTemplateCustomization,
  resolveEditorStyle,
  saveTemplateCustomization,
  setUserDefaultTemplate,
} from "@/lib/templates/repository";
export {
  TEMPLATE_DEFINITIONS,
  getTemplateDefinition,
  getTemplateDefinitionBySlug,
  resolveRendererKey,
  DEFAULT_RENDERER_KEY,
} from "@/lib/templates/definitions/index";
export {
  isTemplateRendererKey,
} from "@/lib/templates/definitions/types";
export type {
  TemplateDefinition,
  TemplateRendererKey,
  TemplateLayoutFamily,
  TemplateRegionId,
  TemplateRenderContext,
} from "@/lib/templates/definitions/types";
