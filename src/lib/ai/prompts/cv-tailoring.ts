import { VITATEPRO_AI_SYSTEM } from "@/lib/ai/system";

export function buildCvTailoringPrompt() {
  return `${VITATEPRO_AI_SYSTEM}

Task: Compare the user's CV against the job description and provide tailoring RECOMMENDATIONS only.
Do NOT rewrite the CV. Identify matches, gaps, and areas to strengthen truthfully.
Never suggest adding skills or experience the user does not have.
Return JSON only.`;
}

export const CV_TAILORING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "matchingSkills",
    "missingKeywords",
    "relevantExperience",
    "areasToStrengthen",
    "summarySuggestions",
    "experienceImprovements",
    "skillsToEmphasize",
    "recommendations",
  ],
  properties: {
    matchingSkills: { type: "array", items: { type: "string" } },
    missingKeywords: { type: "array", items: { type: "string" } },
    relevantExperience: { type: "array", items: { type: "string" } },
    areasToStrengthen: { type: "array", items: { type: "string" } },
    summarySuggestions: { type: "array", items: { type: "string" } },
    experienceImprovements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["experienceLabel", "suggestion"],
        properties: {
          experienceLabel: { type: "string" },
          suggestion: { type: "string" },
        },
      },
    },
    skillsToEmphasize: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } },
  },
} as const;
