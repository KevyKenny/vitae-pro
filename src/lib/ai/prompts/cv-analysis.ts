import { VITATEPRO_AI_SYSTEM } from "@/lib/ai/system";

export function buildCvAnalysisPrompt() {
  return `${VITATEPRO_AI_SYSTEM}

Task: Perform a comprehensive CV health and ATS compatibility assessment based ONLY on the user's CV data provided.

Scoring methodology (weighted):
- Content quality (20%): factual completeness, clarity, professional tone
- Professional summary (10%): clarity, relevance, positioning
- Experience quality (20%): action verbs, specificity, outcomes where provided
- Skills relevance (10%): demonstrated skills, organization
- Education completeness (10%): appropriate presentation of all qualification types
- Structure (10%): standard sections, logical flow
- ATS compatibility (15%): standard headings, parseable format, keyword clarity
- Readability (5%): concise language, scannable bullets

Rules:
- Scores are VitatePro AI assessments — NOT hiring probability or guarantees
- Never invent achievements, metrics, employers, or qualifications
- Treat O Level, A Level, Industrial Attachment, Internship, Diploma, Degree equally professionally
- Industrial attachment durations (e.g. "8 months") are valid — do not invent dates
- If CV is sparse, set isIncomplete true and list missingAreas
- Provide actionable, prioritized recommendations with aiAction hints where applicable:
  summary, experience, skills, ats (for ATS optimization)

Return structured JSON only.`;
}

const RECOMMENDATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "priority",
    "title",
    "reason",
    "action",
    "sectionType",
    "aiAction",
  ],
  properties: {
    id: { type: "string" },
    priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
    title: { type: "string" },
    reason: { type: "string" },
    action: { type: "string" },
    sectionType: {
      type: "string",
      enum: [
        "personal",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
        "achievements",
        "references",
        "custom",
      ],
    },
    aiAction: {
      type: "string",
      enum: ["summary", "experience", "skills", "ats", "tailor"],
    },
  },
} as const;

export const CV_ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "atsScore",
    "disclaimer",
    "categories",
    "atsBreakdown",
    "atsIssues",
    "strengths",
    "weaknesses",
    "recommendations",
    "improvementPlan",
    "summaryAnalysis",
    "experienceAnalysis",
    "educationAnalysis",
    "isIncomplete",
    "missingAreas",
  ],
  properties: {
    overallScore: { type: "number" },
    atsScore: { type: "number" },
    disclaimer: { type: "string" },
    categories: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "label", "score", "status", "explanation", "strengths", "improvements"],
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          score: { type: "number" },
          status: { type: "string", enum: ["strong", "good", "needs-work"] },
          explanation: { type: "string" },
          strengths: { type: "array", items: { type: "string" } },
          improvements: { type: "array", items: { type: "string" } },
        },
      },
    },
    atsBreakdown: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "label", "score"],
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          score: { type: "number" },
        },
      },
    },
    atsIssues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["severity", "title", "explanation"],
        properties: {
          severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
          title: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
    strengths: { type: "array", items: { type: "string" } },
    weaknesses: { type: "array", items: { type: "string" } },
    recommendations: {
      type: "array",
      items: RECOMMENDATION_SCHEMA,
    },
    improvementPlan: {
      type: "array",
      items: RECOMMENDATION_SCHEMA,
    },
    summaryAnalysis: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["score", "explanation", "strengths", "improvements"],
      properties: {
        score: { type: "number" },
        explanation: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } },
      },
    },
    experienceAnalysis: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "experienceLabel",
          "relevance",
          "strength",
          "keywordsPresent",
          "keywordsToIncorporate",
          "recommendations",
        ],
        properties: {
          experienceLabel: { type: "string" },
          relevance: { type: "string", enum: ["high", "medium", "low"] },
          strength: { type: "string" },
          keywordsPresent: { type: "array", items: { type: "string" } },
          keywordsToIncorporate: { type: "array", items: { type: "string" } },
          recommendations: { type: "array", items: { type: "string" } },
        },
      },
    },
    educationAnalysis: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["score", "explanation", "strengths", "improvements"],
      properties: {
        score: { type: "number" },
        explanation: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } },
      },
    },
    isIncomplete: { type: "boolean" },
    missingAreas: { type: "array", items: { type: "string" } },
  },
} as const;

