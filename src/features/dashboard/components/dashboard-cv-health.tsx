"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/shared/section-card";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { listUserCvs } from "@/lib/cvs";
import { aiApi } from "@/features/ai/api";
import type { CVAnalysisResult } from "@/lib/analysis/types";

export function DashboardCvHealth() {
  const [cvId, setCvId] = useState<string | null>(null);
  const [cvTitle, setCvTitle] = useState("");
  const [result, setResult] = useState<CVAnalysisResult | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const cvs = await listUserCvs();
        const target = cvs.find((c) => c.isDefault) ?? cvs[0];
        if (!target || cancelled) {
          setLoading(false);
          return;
        }
        setCvId(target.id);
        setCvTitle(target.title);
        const { analysis } = await aiApi.getCachedAnalysis(target.id, "cv_health");
        if (cancelled) return;
        if (analysis && analysis.analysisType === "cv_health") {
          setResult(analysis.result as CVAnalysisResult);
          setIsStale(analysis.isStale);
        }
      } catch {
        /* optional widget */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !cvId) return null;
  if (!result) {
    return (
      <SectionCard title="CV Health">
        <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">
            Get VitatePro&apos;s AI assessment of{" "}
            <strong className="text-ink">{cvTitle || "your CV"}</strong>.
          </p>
          <Button asChild shape="soft" size="sm">
            <Link href={`/cvs/${cvId}/edit?analyze=1`}>
              <Sparkles className="size-4" />
              Analyze CV
            </Link>
          </Button>
        </div>
      </SectionCard>
    );
  }

  const topRecs = result.improvementPlan.slice(0, 3);

  return (
    <SectionCard title="CV Health">
      <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-3xl font-medium text-emerald">
              <AnimatedNumber value={result.overallScore} />
              <span className="text-sm text-ink-faint"> / 100</span>
            </p>
            <Badge variant="outline">AI assessment</Badge>
            {isStale ? <Badge variant="gold">Stale</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {topRecs.length} improvement{topRecs.length === 1 ? "" : "s"} recommended
            {cvTitle ? ` · ${cvTitle}` : ""}
          </p>
          {topRecs[0] ? (
            <p className="mt-2 text-xs text-ink-faint">{topRecs[0].title}</p>
          ) : null}
        </div>
        <Button asChild shape="soft" size="sm" className="shrink-0">
          <Link href={`/cvs/${cvId}/edit?analyze=1`}>
            <BarChart3 className="size-4" />
            Review
          </Link>
        </Button>
      </div>
    </SectionCard>
  );
}
