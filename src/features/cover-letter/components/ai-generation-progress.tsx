"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import { generationSteps } from "@/mocks/cover-letter-builder";
import { cn } from "@/lib/utils";

export function AIGenerationProgress({
  active,
  stepIndex,
}: {
  active: boolean;
  stepIndex: number;
}) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="mb-4 rounded-[14px] border border-emerald/20 bg-emerald-wash/60 p-4">
            <p className="mb-3 flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
              <Sparkles className="size-3.5" aria-hidden />
              AI writing in progress
            </p>
            <ol className="space-y-2.5">
              {generationSteps.map((step, i) => {
                const done = i < stepIndex;
                const current = i === stepIndex;
                return (
                  <li key={step.id} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full",
                        done && "bg-emerald text-paper",
                        current && "bg-emerald text-paper",
                        !done && !current && "bg-surface text-ink-faint",
                      )}
                    >
                      {done ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : current ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      ) : (
                        <span className="text-[0.65rem] font-bold">{i + 1}</span>
                      )}
                    </span>
                    <span
                      className={cn(
                        current ? "font-semibold text-ink" : "text-ink-soft",
                        done && "text-ink",
                      )}
                    >
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
              <motion.div
                className="h-full rounded-full bg-emerald"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((stepIndex + 1) / generationSteps.length) * 100}%`,
                }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
