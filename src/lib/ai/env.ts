import "server-only";

import { AiServiceError } from "@/lib/ai/errors";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

export function getOpenAIApiKey(): string {
  const key = readEnv("OPENAI_API_KEY");
  if (!key) {
    // Internal only — never surface configuration details to the client.
    throw new AiServiceError(
      "openai_unavailable",
      "AI is temporarily unavailable. Please try again later.",
      503,
    );
  }
  return key;
}

/** Explicit dev fallback — OFF by default. Never silently mock in production. */
export function isAiMockMode(): boolean {
  return readEnv("AI_MOCK_MODE") === "true";
}

export function isOpenAIConfigured(): boolean {
  return Boolean(readEnv("OPENAI_API_KEY"));
}
