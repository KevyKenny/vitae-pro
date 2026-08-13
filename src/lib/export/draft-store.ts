import "server-only";

import type { CvDocument } from "@/features/cv-editor/types";
import type { CoverLetterDocument } from "@/features/cover-letter/types";

type DraftEntry =
  | { type: "cv"; document: CvDocument; userId: string; expiresAt: number }
  | {
      type: "cover-letter";
      document: CoverLetterDocument;
      userId: string;
      expiresAt: number;
    };

const drafts = new Map<string, DraftEntry>();

const TTL_MS = 5 * 60 * 1000;

function purgeExpired() {
  const now = Date.now();
  for (const [token, entry] of drafts) {
    if (entry.expiresAt <= now) drafts.delete(token);
  }
}

export function storeCvDraft(userId: string, document: CvDocument): string {
  purgeExpired();
  const token = crypto.randomUUID();
  drafts.set(token, {
    type: "cv",
    document,
    userId,
    expiresAt: Date.now() + TTL_MS,
  });
  return token;
}

export function storeCoverLetterDraft(
  userId: string,
  document: CoverLetterDocument,
): string {
  purgeExpired();
  const token = crypto.randomUUID();
  drafts.set(token, {
    type: "cover-letter",
    document,
    userId,
    expiresAt: Date.now() + TTL_MS,
  });
  return token;
}

export function consumeCvDraft(
  token: string,
  userId: string,
): CvDocument | null {
  purgeExpired();
  const entry = drafts.get(token);
  if (!entry || entry.type !== "cv" || entry.userId !== userId) return null;
  drafts.delete(token);
  return entry.document;
}

export function consumeCoverLetterDraft(
  token: string,
  userId: string,
): CoverLetterDocument | null {
  purgeExpired();
  const entry = drafts.get(token);
  if (!entry || entry.type !== "cover-letter" || entry.userId !== userId) {
    return null;
  }
  drafts.delete(token);
  return entry.document;
}
