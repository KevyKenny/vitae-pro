import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { AiServiceError } from "@/lib/ai/errors";

export async function requireAiUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AiServiceError("unauthorized", "Sign in to use AI features.", 401);
  }
  return user;
}

export async function assertCvOwnership(cvId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cvs")
    .select("id")
    .eq("id", cvId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[ai assertCvOwnership]", error.message);
    throw new AiServiceError("unknown", "Could not verify CV access.", 500);
  }
  if (!data) {
    throw new AiServiceError("forbidden", "You do not have access to this CV.", 403);
  }
}

export async function assertCoverLetterOwnership(
  coverLetterId: string,
  userId: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cover_letters")
    .select("id")
    .eq("id", coverLetterId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[ai assertCoverLetterOwnership]", error.message);
    throw new AiServiceError("unknown", "Could not verify cover letter access.", 500);
  }
  if (!data) {
    throw new AiServiceError(
      "forbidden",
      "You do not have access to this cover letter.",
      403,
    );
  }
}
