import "server-only";

import type { AiModelTier } from "@/lib/ai/models";
import { resolveModel } from "@/lib/ai/models";
import { getOpenAIClient } from "@/lib/ai/client";
import { isAiMockMode } from "@/lib/ai/env";
import { AiServiceError, mapOpenAIError } from "@/lib/ai/errors";
import { getMockStructured, getMockText } from "@/lib/ai/mock";

export type GenerateTextOptions = {
  instructions: string;
  input: string;
  modelTier?: AiModelTier;
  signal?: AbortSignal;
  jsonSchema?: {
    name: string;
    schema: Record<string, unknown>;
  };
};

export type GenerateTextResult = {
  text: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  durationMs: number;
};

export async function generateText(
  options: GenerateTextOptions,
): Promise<GenerateTextResult> {
  const started = Date.now();
  const model = resolveModel(options.modelTier);

  if (isAiMockMode()) {
    const text = options.jsonSchema
      ? JSON.stringify(getMockStructured(options.jsonSchema.name))
      : getMockText(options.instructions);
    return { text, model: "mock", durationMs: Date.now() - started };
  }

  try {
    const client = getOpenAIClient();
    const response = await client.responses.create(
      {
        model,
        instructions: options.instructions,
        input: options.input,
        ...(options.jsonSchema
          ? {
              text: {
                format: {
                  type: "json_schema" as const,
                  name: options.jsonSchema.name,
                  schema: options.jsonSchema.schema,
                  strict: true,
                },
              },
            }
          : {}),
      },
      { signal: options.signal },
    );

    const text = response.output_text?.trim();
    if (!text) {
      throw new AiServiceError("empty_response", "AI returned an empty response.", 502);
    }

    const usage = response.usage;
    return {
      text,
      model,
      inputTokens: usage?.input_tokens,
      outputTokens: usage?.output_tokens,
      durationMs: Date.now() - started,
    };
  } catch (error) {
    const raw =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : String(error);
    console.error("[ai generateText]", raw);
    throw mapOpenAIError(error);
  }
}

export async function generateStructured<T>(
  options: GenerateTextOptions,
): Promise<{ data: T; usage: GenerateTextResult }> {
  if (!options.jsonSchema) {
    throw new AiServiceError("validation", "Structured output requires a schema.", 400);
  }

  const result = await generateText(options);
  try {
    const data = JSON.parse(result.text) as T;
    return { data, usage: result };
  } catch {
    throw new AiServiceError(
      "parse_error",
      "AI returned an invalid response. Please try again.",
      502,
    );
  }
}

export async function* streamText(
  options: Omit<GenerateTextOptions, "jsonSchema">,
): AsyncGenerator<string, GenerateTextResult, undefined> {
  const started = Date.now();
  const model = resolveModel(options.modelTier);

  if (isAiMockMode()) {
    const mock = getMockText(options.instructions);
    for (const word of mock.split(" ")) {
      yield `${word} `;
      await new Promise((r) => setTimeout(r, 20));
    }
    return { text: mock, model: "mock", durationMs: Date.now() - started };
  }

  const client = getOpenAIClient();
  let fullText = "";

  try {
    const stream = await client.responses.create(
      {
        model,
        instructions: options.instructions,
        input: options.input,
        stream: true,
      },
      { signal: options.signal },
    );

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        const delta = event.delta ?? "";
        fullText += delta;
        yield delta;
      }
    }

    if (!fullText.trim()) {
      throw new AiServiceError("empty_response", "AI returned an empty response.", 502);
    }

    return {
      text: fullText.trim(),
      model,
      durationMs: Date.now() - started,
    };
  } catch (error) {
    throw mapOpenAIError(error);
  }
}
