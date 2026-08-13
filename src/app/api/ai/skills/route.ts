import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { skillsRequestSchema } from "@/lib/ai/schemas";
import { assertCvOwnership } from "@/lib/ai/auth";
import { getCvWithContentServer } from "@/lib/cvs/server-access";
import { serializeCvContext } from "@/lib/ai/cv-context";
import { buildSkillsPrompt, SKILLS_SCHEMA } from "@/lib/ai/prompts/skills";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import type { SkillsSuggestionResult } from "@/lib/ai/types";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  return withAiRoute("skills", async ({ user }) => {
    const body = await parseJsonBody(request, skillsRequestSchema);
    await assertCvOwnership(body.cvId, user.id);

    const cv = await getCvWithContentServer(body.cvId);
    const cvContext = body.cvContext ?? serializeCvContext(cv);

    const input = JSON.stringify(
      {
        targetRole: body.targetRole ?? cv.personal.title,
        jobDescription: body.jobDescription ?? "",
        cvContext: JSON.parse(cvContext),
        existingSkills: cv.skills.map((s) => s.name),
      },
      null,
      2,
    );

    const { data, usage } = await generateStructured<SkillsSuggestionResult>({
      instructions: buildSkillsPrompt(),
      input,
      modelTier: "fast",
      jsonSchema: { name: "skills_suggestions", schema: SKILLS_SCHEMA },
    });

    logAiOperation("skills", {
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
      metadata: { operation: "skills_suggestion" },
    });

    const demonstrated = data.demonstratedSkills.join(", ");
    const consider = data.skillsToConsider.join(", ");
    const suggestion = [
      demonstrated ? `Skills you demonstrate: ${demonstrated}.` : "",
      consider ? `Consider adding: ${consider}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      id: randomUUID(),
      ...data,
      suggestion: suggestion || data.explanation,
    };
  });
}
