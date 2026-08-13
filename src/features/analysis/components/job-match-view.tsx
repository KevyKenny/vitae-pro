"use client";

import { Loader2, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { AnalysisRecommendations } from "@/features/analysis/components/analysis-recommendations";
import type { AnalysisRecommendation, JobMatchResult } from "@/lib/analysis/types";

export function JobMatchView({
  jobDescription,
  jobTitle,
  onJobDescriptionChange,
  onJobTitleChange,
  match,
  loading,
  onAnalyze,
  onImprove,
}: {
  jobDescription: string;
  jobTitle: string;
  onJobDescriptionChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
  match: JobMatchResult | null;
  loading: boolean;
  onAnalyze: () => void;
  onImprove: (rec: AnalysisRecommendation) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="match-job-title">Target role (optional)</Label>
        <Input
          id="match-job-title"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          placeholder="e.g. Software Engineer"
          className="bg-surface"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="match-jd">Job description</Label>
        <Textarea
          id="match-jd"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description to compare against your CV…"
          rows={5}
          className="bg-surface"
        />
      </div>
      <Button
        type="button"
        shape="soft"
        className="w-full"
        disabled={loading || jobDescription.trim().length < 20}
        onClick={onAnalyze}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Target className="size-4" />
        )}
        {loading ? "Matching…" : "Compare CV to job"}
      </Button>

      {match ? (
        <div className="space-y-4">
          <div className="rounded-[14px] border border-line-strong bg-surface p-4">
            <p className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.04em] text-emerald uppercase">
              <Sparkles className="size-3.5" />
              Job match · {match.jobTitle || jobTitle || "Target role"}
            </p>
            <p className="mt-1 font-mono text-3xl font-medium text-ink">
              <AnimatedNumber value={match.matchScore} />
              <span className="text-sm text-ink-faint"> / 100</span>
            </p>
            <p className="mt-1 text-xs text-ink-faint">{match.disclaimer}</p>
          </div>

          <ul className="space-y-2">
            {match.breakdown.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-ink-soft">{item.label}</span>
                <span className="font-mono text-ink">{item.score}</span>
              </li>
            ))}
          </ul>

          {match.matchingSkills.length > 0 ? (
            <KeywordGroup label="Matching skills" items={match.matchingSkills} tone="default" />
          ) : null}

          {match.keywords.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
                Keyword analysis
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.keywords.map((kw) => (
                  <Badge
                    key={kw.keyword}
                    variant={
                      kw.status === "present"
                        ? "default"
                        : kw.status === "partial"
                          ? "outline"
                          : "gold"
                    }
                  >
                    {kw.keyword} · {kw.status}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {match.skillGaps.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
                Skill gaps
              </p>
              {match.skillGaps.map((gap) => (
                <div
                  key={gap.skill}
                  className="rounded-[10px] border border-line bg-paper-dim/50 p-3 text-sm"
                >
                  <p className="font-medium text-ink">{gap.skill}</p>
                  <p className="text-xs text-ink-soft">{gap.note}</p>
                </div>
              ))}
            </div>
          ) : null}

          <AnalysisRecommendations
            title="Recommended changes"
            items={match.recommendations}
            onAction={onImprove}
          />
        </div>
      ) : null}
    </div>
  );
}

function KeywordGroup({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "default" | "gold";
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
