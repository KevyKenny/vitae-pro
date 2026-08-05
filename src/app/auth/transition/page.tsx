"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SuccessAnimation } from "@/features/auth/components";
import { getMockSession } from "@/features/auth/lib/mock-auth";

const stages = [
  "Verifying secure session…",
  "Preparing your workspace…",
  "Loading your career coach…",
] as const;

function subscribe() {
  return () => {};
}

function useSessionSnapshot() {
  return useSyncExternalStore(
    subscribe,
    () => getMockSession(),
    () => null,
  );
}

export default function AuthTransitionPage() {
  const router = useRouter();
  const session = useSessionSnapshot();
  const [stageIndex, setStageIndex] = useState(0);
  const [done, setDone] = useState(false);

  const name = useMemo(
    () => session?.name.split(" ")[0] ?? "there",
    [session?.name],
  );

  useEffect(() => {
    if (!session) {
      router.replace("/auth/sign-in");
      return;
    }

    const timers = [
      window.setTimeout(() => setStageIndex(1), 750),
      window.setTimeout(() => setStageIndex(2), 1500),
      window.setTimeout(() => setDone(true), 2300),
      window.setTimeout(() => {
        router.push(session.needsOnboarding ? "/onboarding" : "/dashboard");
      }, 3200),
    ];

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [router, session]);

  return (
    <div className="flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center text-center lg:min-h-dvh">
      <Logo href="/" className="mb-10" />

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-wash text-emerald">
              <Loader2 className="size-7 animate-spin" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-ink">
              Welcome back, {name}
            </h1>
            <p className="mt-3 min-h-6 text-sm text-ink-soft" aria-live="polite">
              {stages[stageIndex]}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <SuccessAnimation className="mb-6" />
            <h1 className="font-serif text-2xl font-semibold text-ink">
              You&apos;re in
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
              <Sparkles className="size-4 text-gold" aria-hidden />
              Taking you to onboarding…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-paper-dim">
        <motion.div
          className="h-full rounded-full bg-emerald"
          initial={{ width: "8%" }}
          animate={{
            width: done
              ? "100%"
              : `${((stageIndex + 1) / stages.length) * 85}%`,
          }}
          transition={{ duration: 0.45 }}
        />
      </div>
    </div>
  );
}
