"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/shared/animated-number";
import type { AtsIssue } from "@/lib/analysis/types";
import type { ScoreBreakdown } from "@/types";

export function AtsAnalysisView({
  atsScore,
  breakdown,
  issues,
  onOptimize,
}: {
  atsScore: number;
  breakdown: ScoreBreakdown[];
  issues: AtsIssue[];
  onOptimize: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[14px] border border-line-strong bg-surface p-4">
        <p className="text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
          Estimated ATS compatibility
        </p>
        <p className="mt-1 font-mono text-3xl font-medium text-ink">
          <AnimatedNumber value={atsScore} />
          <span className="text-sm text-ink-faint"> / 100</span>
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          Compatibility varies by ATS system — this is VitatePro&apos;s estimate.
        </p>
      </div>

      <ul className="space-y-2">
        {breakdown.map((item) => (
          <li key={item.id}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-ink-soft">{item.label}</span>
              <span className="font-mono text-ink">{item.score}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-paper-dim">
              <div
                className="h-full rounded-full bg-emerald-bright"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {issues.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            ATS warnings
          </p>
          {issues.map((issue) => (
            <div
              key={issue.title}
              className="rounded-[10px] border border-line bg-paper-dim/50 p-3"
            >
              <div className="mb-1 flex items-center gap-2">
                <Badge variant={issue.severity === "critical" ? "gold" : "outline"}>
                  {issue.severity}
                </Badge>
                <p className="text-sm font-medium text-ink">{issue.title}</p>
              </div>
              <p className="text-xs text-ink-soft">{issue.explanation}</p>
            </div>
          ))}
        </div>
      ) : null}

      <Button type="button" shape="soft" className="w-full" onClick={onOptimize}>
        <Sparkles className="size-4" />
        Optimize for ATS
      </Button>
    </div>
  );
}
