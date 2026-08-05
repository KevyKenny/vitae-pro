"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { SectionCard } from "@/components/shared/section-card";
import type { ScoreBreakdown } from "@/types";

export function ResumeScoreWidget({
  total,
  breakdown,
}: {
  total: number;
  breakdown: ScoreBreakdown[];
}) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (total / 100) * circumference;

  return (
    <SectionCard title="Resume Score">
      <div className="flex flex-col items-center gap-6 pb-4 sm:flex-row sm:items-start">
        <div className="relative size-[148px] shrink-0">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--paper-dim)"
              strokeWidth="10"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--emerald)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: offset }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-3xl font-medium text-ink">
              <AnimatedNumber value={total} />
            </p>
            <p className="text-xs text-ink-faint">/ 100</p>
          </div>
        </div>

        <ul className="w-full flex-1 space-y-2.5">
          {breakdown.map((item) => (
            <li key={item.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-ink-soft">{item.label}</span>
                <span className="font-mono text-ink">{item.score}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-paper-dim">
                <motion.div
                  className="h-full rounded-full bg-emerald-bright"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}
