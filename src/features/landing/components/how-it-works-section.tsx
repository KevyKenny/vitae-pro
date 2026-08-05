"use client";

import { motion } from "framer-motion";
import { landingSteps } from "@/mocks/landing";

export function ProcessStep({
  step,
  index,
}: {
  step: (typeof landingSteps)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="relative rounded-[16px] border border-line bg-surface p-5 shadow-s"
    >
      <span className="font-mono text-[0.72rem] font-bold text-emerald">
        Step {step.id}
      </span>
      <h3 className="mt-2 font-serif text-lg font-semibold text-ink">
        {step.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {step.description}
      </p>
    </motion.article>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-ink-soft">
          From blank page to application-ready in four intentional steps.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {landingSteps.map((step, i) => (
          <ProcessStep key={step.id} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}
