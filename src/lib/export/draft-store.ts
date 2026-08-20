import "server-only";

import type { CvDocument } from "@/features/cv-editor/types";
import type { CoverLetterDocument } from "@/features/cover-letter/types";
import type { Json } from "@/lib/database/types";
import { createClient } from "@/lib/supabase/server";

const TTL_MS = 5 * 60 * 1000;

type MemoryEntry =
  | { type: "cv"; document: CvDocument; userId: string; expiresAt: number }
  | {
      type: "cover-letter";
      document: CoverLetterDocument;
      userId: string;
      expiresAt: number;
    };

const memoryDrafts = new Map<string, MemoryEntry>();

function purgeMemoryExpired() {
  const now = Date.now();
  for (const [token, entry] of memoryDrafts) {
    if (entry.expiresAt <= now) memoryDrafts.delete(token);
  }
}

async function insertDraft(
  userId: string,
  documentType: "cv" | "cover-letter",
  payload: CvDocument | CoverLetterDocument,
): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + TTL_MS).toISOString();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("export_drafts").insert({
      token,
      user_id: userId,
      document_type: documentType,
      payload: payload as unknown as Json,
      expires_at: expiresAt,
    });
    if (!error) return token;
  } catch {
    // memory fallback below
  }

  purgeMemoryExpired();
  memoryDrafts.set(token, {
    type: documentType,
    document: payload,
    userId,
    expiresAt: Date.now() + TTL_MS,
  } as MemoryEntry);
  return token;
}

async function readDraft<T extends "cv" | "cover-letter">(
  token: string,
  userId: string,
  type: T,
): Promise<(T extends "cv" ? CvDocument : CoverLetterDocument) | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("export_drafts")
      .select("payload, user_id, document_type, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (!error && data) {
      if (data.user_id !== userId || data.document_type !== type) return null;
      if (new Date(data.expires_at).getTime() <= Date.now()) {
        await supabase.from("export_drafts").delete().eq("token", token);
        return null;
      }
      await supabase.from("export_drafts").delete().eq("token", token);
      return data.payload as T extends "cv" ? CvDocument : CoverLetterDocument;
    }
  } catch {
    // memory fallback
  }

  purgeMemoryExpired();
  const entry = memoryDrafts.get(token);
  if (!entry || entry.type !== type || entry.userId !== userId) return null;
  memoryDrafts.delete(token);
  return entry.document as T extends "cv" ? CvDocument : CoverLetterDocument;
}

export async function storeCvDraft(
  userId: string,
  document: CvDocument,
): Promise<string> {
  return insertDraft(userId, "cv", document);
}

export async function storeCoverLetterDraft(
  userId: string,
  document: CoverLetterDocument,
): Promise<string> {
  return insertDraft(userId, "cover-letter", document);
}

export async function consumeCvDraft(
  token: string,
  userId: string,
): Promise<CvDocument | null> {
  return readDraft(token, userId, "cv");
}

export async function consumeCoverLetterDraft(
  token: string,
  userId: string,
): Promise<CoverLetterDocument | null> {
  return readDraft(token, userId, "cover-letter");
}
