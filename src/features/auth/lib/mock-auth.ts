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

type CacheEntry<T> = { raw: string | null; value: T | null };

const listeners = new Set<() => void>();
let sessionCache: CacheEntry<MockAuthSession> | null = null;
let onboardingCache: CacheEntry<MockOnboardingDraft> | null = null;

function delay(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function notify() {
  listeners.forEach((listener) => listener());
}

/** Subscribe to auth/onboarding localStorage changes (for useSyncExternalStore). */
export function subscribeMockAuth(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = () => {
    sessionCache = null;
    onboardingCache = null;
    onStoreChange();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function readCached<T>(
  key: string,
  cache: CacheEntry<T> | null,
  setCache: (entry: CacheEntry<T>) => void,
): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (cache && cache.raw === raw) return cache.value;
  let value: T | null = null;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = null;
    }
  }
  setCache({ raw, value });
  return value;
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getMockSession(): MockAuthSession | null {
  return readCached(AUTH_KEY, sessionCache, (entry) => {
    sessionCache = entry;
  });
}

export function clearMockSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
  sessionCache = { raw: null, value: null };
  notify();
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
  sessionCache = { raw: JSON.stringify(session), value: session };
  notify();
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
  sessionCache = { raw: JSON.stringify(session), value: session };
  notify();
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
  sessionCache = { raw: JSON.stringify(session), value: session };
  notify();
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
  return readCached(ONBOARDING_KEY, onboardingCache, (entry) => {
    onboardingCache = entry;
  });
}

export function saveOnboardingDraft(draft: MockOnboardingDraft) {
  writeJson(ONBOARDING_KEY, draft);
  onboardingCache = { raw: JSON.stringify(draft), value: draft };
  notify();
}

export function clearOnboardingDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_KEY);
  onboardingCache = { raw: null, value: null };
  notify();
}

export async function mockCompleteOnboarding(): Promise<void> {
  await delay(700);
  const session = getMockSession();
  if (session) {
    const next = { ...session, needsOnboarding: false };
    writeJson(AUTH_KEY, next);
    sessionCache = { raw: JSON.stringify(next), value: next };
    notify();
  }
  clearOnboardingDraft();
}
