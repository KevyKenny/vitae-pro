const AUTH_KEY = "VitatePro.auth";
const ONBOARDING_KEY = "VitatePro.onboarding";

export type MockAuthSession = {
  email: string;
  name: string;
  authenticatedAt: string;
  provider: "email" | "google" | "github";
  needsOnboarding: boolean;
};

export type MockOnboardingDraft = {
  step: number;
  data: Record<string, unknown>;
  updatedAt: string;
};

function delay(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getMockSession(): MockAuthSession | null {
  return readJson<MockAuthSession>(AUTH_KEY);
}

export function clearMockSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}

export async function mockSignIn(input: {
  email: string;
  password: string;
  name?: string;
  provider?: MockAuthSession["provider"];
  needsOnboarding?: boolean;
}): Promise<MockAuthSession> {
  await delay();
  if (!input.email.includes("@")) {
    throw new Error("Invalid credentials");
  }
  if (input.provider === "email" && input.password.length < 1) {
    throw new Error("Invalid credentials");
  }

  const session: MockAuthSession = {
    email: input.email,
    name: input.name ?? input.email.split("@")[0] ?? "Member",
    authenticatedAt: new Date().toISOString(),
    provider: input.provider ?? "email",
    needsOnboarding: input.needsOnboarding ?? true,
  };
  writeJson(AUTH_KEY, session);
  return session;
}

export async function mockSignUp(input: {
  email: string;
  fullName: string;
  password: string;
}): Promise<MockAuthSession> {
  await delay(1100);
  const session: MockAuthSession = {
    email: input.email,
    name: input.fullName,
    authenticatedAt: new Date().toISOString(),
    provider: "email",
    needsOnboarding: true,
  };
  writeJson(AUTH_KEY, session);
  return session;
}

export async function mockSocialAuth(
  provider: "google" | "github",
): Promise<MockAuthSession> {
  await delay(1000);
  const session: MockAuthSession = {
    email:
      provider === "google"
        ? "kennedy.Sithole@gmail.com"
        : "kennedy.Sithole@users.noreply.github.com",
    name: "Kennedy Sithole",
    authenticatedAt: new Date().toISOString(),
    provider,
    needsOnboarding: true,
  };
  writeJson(AUTH_KEY, session);
  return session;
}

export async function mockForgotPassword(email: string): Promise<{ ok: true }> {
  await delay(1000);
  if (!email.includes("@")) throw new Error("Invalid email");
  return { ok: true };
}

export async function mockResendVerification(): Promise<{ ok: true }> {
  await delay(800);
  return { ok: true };
}

export function getOnboardingDraft(): MockOnboardingDraft | null {
  return readJson<MockOnboardingDraft>(ONBOARDING_KEY);
}

export function saveOnboardingDraft(draft: MockOnboardingDraft) {
  writeJson(ONBOARDING_KEY, draft);
}

export function clearOnboardingDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_KEY);
}

export async function mockCompleteOnboarding(): Promise<void> {
  await delay(700);
  const session = getMockSession();
  if (session) {
    writeJson(AUTH_KEY, { ...session, needsOnboarding: false });
  }
  clearOnboardingDraft();
}
