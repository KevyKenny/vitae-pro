/** Map Supabase Auth errors to user-facing copy. */
export function authErrorMessage(error: unknown, fallback?: string): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: string }).message ?? "")
      : typeof error === "string"
        ? error
        : "";

  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "We couldn't sign you in with those details. Please check your email and password and try again.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Please verify your email before signing in. Check your inbox for the confirmation link.";
  }
  if (
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (normalized.includes("password") && normalized.includes("weak")) {
    return "Please choose a stronger password with at least 8 characters, including upper and lowercase letters and a number.";
  }
  if (normalized.includes("signup is disabled")) {
    return "New sign-ups are temporarily unavailable. Please try again later.";
  }
  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests")
  ) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (
    normalized.includes("network") ||
    normalized.includes("fetch") ||
    normalized.includes("failed to fetch")
  ) {
    return "We couldn't reach the authentication service. Check your connection and try again.";
  }
  if (normalized.includes("session") || normalized.includes("expired")) {
    return "Your session has expired. Please sign in again.";
  }
  if (normalized.includes("otp") || normalized.includes("token")) {
    return "This link is invalid or has expired. Request a new one and try again.";
  }

  return (
    fallback ??
    "Something went wrong. Please try again in a moment."
  );
}
