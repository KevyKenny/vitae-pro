"use client";

import { motion } from "framer-motion";
import { APP_NAME } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function ProductMockup({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative mx-auto w-full max-w-5xl", className)}
      aria-hidden
    >
      <div className="overflow-hidden rounded-[18px] border border-line-strong bg-surface shadow-l">
        <div className="flex items-center gap-2 border-b border-line bg-paper-dim/80 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 font-mono text-[0.68rem] text-ink-faint">
            {APP_NAME} · CV Editor
          </span>
          <span className="ml-auto rounded-full bg-emerald-wash px-2 py-0.5 text-[0.65rem] font-bold text-emerald">
            Saved
          </span>
        </div>

        <div className="grid min-h-[320px] grid-cols-1 md:grid-cols-[180px_1fr_200px] lg:min-h-[380px]">
          {/* Sections */}
          <aside className="hidden border-r border-line bg-paper p-3 md:block">
            <p className="mb-2 px-2 text-[0.65rem] font-bold tracking-[0.06em] text-ink-faint uppercase">
              Sections
            </p>
            {["Summary", "Experience", "Education", "Skills"].map((s, i) => (
              <div
                key={s}
                className={cn(
                  "mb-1 rounded-[8px] px-2.5 py-2 text-[0.75rem] font-semibold",
                  i === 0
                    ? "bg-emerald-wash text-emerald"
                    : "text-ink-soft",
                )}
              >
                {s}
              </div>
            ))}
          </aside>

          {/* Editor */}
          <div className="space-y-3 bg-paper-dim/40 p-4 sm:p-5">
            <div className="rounded-[12px] border border-emerald bg-surface p-4 shadow-s">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[0.65rem] font-bold tracking-[0.06em] text-ink-faint uppercase">
                  Professional summary
                </p>
                <span className="rounded-full bg-emerald-wash px-2 py-0.5 text-[0.65rem] font-bold text-emerald">
                  ✦ Improve
                </span>
              </div>
              <p className="text-[0.78rem] leading-relaxed text-ink">
                Product designer with 8 years leading onboarding systems — lifted
                day-7 activation by 18% across mobile and web.
              </p>
            </div>
            <div className="rounded-[12px] border border-line bg-surface p-4">
              <p className="mb-2 text-[0.65rem] font-bold tracking-[0.06em] text-gold uppercase">
                AI suggestion
              </p>
              <p className="text-[0.74rem] leading-relaxed text-ink-soft line-through decoration-line-strong/70">
                Worked on company onboarding.
              </p>
              <p className="mt-2 rounded-[8px] bg-emerald-wash p-2.5 text-[0.74rem] leading-relaxed text-ink">
                Led the mobile onboarding redesign that improved day-7 activation
                by 18%, partnering with PM and engineering.
              </p>
            </div>
          </div>

          {/* Preview */}
          <aside className="hidden border-l border-line bg-paper-dim p-3 lg:block">
            <p className="mb-2 px-1 text-[0.65rem] font-bold tracking-[0.06em] text-ink-faint uppercase">
              Live preview
            </p>
            <div className="rounded-[8px] border border-line bg-surface p-3 shadow-s">
              <p className="font-serif text-[0.85rem] font-semibold text-ink">
                Kennedy Sithole
              </p>
              <p className="text-[0.58rem] text-ink-faint">
                Senior Product Designer
              </p>
              <div className="mt-3 space-y-1.5">
                {[70, 90, 55, 80].map((w) => (
                  <div
                    key={w}
                    className="h-1 rounded-sm bg-ink/10"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-dim">
                <div className="h-full w-[92%] rounded-full bg-emerald" />
              </div>
              <p className="mt-1 font-mono text-[0.58rem] text-emerald">
                ATS 92
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -inset-x-8 -bottom-8 -z-10 h-40 bg-gradient-to-t from-paper to-transparent"
        aria-hidden
      />
    </motion.div>
  );
}
