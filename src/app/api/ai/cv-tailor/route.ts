import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { cvTailorRequestSchema } from "@/lib/ai/schemas";
import { assertCoverLetterOwnership, assertCvOwnership } from "@/lib/ai/auth";
import { getCvWithContentServer } from "@/lib/cvs/server-access";
import { serializeCvContext } from "@/lib/ai/cv-context";
import {
  buildCvTailoringPrompt,
  CV_TAILORING_SCHEMA,
} from "@/lib/ai/prompts/cv-tailoring";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import type { CvTailoringResult } from "@/lib/ai/types";

export async function POST(request: Request) {
  return withAiRoute("cv-tailor", async ({ user }) => {
    const body = await parseJsonBody(request, cvTailorRequestSchema);
    await assertCvOwnership(body.cvId, user.id);

    if (body.coverLetterId) {
      await assertCoverLetterOwnership(body.coverLetterId, user.id);
    }

    const cv = await getCvWithContentServer(body.cvId);
    const input = JSON.stringify(
      {
        cv: JSON.parse(serializeCvContext(cv)),
        jobTitle: body.jobTitle ?? "",
        jobDescription: body.jobDescription,
      },
      null,
      2,
    );

    const { data, usage } = await generateStructured<CvTailoringResult>({
      instructions: buildCvTailoringPrompt(),
      input,
      modelTier: "quality",
      jsonSchema: { name: "cv_tailoring", schema: CV_TAILORING_SCHEMA },
    });

    logAiOperation("cv_tailor", {
      userId: user.id,
      cvId: body.cvId,
      model: usage.model,
      durationMs: usage.durationMs,
      success: true,
    });

    await logAiGeneration({
      userId: user.id,
      cvId: body.cvId,
      coverLetterId: body.coverLetterId ?? null,
      feature: "ats_optimization",
      model: usage.model,
      status: "succeeded",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      metadata: { operation: "cv_tailoring" },
    });

    return data;
  });
}
