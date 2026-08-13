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
  resolveEditorStyle,
  saveTemplateCustomization,
  setUserDefaultTemplate,
} from "@/lib/templates/repository";
