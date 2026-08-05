"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { FilePlus2, Flame, Mail, PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { mockCurrentUser, mockMotivationalMessages } from "@/mocks";
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

export function WelcomeHero() {
  const firstName = mockCurrentUser.name.split(" ")[0] ?? "there";
  const greeting = useGreeting();
  const message = mockMotivationalMessages[0];
  const completion = mockCurrentUser.profileCompletion ?? 78;
  const streak = mockCurrentUser.streakDays ?? 12;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[22px] border border-line bg-surface p-6 shadow-s sm:p-8"
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
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-2 text-base text-ink-soft">
            Welcome back to VitatePro.
          </p>
          <p className="mt-1 max-w-xl text-sm text-ink-faint">{message}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild shape="soft">
              <Link href="/cvs/cv_1/edit">
                <PencilLine className="size-4" />
                Continue Editing
              </Link>
            </Button>
            <Button asChild variant="outline" shape="soft">
              <Link href="/cvs/cv_1/edit">
                <FilePlus2 className="size-4" />
                Create New CV
              </Link>
            </Button>
            <Button asChild variant="secondary" shape="soft">
              <Link href="/cover-letter">
                <Mail className="size-4" />
                Generate Cover Letter
              </Link>
            </Button>
          </div>
        </div>

        <div className="justify-self-start rounded-[18px] border border-line bg-paper-dim/70 px-6 py-5 lg:justify-self-end">
          <p className="text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">
            Resume score
          </p>
          <p className="mt-2 font-mono text-4xl font-medium text-emerald">
            <AnimatedNumber
              value={88}
              suffix={<span className="text-lg text-ink-faint">/100</span>}
            />
          </p>
          <p className="mt-2 text-xs text-ink-soft">Up 6 pts since last edit</p>
        </div>
      </div>
    </motion.section>
  );
}
