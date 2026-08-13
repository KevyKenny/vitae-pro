import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { jobAnalysisRequestSchema } from "@/lib/ai/schemas";
import { assertCoverLetterOwnership } from "@/lib/ai/auth";
import {
  buildJobAnalysisPrompt,
  JOB_ANALYSIS_SCHEMA,
} from "@/lib/ai/prompts/job-analysis";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import type { JobAnalysisResult } from "@/lib/ai/types";

export async function POST(request: Request) {
  return withAiRoute("job-analysis", async ({ user }) => {
    const body = await parseJsonBody(request, jobAnalysisRequestSchema);

    if (body.coverLetterId) {
      await assertCoverLetterOwnership(body.coverLetterId, user.id);
    }

    const input = JSON.stringify(
      {
        companyName: body.companyName ?? "",
        jobTitle: body.jobTitle ?? "",
        jobDescription: body.jobDescription,
      },
      null,
      2,
    );

    const { data, usage } = await generateStructured<JobAnalysisResult>({
      instructions: buildJobAnalysisPrompt(),
      input,
      modelTier: "fast",
      jsonSchema: { name: "job_analysis", schema: JOB_ANALYSIS_SCHEMA },
    });

    logAiOperation("job_analysis", {
      userId: user.id,
      model: usage.model,
      durationMs: usage.durationMs,
      success: true,
    });

    await logAiGeneration({
      userId: user.id,
      coverLetterId: body.coverLetterId ?? null,
      feature: "other",
      model: usage.model,
      status: "succeeded",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      metadata: { operation: "job_analysis" },
    });

    return data;
  });
}
