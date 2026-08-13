import { VITATEPRO_AI_SYSTEM } from "@/lib/ai/system";
import type { SummaryAction } from "@/lib/ai/types";

const ACTION_GUIDANCE: Record<SummaryAction, string> = {
  generate: "Write a new professional summary from the provided career context.",
  improve: "Improve the existing summary while preserving all facts.",
  professional: "Make the summary more professional and polished.",
  concise: "Make the summary more concise without losing key facts.",
  confident: "Use a confident tone while staying truthful.",
  ats: "Optimize for ATS readability using relevant terminology — never keyword-stuff or invent skills.",
};

export function buildSummaryPrompt(action: SummaryAction) {
  return `${VITATEPRO_AI_SYSTEM}

Task: Professional CV summary — ${ACTION_GUIDANCE[action]}

Return JSON with:
- suggestion (string): the proposed summary text only
- explanation (string): brief note on what changed and why
- confidence (number 0-1): your confidence in the suggestion`;
}

export const SUMMARY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["suggestion", "explanation", "confidence"],
  properties: {
    suggestion: { type: "string" },
    explanation: { type: "string" },
    confidence: { type: "number" },
  },
} as const;
