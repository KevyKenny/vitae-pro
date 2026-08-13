export { cvErrorMessage } from "@/lib/cvs/errors";
export {
  DEFAULT_SECTION_DEFS,
  buildDefaultSections,
  buildEmptyPersonalFromProfile,
  editorTemplateLabel,
  newEmptyDocument,
} from "@/lib/cvs/defaults";
export { calculateCvCompletion, calculateSectionCompletion, applySectionCompletions } from "@/lib/cvs/completion";
export {
  getCompletionSummary,
  getCvCompletionChecklist,
  getCvSmartRecommendations,
  type CompletionCheckItem,
  type CvSmartRecommendation,
} from "@/lib/cvs/completion-checklist";
export { suggestCvTitle } from "@/lib/cvs/suggest-title";
export { ensureUuid, isUuid, remapDocumentIds } from "@/lib/cvs/ids";
export {
  assembleCvDocument,
  documentToPersistPayload,
  type CvDocumentParts,
  type CvPersistPayload,
} from "@/lib/cvs/mappers";
export {
  archiveCv,
  createCv,
  deleteCv,
  duplicateCv,
  duplicateCvAsTailored,
  getCvWithContent,
  listUserCvs,
  renameCv,
  saveCvDocument,
  setDefaultCv,
  unarchiveCv,
  type CvListItem,
} from "@/lib/cvs/repository";
