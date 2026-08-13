import type { SkillCategory } from "@/features/cv-editor/types";

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: "technical", label: "Technical Skills" },
  { id: "soft", label: "Soft Skills" },
  { id: "tools", label: "Tools" },
  { id: "languages", label: "Languages" },
  { id: "frameworks", label: "Frameworks" },
];

export const SKILL_PLACEHOLDERS: Record<SkillCategory, string> = {
  technical: "Data analysis",
  soft: "Communication",
  tools: "Figma",
  languages: "English",
  frameworks: "React",
};

export function skillCategoryLabel(category: SkillCategory): string {
  return SKILL_CATEGORIES.find((c) => c.id === category)?.label ?? "Skills";
}

export function groupedSkills(document: {
  skills: { id: string; name: string; category: SkillCategory }[];
}) {
  return SKILL_CATEGORIES.map((category) => ({
    ...category,
    skills: document.skills.filter((skill) => skill.category === category.id),
  })).filter((group) => group.skills.length > 0);
}
