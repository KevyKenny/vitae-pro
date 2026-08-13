import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/database/types";

type LogAiGenerationInput = {
  userId: string;
  feature: string;
  model: string;
  cvId?: string | null;
  coverLetterId?: string | null;
  status: "succeeded" | "failed" | "cancelled";
  inputTokens?: number;
  outputTokens?: number;
  errorCode?: string;
  metadata?: Record<string, unknown>;
};

export async function logAiGeneration(input: LogAiGenerationInput): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("ai_generations").insert({
      user_id: input.userId,
      cv_id: input.cvId ?? null,
      cover_letter_id: input.coverLetterId ?? null,
      feature: input.feature,
      model: input.model,
      input_tokens: input.inputTokens ?? null,
      output_tokens: input.outputTokens ?? null,
      status: input.status,
      error_code: input.errorCode ?? null,
      metadata: (input.metadata ?? {}) as Json,
    });

    if (error) {
      console.error("[logAiGeneration]", error.message);
    }
  } catch (err) {
    console.error("[logAiGeneration]", err);
  }
}

export function logAiOperation(
  operation: string,
  meta: Record<string, string | number | boolean | undefined>,
): void {
  const safe = Object.fromEntries(
    Object.entries(meta).filter(([, v]) => v !== undefined),
  );
  console.info(`[ai:${operation}]`, safe);
}
