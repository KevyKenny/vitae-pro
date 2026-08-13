export type AiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "rate_limited"
  | "input_too_long"
  | "openai_unavailable"
  | "timeout"
  | "empty_response"
  | "parse_error"
  | "content_filtered"
  | "cancelled"
  | "unknown";

export class AiServiceError extends Error {
  readonly code: AiErrorCode;
  readonly status: number;

  constructor(code: AiErrorCode, message: string, status = 500) {
    super(message);
    this.name = "AiServiceError";
    this.code = code;
    this.status = status;
  }
}

export function mapOpenAIError(error: unknown): AiServiceError {
  if (error instanceof AiServiceError) return error;

  const err = error as {
    status?: number;
    code?: string;
    message?: string;
    name?: string;
  };

  const message = err.message ?? "AI request failed";
  const status = err.status ?? 500;
  const lower = message.toLowerCase();

  if (
    lower.includes("not authenticated") ||
    lower.includes("sign in") ||
    lower.includes("session has expired") ||
    lower.includes("jwt")
  ) {
    return new AiServiceError(
      "unauthorized",
      "Your session has expired. Please sign in again.",
      401,
    );
  }

  // Never expose configuration / API key details to the client.
  if (
    lower.includes("openai_api_key") ||
    lower.includes("not configured") ||
    err.code === "invalid_api_key"
  ) {
    return new AiServiceError(
      "openai_unavailable",
      "AI is temporarily unavailable. Please try again later.",
      503,
    );
  }

  if (status === 401) {
    return new AiServiceError(
      "unauthorized",
      "Please sign in to use AI features.",
      401,
    );
  }
  if (status === 429) {
    return new AiServiceError(
      "rate_limited",
      "Too many AI requests. Please wait a moment and try again.",
      429,
    );
  }
  if (status === 408 || err.name === "AbortError") {
    return new AiServiceError("timeout", "The AI request timed out. Please try again.", 408);
  }
  if (err.code === "content_filter" || lower.includes("content_filter")) {
    return new AiServiceError(
      "content_filtered",
      "The AI could not process this content. Please revise and try again.",
      422,
    );
  }

  return new AiServiceError(
    "openai_unavailable",
    "AI is temporarily unavailable. Please try again later.",
    status >= 400 && status < 600 ? status : 503,
  );
}

export function aiErrorResponse(error: unknown): Response {
  const mapped =
    error instanceof AiServiceError ? error : mapOpenAIError(error);
  return Response.json(
    { error: mapped.code, message: mapped.message },
    { status: mapped.status },
  );
}
