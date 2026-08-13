import { VITATEPRO_AI_SYSTEM } from "@/lib/ai/system";
import type { ExperienceAction } from "@/lib/ai/types";

const ACTION_GUIDANCE: Record<ExperienceAction, string> = {
  improve: "Improve the writing while preserving all facts.",
  rewrite: "Rewrite for clarity and impact without adding new facts.",
  professional: "Use more professional wording.",
  concise: "Make more concise.",
  impact: "Strengthen impact language using only provided evidence. Suggest metric questions if numbers are missing.",
  bullets: "Convert to professional CV bullet point(s).",
  ats: "Optimize for ATS using relevant terminology from context — never invent skills or metrics.",
};

export function buildExperiencePrompt(action: ExperienceAction, mode: "single" | "bullets") {
  const guidance = ACTION_GUIDANCE[action] ?? ACTION_GUIDANCE.improve;
  const task =
    mode === "bullets"
      ? `${guidance} Return 2–6 professional CV bullet points based only on the job title, company, and description provided.`
      : `Experience text improvement — ${guidance}`;

  return `${VITATEPRO_AI_SYSTEM}

Task: ${task}

Never invent achievements, metrics, technologies, or responsibilities not present in the input.
If the description is sparse, keep bullets honest and brief — do not fabricate detail.`;
}

export const EXPERIENCE_SUGGESTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["suggestion", "explanation", "confidence", "metricQuestions"],
  properties: {
    suggestion: { type: "string" },
    explanation: { type: "string" },
    confidence: { type: "number" },
    metricQuestions: {
      type: "array",
      items: { type: "string" },
    },
  },
} as const;

export const EXPERIENCE_BULLETS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["bullets", "explanation", "confidence", "metricQuestions"],
  properties: {
    bullets: { type: "array", items: { type: "string" } },
    explanation: { type: "string" },
    confidence: { type: "number" },
    metricQuestions: {
      type: "array",
      items: { type: "string" },
    },
  },
} as const;
