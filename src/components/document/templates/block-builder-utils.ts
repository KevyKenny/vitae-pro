import type { CvDocument, CvSectionType } from "@/features/cv-editor/types";
import type { ContentBlock } from "@/components/document/pagination/types";
import type { TemplateRenderContext } from "@/lib/templates/definitions/types";
import { groupedSkills } from "@/features/cv-editor/constants/skills";
import { isBlankHtml, sanitizeCvHtml } from "@/lib/cvs/sanitize-html";

const SECTION_LABELS: Record<CvSectionType, string> = {
  personal: "Contact",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
  references: "References",
  custom: "Additional",
};

export function sectionVisible(document: CvDocument, type: CvSectionType): boolean {
  const meta = document.sections.find((s) => s.type === type);
  return meta?.visible ?? false;
}

export function sectionTitle(
  document: CvDocument,
  type: CvSectionType,
  fallback: string,
): string {
  return document.sections.find((s) => s.type === type)?.label?.trim() || fallback;
}

export function splitHtmlBlocks(html: string): string[] {
  const sanitized = sanitizeCvHtml(html);
  if (isBlankHtml(sanitized)) return [];
  const parts = sanitized
    .split(/(?=<(?:p|li|h[1-6]|div|ul|ol|blockquote)\b)/i)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [sanitized];
}

export type BlockBuilderState = {
  seq: number;
  blocks: ContentBlock[];
};

export function createBlockBuilder(): BlockBuilderState {
  return { seq: 0, blocks: [] };
}

export function pushBlock(
  state: BlockBuilderState,
  block: Omit<ContentBlock, "height"> & { height?: number },
) {
  state.blocks.push({ ...block, height: block.height ?? 0 });
}

export function nextId(state: BlockBuilderState, prefix: string) {
  return `${prefix}-${state.seq++}`;
}

export function softSkillItems(document: CvDocument): string[] {
  const softGroup = groupedSkills(document).find(
    (g) => g.id === "soft" || g.label.toLowerCase().includes("soft"),
  );
  if (softGroup?.skills.length) {
    return softGroup.skills.map((s) => s.name);
  }
  return document.skills
    .filter((s) => s.category === "soft")
    .map((s) => s.name);
}

export function technicalSkillNames(document: CvDocument): string[] {
  return groupedSkills(document)
    .filter((g) => g.id !== "soft" && !g.label.toLowerCase().includes("soft"))
    .flatMap((g) => g.skills.map((s) => s.name));
}

export function allSkillNames(document: CvDocument): string[] {
  return document.skills.map((s) => s.name);
}

export { SECTION_LABELS };

export type BlockBuilderContext = TemplateRenderContext;
