"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { landingStats } from "@/mocks/landing";

export function SocialProofSection() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold tracking-[0.04em] text-ink-faint uppercase">
          Trusted by professionals worldwide
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {landingStats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <p className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
