import "server-only";

import { assembleCvDocument } from "@/lib/cvs/mappers";
import { loadCvParts } from "@/lib/cvs/repository";
import { cvErrorMessage } from "@/lib/cvs/errors";
import type { CvDocument } from "@/features/cv-editor/types";
import { createClient } from "@/lib/supabase/server";

export async function getCvWithContentServer(cvId: string): Promise<CvDocument> {
  const supabase = await createClient();
  const parts = await loadCvParts(supabase, cvId);

  if (!parts) {
    throw new Error(cvErrorMessage(null, "We couldn't find that CV."));
  }

  return assembleCvDocument(parts);
}
