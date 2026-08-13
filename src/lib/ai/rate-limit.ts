import "server-only";

import {
  AI_RATE_LIMIT_MAX,
  AI_RATE_LIMIT_WINDOW_MS,
} from "@/lib/ai/limits";
import { AiServiceError } from "@/lib/ai/errors";

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

export function checkRateLimit(userId: string): void {
  const now = Date.now();
  const current = windows.get(userId);

  if (!current || now >= current.resetAt) {
    windows.set(userId, { count: 1, resetAt: now + AI_RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (current.count >= AI_RATE_LIMIT_MAX) {
    throw new AiServiceError(
      "rate_limited",
      "Too many AI requests. Please wait a moment and try again.",
      429,
    );
  }

  current.count += 1;
}
