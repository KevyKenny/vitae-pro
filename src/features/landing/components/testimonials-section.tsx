"use client";

import { motion } from "framer-motion";
import { landingTestimonials } from "@/mocks/landing";

export function TestimonialCard({
  item,
  index,
}: {
  item: (typeof landingTestimonials)[number];
  index: number;
}) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex h-full flex-col rounded-[16px] border border-line bg-surface p-5 shadow-s"
    >
      <p className="flex-1 text-[0.95rem] leading-relaxed text-ink">
        “{item.quote}”
      </p>
      <footer className="mt-5 flex items-center gap-3">
        <span
          className="flex size-10 items-center justify-center rounded-full bg-emerald-wash font-semibold text-emerald"
          aria-hidden
        >
          {item.initials}
        </span>
        <div>
          <cite className="not-italic font-semibold text-ink">{item.name}</cite>
          <p className="text-[0.78rem] text-ink-faint">{item.role}</p>
        </div>
      </footer>
    </motion.blockquote>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Stories from people getting interviews
        </h2>
        <p className="mt-3 text-ink-soft">
          Students, engineers, marketers, and career switchers — same coach,
          different paths.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {landingTestimonials.map((t, i) => (
          <TestimonialCard key={t.id} item={t} index={i} />
        ))}
      </div>
    </section>
  );
}
