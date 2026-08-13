"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { FilePlus2, Flame, Mail, PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { useProfile } from "@/features/auth/hooks/use-auth";
import { useCreateCv } from "@/features/cv-editor/hooks/use-create-cv";
import { listUserCvs, type CvListItem } from "@/lib/cvs";
import { mockMotivationalMessages } from "@/mocks";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function useGreeting() {
  return useSyncExternalStore(
    () => () => {},
    () => greetingForHour(new Date().getHours()),
    () => "Good evening",
  );
}

function heroCopy(latest: CvListItem | null): {
  headline: string;
  subline: string;
  primaryLabel: string;
  primaryHref: string;
  primaryAction?: "create";
} {
  if (!latest) {
    return {
      headline: "Let's create your CV",
      subline:
        "Start with your experience, education, or skills. VitatePro will help you turn your information into a professional CV.",
      primaryLabel: "Create my CV",
      primaryHref: "/cvs/new",
      primaryAction: "create",
    };
  }

  const completion = latest.completion ?? 0;
  if (completion >= 80) {
    return {
      headline: "Your CV is ready",
      subline: `${latest.title} is ${completion}% complete. Preview, analyze, or download when you're ready.`,
      primaryLabel: "Open CV",
      primaryHref: `/cvs/${latest.id}/edit`,
    };
  }

  return {
    headline: "Continue your CV",
    subline: `${latest.title} is ${completion}% complete — pick up where you left off.`,
    primaryLabel: "Continue",
    primaryHref: `/cvs/${latest.id}/edit`,
  };
}

export function WelcomeHero() {
  const { profile, completion } = useProfile();
  const { creating, createAndOpen } = useCreateCv();
  const [latest, setLatest] = useState<CvListItem | null>(null);
  const firstName = profile?.first_name?.trim() || "there";
  const greeting = useGreeting();
  const message = mockMotivationalMessages[0];
  const streak = 1;
  const copy = heroCopy(latest);

  useEffect(() => {
    let cancelled = false;
    void listUserCvs()
      .then((cvs) => {
        if (!cancelled) setLatest(cvs[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setLatest(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[18px] border border-line bg-surface p-5 shadow-s sm:rounded-[22px] sm:p-6 lg:p-8"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 92% 12%, rgba(47,122,92,0.14), transparent 34%), radial-gradient(circle at 8% 88%, rgba(176,141,62,0.12), transparent 36%)",
        }}
      />
      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_auto] lg:items-center">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="default" className="gap-1.5">
              <Flame className="size-3.5" aria-hidden />
              {streak}-day streak
            </Badge>
            <Badge variant="outline">{completion}% profile complete</Badge>
            {latest ? (
              <Badge variant="outline">{latest.completion ?? 0}% CV complete</Badge>
            ) : null}
          </div>
          <h1 className="font-serif text-[1.75rem] font-semibold tracking-[-0.02em] text-ink sm:text-3xl lg:text-4xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-2 text-base font-medium text-ink">{copy.headline}</p>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">{copy.subline}</p>
          {!latest ? (
            <p className="mt-1 max-w-xl text-xs text-ink-faint">{message}</p>
          ) : null}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {copy.primaryAction === "create" ? (
              <Button
                type="button"
                shape="soft"
                className="w-full sm:w-auto"
                disabled={creating}
                onClick={() => void createAndOpen()}
              >
                <PencilLine className="size-4" />
                {creating ? "Opening…" : copy.primaryLabel}
              </Button>
            ) : (
              <Button asChild shape="soft" className="w-full sm:w-auto">
                <Link href={copy.primaryHref}>
                  <PencilLine className="size-4" />
                  {copy.primaryLabel}
                </Link>
              </Button>
            )}
            {latest ? (
              <Button
                type="button"
                variant="outline"
                shape="soft"
                className="w-full sm:w-auto"
                disabled={creating}
                onClick={() => void createAndOpen()}
              >
                <FilePlus2 className="size-4" />
                Create another CV
              </Button>
            ) : null}
            <Button
              asChild
              variant="secondary"
              shape="soft"
              className="w-full sm:w-auto"
            >
              <Link href="/cover-letter">
                <Mail className="size-4" />
                Generate Cover Letter
              </Link>
            </Button>
          </div>
        </div>

        <div className="justify-self-start rounded-[18px] border border-line bg-paper-dim/70 px-6 py-5 lg:justify-self-end">
          <p className="text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">
            {latest?.score != null ? "CV score" : "Resume score"}
          </p>
          <p className="mt-2 font-mono text-4xl font-medium text-emerald">
            <AnimatedNumber
              value={latest?.score ?? 0}
              suffix={<span className="text-lg text-ink-faint">/100</span>}
            />
          </p>
          <p className="mt-2 text-xs text-ink-soft">
            {latest
              ? `${latest.completion ?? 0}% complete · ${latest.title}`
              : "Create a CV to start scoring"}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
