import "server-only";

import { z } from "zod";
import { aiErrorResponse } from "@/lib/ai/errors";
import { AiServiceError } from "@/lib/ai/errors";
import { requireAiUser } from "@/lib/ai/auth";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { isOpenAIConfigured, isAiMockMode } from "@/lib/ai/env";

export type AiRouteContext = {
  user: { id: string };
  signal?: AbortSignal;
};

export async function withAiRoute<T>(
  operation: string,
  handler: (ctx: AiRouteContext) => Promise<T>,
): Promise<Response> {
  try {
    if (!isOpenAIConfigured() && !isAiMockMode()) {
      console.error(
        `[ai route ${operation}] OpenAI is not configured. Set OPENAI_API_KEY and restart the server.`,
      );
      throw new AiServiceError(
        "openai_unavailable",
        "AI is temporarily unavailable. Please try again later.",
        503,
      );
    }

    const user = await requireAiUser();
    checkRateLimit(user.id);

    const result = await handler({ user: { id: user.id } });
    return Response.json(result);
  } catch (error) {
    if (error instanceof AiServiceError && error.code === "validation") {
      return Response.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "validation",
          message: error.issues[0]?.message ?? "Invalid request.",
        },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message.includes("too long")) {
      return Response.json(
        {
          error: "input_too_long",
          message: "That content is too long. Please shorten it and try again.",
        },
        { status: 413 },
      );
    }
    console.error(`[ai route ${operation}]`, error);
    return aiErrorResponse(error);
  }
}

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<z.infer<T>> {
  const json = await request.json();
  return schema.parse(json);
}
