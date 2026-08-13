import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { jobMatchRequestSchema } from "@/lib/ai/schemas";
import { assertCvOwnership } from "@/lib/ai/auth";
import { getCvWithContentServer } from "@/lib/cvs/server-access";
import { serializeCvContext } from "@/lib/ai/cv-context";
import {
  buildJobMatchPrompt,
  JOB_MATCH_SCHEMA,
} from "@/lib/ai/prompts/job-match";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import { checkCvCompleteness } from "@/lib/analysis/completeness";
import {
  getCachedAnalysis,
  saveAnalysis,
} from "@/lib/analysis/repository";
import type { JobMatchResult } from "@/lib/analysis/types";
import { AiServiceError } from "@/lib/ai/errors";

export async function POST(request: Request) {
  return withAiRoute("job-match", async ({ user }) => {
    const body = await parseJsonBody(request, jobMatchRequestSchema);
    await assertCvOwnership(body.cvId, user.id);

    const document = await getCvWithContentServer(body.cvId);
    const completeness = checkCvCompleteness(document);

    if (!completeness.isAnalyzable) {
      throw new AiServiceError(
        "validation",
        completeness.message ??
          "We need a little more information to analyze this CV.",
        422,
      );
    }

    if (!body.force) {
      const cached = await getCachedAnalysis(
        body.cvId,
        "job_match",
        body.jobDescription,
      );
      if (cached && !cached.isStale) {
        return {
          match: cached.result as JobMatchResult,
          cached: true,
          stored: cached,
        };
      }
    }

    const input = JSON.stringify(
      {
        cv: JSON.parse(serializeCvContext(document)),
        targetRole: document.personal.title,
        jobTitle: body.jobTitle ?? "",
        companyName: body.companyName ?? "",
        jobDescription: body.jobDescription,
      },
      null,
      2,
    );

    const { data, usage } = await generateStructured<JobMatchResult>({
      instructions: buildJobMatchPrompt(),
      input,
      modelTier: "quality",
      jsonSchema: { name: "job_match", schema: JOB_MATCH_SCHEMA },
    });

    const stored = await saveAnalysis({
      cvId: body.cvId,
      analysisType: "job_match",
      result: data,
      model: usage.model,
      cvUpdatedAt: document.updatedAt,
      jobDescription: body.jobDescription,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
    });

    logAiOperation("job_match", {
      userId: user.id,
      cvId: body.cvId,
      model: usage.model,
      durationMs: usage.durationMs,
      success: true,
    });

    await logAiGeneration({
      userId: user.id,
      cvId: body.cvId,
      feature: "other",
      model: usage.model,
      status: "succeeded",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      metadata: { operation: "job_match" },
    });

    return { match: data, cached: false, stored };
  });
}
