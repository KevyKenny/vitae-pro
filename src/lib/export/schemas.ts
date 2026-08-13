import { z } from "zod";

export const pageSizeSchema = z.enum(["a4", "letter"]);

export const cvExportRequestSchema = z.object({
  cvId: z.string().uuid(),
  document: z.record(z.string(), z.unknown()).optional(),
  pageSize: pageSizeSchema.optional(),
});

export const coverLetterExportRequestSchema = z.object({
  coverLetterId: z.string().uuid(),
  document: z.record(z.string(), z.unknown()).optional(),
  pageSize: pageSizeSchema.optional(),
});
