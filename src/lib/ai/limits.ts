/** Maximum characters accepted for a single text field in AI requests. */
export const AI_MAX_FIELD_CHARS = 12_000;

/** Maximum characters for job descriptions. */
export const AI_MAX_JOB_DESCRIPTION_CHARS = 20_000;

/** Maximum characters for aggregated CV context payloads. */
export const AI_MAX_CV_CONTEXT_CHARS = 24_000;

/** Per-user requests allowed within the rate-limit window. */
export const AI_RATE_LIMIT_MAX = 40;

/** Rate-limit window in milliseconds (1 minute). */
export const AI_RATE_LIMIT_WINDOW_MS = 60_000;

export function assertMaxLength(
  value: string,
  max: number,
  label: string,
): void {
  if (value.length > max) {
    throw new Error(
      `${label} is too long (${value.length} chars). Maximum is ${max}.`,
    );
  }
}
