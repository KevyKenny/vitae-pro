import "server-only";

import { rowToCoverLetterDocument } from "@/lib/cover-letters/mappers";
import { coverLetterErrorMessage } from "@/lib/cover-letters/errors";
import type { CoverLetterDocument } from "@/features/cover-letter/types";
import { createClient } from "@/lib/supabase/server";

export async function getCoverLetterServer(
  id: string,
): Promise<CoverLetterDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(coverLetterErrorMessage(error));
  if (!data) {
    throw new Error(coverLetterErrorMessage(null, "Cover letter not found."));
  }

  return rowToCoverLetterDocument(data);
}
