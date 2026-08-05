"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { landingTemplatePreview } from "@/mocks/landing";

export function TemplateShowcase() {
  return (
    <section id="templates" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Templates that look hired, not handmade overnight
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Modern, Executive, Minimal, Creative — each scored for ATS fit.
            </p>
          </div>
          <Button asChild variant="outline" shape="soft">
            <Link href="/templates">Browse Templates</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {landingTemplatePreview.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-[16px] border border-line bg-paper shadow-s"
            >
              <div className="aspect-[3/4] bg-paper-dim p-4">
                <div className="h-full rounded-[8px] border border-line bg-surface p-3">
                  <div
                    className="mb-3 h-2.5 w-2/5 rounded-sm opacity-90"
                    style={{ background: t.accent }}
                  />
                  {[85, 70, 60, 75, 50].map((w) => (
                    <div
                      key={w}
                      className="mb-1.5 h-1.5 rounded-sm bg-ink/10"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <p className="font-semibold text-ink">{t.name}</p>
                <span className="text-[0.68rem] font-bold tracking-wide text-emerald uppercase">
                  ATS
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
