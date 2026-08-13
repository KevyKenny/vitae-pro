"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SuccessAnimation } from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks/use-auth";

const stages = [
  "Verifying secure session…",
  "Preparing your workspace…",
  "Loading your career coach…",
] as const;

export default function AuthTransitionPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [stageIndex, setStageIndex] = useState(0);
  const [done, setDone] = useState(false);

  const name = useMemo(() => {
    const fromProfile = [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fromProfile) return fromProfile.split(" ")[0];
    const meta = user?.user_metadata?.first_name as string | undefined;
    if (meta) return meta;
    return user?.email?.split("@")[0] ?? "there";
  }, [profile, user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth/sign-in");
      return;
    }

    const timers = [
      window.setTimeout(() => setStageIndex(1), 750),
      window.setTimeout(() => setStageIndex(2), 1500),
      window.setTimeout(() => setDone(true), 2300),
      window.setTimeout(() => {
        const needsOnboarding = profile
          ? !profile.onboarding_completed
          : true;
        router.replace(needsOnboarding ? "/onboarding" : "/dashboard");
      }, 2800),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [authLoading, user, profile, router]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-paper px-6">
      <div className="absolute top-8 left-8">
        <Logo href="/" />
      </div>
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-[18px] bg-emerald-wash text-emerald">
          {done ? (
            <SuccessAnimation size="md" />
          ) : (
            <Sparkles className="size-7" aria-hidden />
          )}
        </div>
        <h1 className="font-serif text-3xl font-semibold text-ink">
          {done ? `Welcome, ${name}` : "Setting things up"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {done
            ? "Taking you to your workspace…"
            : "This only takes a moment."}
        </p>

        <div className="mt-10 space-y-3 text-left">
          <AnimatePresence mode="wait">
            {stages.map((stage, index) => {
              if (index > stageIndex) return null;
              const active = index === stageIndex && !done;
              return (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-[12px] border border-line bg-surface px-4 py-3"
                >
                  {active ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-emerald" />
                  ) : (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald text-[10px] font-bold text-paper">
                      ✓
                    </span>
                  )}
                  <span className="text-sm font-medium text-ink">{stage}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
