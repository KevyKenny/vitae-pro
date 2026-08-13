import { z } from "zod";

export const summaryRequestSchema = z.object({
  cvId: z.string().uuid(),
  action: z.enum([
    "generate",
    "improve",
    "professional",
    "concise",
    "confident",
    "ats",
  ]),
  currentSummary: z.string().max(12000).optional(),
});

export const experienceRequestSchema = z.object({
  cvId: z.string().uuid(),
  action: z.enum([
    "improve",
    "rewrite",
    "professional",
    "concise",
    "impact",
    "bullets",
    "ats",
  ]),
  mode: z.enum(["single", "bullets"]).default("single"),
  experienceId: z.string().uuid().optional(),
  bulletIndex: z.number().int().min(0).optional(),
  field: z.enum(["responsibilities", "achievements"]).default("responsibilities"),
  text: z.string().max(12000).optional(),
  jobTitle: z.string().max(500).optional(),
  company: z.string().max(500).optional(),
  description: z.string().max(12000).optional(),
});

export const coverLetterRequestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("generate"),
    coverLetterId: z.string().uuid(),
    cvId: z.string().uuid().nullable().optional(),
    tone: z.string(),
    length: z.enum(["short", "medium", "detailed"]),
    job: z.object({
      companyName: z.string(),
      jobTitle: z.string(),
      hiringManager: z.string(),
      jobDescription: z.string().max(20000),
    }),
    candidate: z.object({
      name: z.string(),
      currentRole: z.string(),
      yearsExperience: z.number(),
      topSkills: z.array(z.string()),
      keyAchievements: z.array(z.string()),
    }),
    cvContext: z.string().max(24000).optional(),
  }),
  z.object({
    mode: z.literal("improve"),
    coverLetterId: z.string().uuid(),
    sectionKey: z.enum([
      "greeting",
      "opening",
      "experience",
      "skills",
      "closing",
      "signature",
    ]),
    action: z.string(),
    currentText: z.string().max(12000),
    tone: z.string(),
    job: z.object({
      companyName: z.string(),
      jobTitle: z.string(),
      jobDescription: z.string().max(20000),
    }),
    cvContext: z.string().max(24000).optional(),
  }),
]);

export const jobAnalysisRequestSchema = z.object({
  coverLetterId: z.string().uuid().optional(),
  jobDescription: z.string().min(20).max(20000),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const cvTailorRequestSchema = z.object({
  cvId: z.string().uuid(),
  coverLetterId: z.string().uuid().optional(),
  jobDescription: z.string().min(20).max(20000),
  jobTitle: z.string().optional(),
});

export const skillsRequestSchema = z.object({
  cvId: z.string().uuid(),
  targetRole: z.string().max(500).optional(),
  jobDescription: z.string().max(20000).optional(),
  cvContext: z.string().max(24000).optional(),
});

export const cvAnalysisRequestSchema = z.object({
  cvId: z.string().uuid(),
  force: z.boolean().optional(),
});

export const jobMatchRequestSchema = z.object({
  cvId: z.string().uuid(),
  jobDescription: z.string().min(20).max(20000),
  jobTitle: z.string().max(500).optional(),
  companyName: z.string().max(500).optional(),
  force: z.boolean().optional(),
});

export const getAnalysisQuerySchema = z.object({
  cvId: z.string().uuid(),
  type: z.enum(["cv_health", "job_match"]).default("cv_health"),
  jobDescription: z.string().max(20000).optional(),
});
