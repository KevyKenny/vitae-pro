"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobAnalysis } from "@/features/cover-letter/types";

export function JobAnalysisCard({
  analysis,
  loading,
}: {
  analysis: JobAnalysis | null;
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
          Analyzing job description…
        </motion.div>
      ) : analysis ? (
        <motion.div
          key="ready"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-3 rounded-[14px] border border-line-strong bg-surface p-4 shadow-s"
        >
          <p className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
            <Sparkles className="size-3.5" aria-hidden />
            Job analysis
          </p>
          <AnalysisGroup label="Detected skills" items={analysis.skills} />
          <AnalysisGroup label="Keywords" items={analysis.keywords} tone="gold" />
          <AnalysisGroup
            label="Experience requirements"
            items={analysis.experienceRequirements}
          />
          <AnalysisGroup label="Company values" items={analysis.companyValues} />
          <AnalysisGroup
            label="Role expectations"
            items={analysis.roleExpectations}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AnalysisGroup({
  label,
  items,
  tone = "default",
}: {
  label: string;
  items: string[];
  tone?: "default" | "gold";
}) {
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
