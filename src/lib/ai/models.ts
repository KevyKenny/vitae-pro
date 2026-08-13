import "server-only";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

export const DEFAULT_AI_MODEL = readEnv("OPENAI_MODEL") ?? "gpt-4o-mini";

export const FAST_AI_MODEL = readEnv("OPENAI_MODEL_FAST") ?? DEFAULT_AI_MODEL;

export const QUALITY_AI_MODEL = readEnv("OPENAI_MODEL_QUALITY") ?? "gpt-4o";

export type AiModelTier = "default" | "fast" | "quality";

export function resolveModel(tier: AiModelTier = "default"): string {
  switch (tier) {
    case "fast":
      return FAST_AI_MODEL;
    case "quality":
      return QUALITY_AI_MODEL;
    default:
      return DEFAULT_AI_MODEL;
  }
}
