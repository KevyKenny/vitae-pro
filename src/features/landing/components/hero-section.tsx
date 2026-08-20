"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCvLink } from "@/features/landing/components/create-cv-link";
import { APP_NAME } from "@/lib/constants/navigation";

const TRUST = [
  "Create your CV for free",
  "AI assistance as you write",
  "Download for $1.99 — lasts 14 days",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 50% -15%, rgba(31,77,61,0.16), transparent 55%), radial-gradient(ellipse 45% 35% at 100% 10%, rgba(176,141,62,0.10), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6 sm:pt-16 sm:pb-12 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.72rem] font-bold tracking-[0.08em] text-emerald uppercase">
            {APP_NAME}
          </p>
          <h1 className="mt-3 font-serif text-[1.85rem] leading-[1.15] font-semibold tracking-[-0.03em] text-ink sm:text-4xl md:text-[2.75rem]">
            Create a professional CV in minutes.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-soft sm:mt-4 sm:text-base">
            Get AI help, pick a template, and download when you&apos;re happy.
            $1.99 unlocks downloads for 14 days — then $6/month.
          </p>
          <div className="mt-6 flex w-full flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
            <Button
              asChild
              size="lg"
              shape="soft"
              className="h-12 w-full text-[0.95rem] sm:h-12 sm:w-auto sm:min-w-[200px]"
            >
              <CreateCvLink>Create My CV</CreateCvLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              shape="soft"
              className="h-12 w-full text-[0.95rem] sm:h-12 sm:w-auto sm:min-w-[200px]"
            >
              <a href="#templates">Choose a template</a>
            </Button>
          </div>
          <ul className="mt-6 flex flex-col items-center gap-2 text-[0.78rem] text-ink-faint sm:mt-7 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2">
            {TRUST.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 shrink-0 text-emerald" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
