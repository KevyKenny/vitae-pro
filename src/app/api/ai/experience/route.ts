import { withAiRoute, parseJsonBody } from "@/lib/ai/route-handler";
import { experienceRequestSchema } from "@/lib/ai/schemas";
import { assertCvOwnership } from "@/lib/ai/auth";
import { getCvWithContentServer } from "@/lib/cvs/server-access";
import {
  buildExperiencePrompt,
  EXPERIENCE_BULLETS_SCHEMA,
  EXPERIENCE_SUGGESTION_SCHEMA,
} from "@/lib/ai/prompts/experience";
import { generateStructured } from "@/lib/ai/generate";
import { logAiGeneration, logAiOperation } from "@/lib/ai/usage";
import type {
  ExperienceBulletsResult,
  ExperienceImprovementResult,
} from "@/lib/ai/types";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  return withAiRoute("experience", async ({ user }) => {
    const body = await parseJsonBody(request, experienceRequestSchema);
    await assertCvOwnership(body.cvId, user.id);

    const document = await getCvWithContentServer(body.cvId);
    const exp =
      body.experienceId != null
        ? document.experience.find((e) => e.id === body.experienceId)
        : document.experience[0];

    const isBullets =
      body.mode === "bullets" ||
      body.action === "bullets" ||
      (!body.text?.trim() && Boolean(body.description?.trim()));

    if (isBullets) {
      const input = JSON.stringify(
        {
          jobTitle: body.jobTitle ?? ("position" in (exp ?? {}) ? (exp as { position?: string }).position : ""),
          company: body.company ?? ("company" in (exp ?? {}) ? (exp as { company?: string }).company : ""),
          description:
            body.description ??
            body.text ??
            ("responsibilities" in (exp ?? {})
              ? (exp as { responsibilities?: string[] }).responsibilities?.join("\n")
              : "") ??
            ("achievements" in (exp ?? {})
              ? (exp as { achievements?: string[] }).achievements?.join("\n")
              : "") ??
            "",
        },
        null,
        2,
      );

      const { data, usage } = await generateStructured<ExperienceBulletsResult>({
        instructions: buildExperiencePrompt(body.action, "bullets"),
        input,
        modelTier: "default",
        jsonSchema: {
          name: "experience_bullets",
          schema: EXPERIENCE_BULLETS_SCHEMA,
        },
      });

      logAiOperation("experience_bullets", {
        userId: user.id,
        cvId: body.cvId,
        model: usage.model,
        durationMs: usage.durationMs,
        success: true,
      });

      await logAiGeneration({
        userId: user.id,
        cvId: body.cvId,
        feature: "achievement_generation",
        model: usage.model,
        status: "succeeded",
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        metadata: { action: body.action, mode: "bullets" },
      });

      return { id: randomUUID(), ...data };
    }

    let text = body.text?.trim() ?? "";
    if (!text && exp && body.bulletIndex != null) {
      const field = body.field ?? "responsibilities";
      const list =
        field === "achievements"
          ? ("achievements" in exp ? exp.achievements : [])
          : ("responsibilities" in exp ? exp.responsibilities : []);
      text = list[body.bulletIndex] ?? "";
    }
    if (!text.trim()) {
      throw new Error("Provide text to improve.");
    }

    const input = JSON.stringify(
      {
        action: body.action,
        text,
        experienceType: exp?.experienceType,
        role:
          exp && "position" in exp
            ? exp.position
            : exp && "role" in exp
              ? exp.role
              : undefined,
        company:
          exp && "company" in exp
            ? exp.company
            : exp && "organization" in exp
              ? exp.organization
              : undefined,
      },
      null,
      2,
    );

    const { data, usage } =
      await generateStructured<ExperienceImprovementResult>({
        instructions: buildExperiencePrompt(body.action, "single"),
        input,
        modelTier: "default",
        jsonSchema: {
          name: "ai_suggestion",
          schema: EXPERIENCE_SUGGESTION_SCHEMA,
        },
      });

    logAiOperation("experience", {
      userId: user.id,
      cvId: body.cvId,
      model: usage.model,
      durationMs: usage.durationMs,
      success: true,
    });

    await logAiGeneration({
      userId: user.id,
      cvId: body.cvId,
      feature: "experience_rewrite",
      model: usage.model,
      status: "succeeded",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      metadata: { action: body.action, mode: "single" },
    });

    return { id: randomUUID(), ...data };
  });
}
