import type { ResumeHealthItem, ScoreBreakdown } from "@/types";
import type { CVAnalysisResult } from "@/lib/analysis/types";

export function toScoreBreakdown(result: CVAnalysisResult): ScoreBreakdown[] {
  return result.categories.map((c) => ({
    id: c.id,
    label: c.label,
    score: c.score,
  }));
}

export function toResumeHealthItems(
  result: CVAnalysisResult,
): ResumeHealthItem[] {
  return result.categories.map((c) => ({
    id: c.id,
    label: c.label,
    score: c.score,
    recommendation: c.improvements[0] ?? c.explanation,
    status: c.status,
  }));
}

export function toAtsBreakdown(result: CVAnalysisResult): ScoreBreakdown[] {
  return result.atsBreakdown.map((b) => ({
    id: b.id,
    label: b.label,
    score: b.score,
  }));
}
