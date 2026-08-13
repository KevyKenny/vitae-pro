"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CvTailoringResult } from "@/lib/ai/types";

export function CvTailorCard({
  result,
  loading,
}: {
  result: CvTailoringResult | null;
  loading?: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 rounded-[12px] border border-line bg-emerald-wash/50 px-3.5 py-4 text-sm text-emerald"
        >
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Tailoring CV recommendations…
        </motion.div>
      ) : result ? (
        <motion.div
          key="ready"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-3 rounded-[14px] border border-line-strong bg-surface p-4 shadow-s"
        >
          <p className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
            <Target className="size-3.5" aria-hidden />
            CV tailoring recommendations
          </p>
          <TailorGroup label="Matching skills" items={result.matchingSkills} />
          <TailorGroup
            label="Keywords to consider"
            items={result.missingKeywords}
            tone="gold"
          />
          <TailorGroup label="Relevant experience" items={result.relevantExperience} />
          <TailorGroup label="Areas to strengthen" items={result.areasToStrengthen} />
          <TailorGroup label="Summary suggestions" items={result.summarySuggestions} />
          <TailorGroup
            label="Skills to emphasize"
            items={result.skillsToEmphasize}
            tone="gold"
          />
          {result.recommendations.length ? (
            <ul className="list-disc space-y-1 pl-4 text-sm text-ink-soft">
              {result.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function TailorGroup({
  label,
  items,
  tone = "default",
}: {
  label: string;
  items: string[];
  tone?: "default" | "gold";
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-1.5 text-[0.7rem] font-semibold text-ink-faint uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge key={item} variant={tone === "gold" ? "gold" : "default"}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
