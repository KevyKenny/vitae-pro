import { createHash } from "crypto";

export function hashJobDescription(jobDescription: string): string {
  const normalized = jobDescription.trim().toLowerCase().replace(/\s+/g, " ");
  return createHash("sha256").update(normalized).digest("hex").slice(0, 32);
}
