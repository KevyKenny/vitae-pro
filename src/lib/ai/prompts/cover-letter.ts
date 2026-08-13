import { VITATEPRO_AI_SYSTEM } from "@/lib/ai/system";

export function buildCoverLetterSectionPrompt(action: string) {
  return `${VITATEPRO_AI_SYSTEM}

Task: Improve one section of a cover letter (${action}).
Use the candidate's CV content as the source of truth. Never invent experience, employers, or achievements.
Return JSON with suggestion, explanation, and confidence (0-1).`;
}

export function buildCoverLetterGeneratePrompt() {
  return `${VITATEPRO_AI_SYSTEM}

Task: Generate a complete cover letter using the candidate profile, CV content, and job details provided.
Match the requested tone and length. Never invent experience or qualifications.
Return JSON with body (greeting, opening, experience, skills, closing, signature), explanation, and confidence.`;
}

export const COVER_LETTER_SECTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["suggestion", "explanation", "confidence"],
  properties: {
    suggestion: { type: "string" },
    explanation: { type: "string" },
    confidence: { type: "number" },
  },
} as const;

export const COVER_LETTER_GENERATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["body", "explanation", "confidence"],
  properties: {
    body: {
      type: "object",
      additionalProperties: false,
      required: ["greeting", "opening", "experience", "skills", "closing", "signature"],
      properties: {
        greeting: { type: "string" },
        opening: { type: "string" },
        experience: { type: "string" },
        skills: { type: "string" },
        closing: { type: "string" },
        signature: { type: "string" },
      },
    },
    explanation: { type: "string" },
    confidence: { type: "number" },
  },
} as const;
