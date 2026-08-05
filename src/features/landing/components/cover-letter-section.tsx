"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CoverLetterSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-2 overflow-hidden rounded-[18px] border border-line bg-surface shadow-m lg:order-1"
        >
          <div className="border-b border-line bg-paper-dim/70 px-4 py-3 text-sm font-semibold text-ink">
            Cover letter builder
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="space-y-3 border-b border-line p-4 sm:border-r sm:border-b-0">
              <p className="text-[0.68rem] font-bold tracking-[0.05em] text-ink-faint uppercase">
                Job description
              </p>
              <div className="min-h-36 rounded-[10px] border border-line bg-paper p-3 text-[0.74rem] leading-relaxed text-ink-soft">
                Senior Product Designer · own onboarding and growth surfaces for
                2M+ users. Partner with PM and engineering…
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Confident", "Medium"].map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-emerald-wash px-2.5 py-1 text-[0.68rem] font-semibold text-emerald"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2 p-4">
              <p className="text-[0.68rem] font-bold tracking-[0.05em] text-ink-faint uppercase">
                AI draft
              </p>
              <p className="font-serif text-[0.82rem] leading-relaxed text-ink">
                Northwind&apos;s focus on activation is the problem space I&apos;ve owned —
                leading onboarding systems that turn first sessions into lasting
                habits…
              </p>
              <p className="text-[0.74rem] text-ink-soft">
                Personalized to company, tone, and your strongest proof points.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Create a cover letter tailored to every opportunity.
          </h2>
          <p className="mt-4 text-ink-soft">
            Paste the posting, choose a tone, and let VitatePro match your
            experience to the role — ready to refine and send.
          </p>
          <Button asChild shape="soft" className="mt-8">
            <Link href="/cover-letter">Generate a cover letter</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
