import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { cvAnalysisRequestSchema } from "@/lib/ai/schemas";
import { assertCvOwnership } from "@/lib/ai/auth";
import { getCvWithContentServer } from "@/lib/cvs/server-access";
import { serializeCvContext } from "@/lib/ai/cv-context";
import {
  buildCvAnalysisPrompt,
  CV_ANALYSIS_SCHEMA,
} from "@/lib/ai/prompts/cv-analysis";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import { checkCvCompleteness } from "@/lib/analysis/completeness";
import {
  getCachedAnalysis,
  saveAnalysis,
} from "@/lib/analysis/repository";
import type { CVAnalysisResult } from "@/lib/analysis/types";
import { AiServiceError } from "@/lib/ai/errors";

export async function POST(request: Request) {
  return withAiRoute("cv-analysis", async ({ user }) => {
    const body = await parseJsonBody(request, cvAnalysisRequestSchema);
    await assertCvOwnership(body.cvId, user.id);

    const document = await getCvWithContentServer(body.cvId);
    const completeness = checkCvCompleteness(document);

    if (!completeness.isAnalyzable) {
      const partial: CVAnalysisResult = {
        overallScore: completeness.completionPercent,
        atsScore: 0,
        disclaimer:
          "VitatePro AI assessment — complete more sections for a full analysis.",
        categories: [],
        atsBreakdown: [],
        atsIssues: [],
        strengths: [],
        weaknesses: [],
        recommendations: [],
        improvementPlan: [],
        summaryAnalysis: null,
        experienceAnalysis: [],
        educationAnalysis: null,
        isIncomplete: true,
        missingAreas: completeness.missingAreas,
      };
      return { analysis: partial, cached: false, incomplete: true };
    }

    if (!body.force) {
      const cached = await getCachedAnalysis(body.cvId, "cv_health");
      if (cached && !cached.isStale) {
        return {
          analysis: cached.result as CVAnalysisResult,
          cached: true,
          stored: cached,
        };
      }
    }

    const input = JSON.stringify(
      {
        cv: JSON.parse(serializeCvContext(document)),
        targetRole: document.personal.title,
        templateKey: document.templateId,
      },
      null,
      2,
    );

    const { data, usage } = await generateStructured<CVAnalysisResult>({
      instructions: buildCvAnalysisPrompt(),
      input,
      modelTier: "quality",
      jsonSchema: { name: "cv_analysis", schema: CV_ANALYSIS_SCHEMA },
    });

    const stored = await saveAnalysis({
      cvId: body.cvId,
      analysisType: "cv_health",
      result: data,
      model: usage.model,
      cvUpdatedAt: document.updatedAt,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
    });

    logAiOperation("cv_analysis", {
      userId: user.id,
      cvId: body.cvId,
      model: usage.model,
      durationMs: usage.durationMs,
      success: true,
    });

    await logAiGeneration({
      userId: user.id,
      cvId: body.cvId,
      feature: "ats_optimization",
      model: usage.model,
      status: "succeeded",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      metadata: { operation: "cv_health_analysis" },
    });

    return { analysis: data, cached: false, stored };
  });
}
