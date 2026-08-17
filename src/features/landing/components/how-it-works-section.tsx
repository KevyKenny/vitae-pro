"use client";

import { landingSteps } from "@/mocks/landing";

export function ProcessStep({
  step,
  index,
}: {
  step: (typeof landingSteps)[number];
  index: number;
}) {
  return (
    <article className="flex gap-4 rounded-[14px] border border-line bg-surface p-4 shadow-s sm:flex-col sm:p-5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-wash font-mono text-sm font-bold text-emerald">
        {index + 1}
      </span>
      <div>
        <h3 className="font-serif text-lg font-semibold text-ink">{step.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {step.description}
        </p>
      </div>
    </article>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="max-w-xl">
        <h2 className="font-serif text-[1.55rem] font-semibold tracking-tight text-ink sm:text-3xl">
          Three steps to a job-ready CV
        </h2>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          Build it first. $1.99 to download for 14 days, then $6/month.
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
        {landingSteps.map((step, i) => (
          <ProcessStep key={step.id} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}
