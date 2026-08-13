/** Map Supabase / cover letter persistence errors to user-facing copy. */
export function coverLetterErrorMessage(
  error: unknown,
  fallback?: string,
): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: string }).message ?? "")
      : typeof error === "string"
        ? error
        : "";

  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code?: string }).code ?? "")
      : "";

  const normalized = message.toLowerCase();

  if (
    normalized.includes("not authenticated") ||
    normalized.includes("jwt") ||
    code === "PGRST301"
  ) {
    return "Your session has expired. Please sign in again.";
  }
  if (
    normalized.includes("permission") ||
    normalized.includes("row-level security") ||
    normalized.includes("unauthorized") ||
    code === "42501"
  ) {
    return "You don't have permission to access this cover letter.";
  }
  if (
    normalized.includes("0 rows") ||
    normalized.includes("not found") ||
    code === "PGRST116"
  ) {
    return "We couldn't find that cover letter. It may have been deleted.";
  }
  if (
    normalized.includes("network") ||
    normalized.includes("fetch") ||
    normalized.includes("failed to fetch")
  ) {
    return "We couldn't reach the server. Check your connection and try again.";
  }
  if (normalized.includes("session") || normalized.includes("expired")) {
    return "Your session has expired. Please sign in again.";
  }
  if (
    normalized.includes("duplicate") ||
    normalized.includes("violates unique")
  ) {
    return "Something conflicted while saving. Please refresh and try again.";
  }
  if (
    normalized.includes("save") ||
    normalized.includes("insert") ||
    normalized.includes("update")
  ) {
    return fallback ?? "We couldn't save your cover letter. Please try again.";
  }

  return fallback ?? "Something went wrong. Please try again in a moment.";
}
