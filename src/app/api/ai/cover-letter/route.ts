import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { coverLetterRequestSchema } from "@/lib/ai/schemas";
import {
  assertCoverLetterOwnership,
  assertCvOwnership,
} from "@/lib/ai/auth";
import { getCvWithContentServer } from "@/lib/cvs/server-access";
import { serializeCvContext } from "@/lib/ai/cv-context";
import {
  buildCoverLetterGeneratePrompt,
  buildCoverLetterSectionPrompt,
  COVER_LETTER_GENERATE_SCHEMA,
  COVER_LETTER_SECTION_SCHEMA,
} from "@/lib/ai/prompts/cover-letter";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import type {
  CoverLetterGenerateResult,
  CoverLetterSectionResult,
} from "@/lib/ai/types";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  return withAiRoute("cover-letter", async ({ user }) => {
    const body = await parseJsonBody(request, coverLetterRequestSchema);
    await assertCoverLetterOwnership(body.coverLetterId, user.id);

    if (body.mode === "generate") {
      if (body.cvId) {
        await assertCvOwnership(body.cvId, user.id);
      }

      let cvContext = body.cvContext;
      if (body.cvId && !cvContext) {
        const cv = await getCvWithContentServer(body.cvId);
        cvContext = serializeCvContext(cv);
      }

      const input = JSON.stringify(
        {
          tone: body.tone,
          length: body.length,
          job: body.job,
          candidate: body.candidate,
          cvContext: cvContext ?? null,
        },
        null,
        2,
      );

      const { data, usage } =
        await generateStructured<CoverLetterGenerateResult>({
          instructions: buildCoverLetterGeneratePrompt(),
          input,
          modelTier: "quality",
          jsonSchema: {
            name: "cover_letter_generate",
            schema: COVER_LETTER_GENERATE_SCHEMA,
          },
        });

      logAiOperation("cover_letter_generate", {
        userId: user.id,
        coverLetterId: body.coverLetterId,
        model: usage.model,
        durationMs: usage.durationMs,
        success: true,
      });

      await logAiGeneration({
        userId: user.id,
        coverLetterId: body.coverLetterId,
        cvId: body.cvId ?? null,
        feature: "cover_letter",
        model: usage.model,
        status: "succeeded",
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        metadata: { mode: "generate", tone: body.tone, length: body.length },
      });

      return { id: randomUUID(), ...data };
    }

    const input = JSON.stringify(
      {
        sectionKey: body.sectionKey,
        action: body.action,
        currentText: body.currentText,
        tone: body.tone,
        job: body.job,
        cvContext: body.cvContext ?? null,
      },
      null,
      2,
    );

    const { data, usage } = await generateStructured<CoverLetterSectionResult>({
      instructions: buildCoverLetterSectionPrompt(body.action),
      input,
      modelTier: "default",
      jsonSchema: {
        name: "ai_suggestion",
        schema: COVER_LETTER_SECTION_SCHEMA,
      },
    });

    logAiOperation("cover_letter_improve", {
      userId: user.id,
      coverLetterId: body.coverLetterId,
      model: usage.model,
      durationMs: usage.durationMs,
      success: true,
    });

    await logAiGeneration({
      userId: user.id,
      coverLetterId: body.coverLetterId,
      feature: "cover_letter",
      model: usage.model,
      status: "succeeded",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      metadata: { mode: "improve", sectionKey: body.sectionKey, action: body.action },
    });

    return { id: randomUUID(), ...data };
  });
}
