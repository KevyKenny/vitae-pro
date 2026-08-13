export { coverLetterErrorMessage } from "@/lib/cover-letters/errors";
export {
  buildCandidateFromProfile,
  buildDefaultTitle,
  buildEmptyBodyFromCandidate,
  emptyCoverLetterScore,
  letterTemplateLabel,
  newEmptyCoverLetterDocument,
  parseApplicationStatus,
  parseLetterLength,
  parseLetterTemplateKey,
  parseLetterTone,
  remapCoverLetterIds,
} from "@/lib/cover-letters/defaults";
export {
  documentToRowUpdate,
  rowToCoverLetterDocument,
  type CoverLetterListItem,
  type CoverLetterListRow,
} from "@/lib/cover-letters/mappers";
export {
  associateCoverLetterWithCv,
  createCoverLetter,
  deleteCoverLetter,
  duplicateCoverLetter,
  getCoverLetter,
  listUserCoverLetters,
  renameCoverLetter,
  saveCoverLetterDocument,
} from "@/lib/cover-letters/repository";
