import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { summaryRequestSchema } from "@/lib/ai/schemas";
import { assertCvOwnership } from "@/lib/ai/auth";
import { getCvWithContentServer } from "@/lib/cvs/server-access";
import { buildSummaryInput } from "@/lib/ai/cv-context";
import {
  buildSummaryPrompt,
  SUMMARY_SCHEMA,
} from "@/lib/ai/prompts/professional-summary";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import type { ProfessionalSummaryResult } from "@/lib/ai/types";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  return withAiRoute("summary", async ({ user }) => {
    const body = await parseJsonBody(request, summaryRequestSchema);
    await assertCvOwnership(body.cvId, user.id);

    const document = await getCvWithContentServer(body.cvId);
    const currentSummary = body.currentSummary ?? document.summary;
    const input = buildSummaryInput(document, currentSummary);

    const { data, usage } = await generateStructured<ProfessionalSummaryResult>({
      instructions: buildSummaryPrompt(body.action),
      input,
      modelTier: "quality",
      jsonSchema: { name: "ai_suggestion", schema: SUMMARY_SCHEMA },
    });

    logAiOperation("summary", {
      userId: user.id,
      cvId: body.cvId,
      model: usage.model,
      durationMs: usage.durationMs,
      success: true,
    });

    await logAiGeneration({
      userId: user.id,
      cvId: body.cvId,
      feature: "professional_summary",
      model: usage.model,
      status: "succeeded",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      metadata: { action: body.action },
    });

    return { id: randomUUID(), ...data };
  });
}
