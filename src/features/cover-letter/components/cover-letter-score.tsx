"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/animated-number";
import type { CoverLetterScore as ScoreType } from "@/features/cover-letter/types";

export function CoverLetterScore({ score }: { score: ScoreType }) {
  const rows = [
    { label: "Personalization", value: score.breakdown.personalization },
    { label: "Keywords", value: score.breakdown.keywords },
    { label: "Tone", value: score.breakdown.tone },
    { label: "Structure", value: score.breakdown.structure },
    { label: "Grammar", value: score.breakdown.grammar },
  ];

  return (
    <div className="rounded-[14px] border border-line-strong bg-surface p-4 shadow-s">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Cover Letter Score
          </p>
          <p className="mt-1 font-serif text-3xl font-semibold text-ink">
            <AnimatedNumber value={score.total} />
            <span className="text-lg text-ink-faint">/100</span>
          </p>
        </div>
        <motion.div
          className="relative size-14"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <svg viewBox="0 0 36 36" className="size-14 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-paper-dim"
              strokeWidth="3"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-emerald"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${score.total} 100`}
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${score.total} 100` }}
              transition={{ duration: 0.8 }}
            />
          </svg>
        </motion.div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-1 flex justify-between text-[0.74rem]">
              <span className="text-ink-soft">{row.label}</span>
              <span className="font-semibold text-ink">{row.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-paper-dim">
              <motion.div
                className="h-full rounded-full bg-emerald"
                initial={{ width: 0 }}
                animate={{ width: `${row.value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </li>
        ))}
      </ul>

      {score.recommendations.length ? (
        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-1.5 text-[0.7rem] font-semibold text-ink-faint uppercase">
            Recommendations
          </p>
          <ul className="space-y-1.5 text-[0.78rem] text-ink-soft">
            {score.recommendations.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
