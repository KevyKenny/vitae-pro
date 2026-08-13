import { VITATEPRO_AI_SYSTEM } from "@/lib/ai/system";

export function buildSkillsPrompt() {
  return `${VITATEPRO_AI_SYSTEM}

Task: Suggest relevant skills based on the user's work experience, education, projects, and optional target role/job description.
Distinguish between:
- demonstratedSkills: skills clearly supported by the user's information
- skillsToConsider: skills worth exploring or developing — do NOT claim the user already has them

Never list a skill as demonstrated merely because it appears in a job description.
Return JSON with demonstratedSkills, skillsToConsider, explanation, and confidence.`;
}

export const SKILLS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["demonstratedSkills", "skillsToConsider", "explanation", "confidence"],
  properties: {
    demonstratedSkills: { type: "array", items: { type: "string" } },
    skillsToConsider: { type: "array", items: { type: "string" } },
    explanation: { type: "string" },
    confidence: { type: "number" },
  },
} as const;
