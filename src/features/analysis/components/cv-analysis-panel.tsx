"use client";

import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { ResumeScoreWidget } from "@/features/dashboard/components/resume-score-widget";
import { ResumeHealth } from "@/features/dashboard/components/resume-health";
import { AnalysisRecommendations } from "@/features/analysis/components/analysis-recommendations";
import { AtsAnalysisView } from "@/features/analysis/components/ats-analysis-view";
import { JobMatchView } from "@/features/analysis/components/job-match-view";
import { useCvAnalysis } from "@/features/analysis/hooks/use-cv-analysis";
import {
  toAtsBreakdown,
  toResumeHealthItems,
  toScoreBreakdown,
} from "@/lib/analysis/mappers";
import type { AnalysisRecommendation } from "@/lib/analysis/types";
import type { CvSectionType } from "@/features/cv-editor/types";

export function CvAnalysisPanel({
  open,
  onOpenChange,
  cvId,
  onImprove,
  onNavigateSection,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cvId: string;
  onImprove: (rec: AnalysisRecommendation) => void;
  onNavigateSection: (sectionType: CvSectionType) => void;
}) {
  const {
    healthResult,
    jobMatchResult,
    loading,
    jobMatchLoading,
    isStale,
    jobDescription,
    setJobDescription,
    jobTitle,
    setJobTitle,
    analyzeCv,
    analyzeJobMatch,
  } = useCvAnalysis(cvId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(100%,420px)] overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-line px-5 py-4 text-left">
          <SheetTitle className="font-serif text-xl">CV Analysis</SheetTitle>
          <p className="text-sm text-ink-soft">
            VitatePro AI assessment — understand strengths, gaps, and next steps.
          </p>
        </SheetHeader>

        <div className="space-y-4 p-5">
          {isStale ? (
            <div className="flex items-center justify-between gap-2 rounded-[10px] border border-gold/40 bg-gold-wash/40 px-3 py-2 text-sm text-ink-soft">
              <span>Your CV changed since the last analysis.</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                shape="soft"
                onClick={() => void analyzeCv(true)}
              >
                Analyze again
              </Button>
            </div>
          ) : null}

          <Tabs defaultValue="health">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="ats">ATS</TabsTrigger>
              <TabsTrigger value="match">Job Match</TabsTrigger>
            </TabsList>

            <TabsContent value="health" className="mt-4 space-y-4">
              {!healthResult && !loading ? (
                <EmptyState
                  icon={Sparkles}
                  title="Analyze your CV"
                  description="Get an AI assessment of content quality, structure, and areas to improve."
                  actionLabel="Analyze CV"
                  onAction={() => void analyzeCv()}
                />
              ) : loading ? (
                <LoadingBlock label="Analyzing your CV…" />
              ) : healthResult?.isIncomplete ? (
                <IncompleteCvState
                  missingAreas={healthResult.missingAreas}
                  message={healthResult.disclaimer}
                />
              ) : healthResult ? (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">VitatePro AI assessment</Badge>
                    {healthResult.disclaimer ? (
                      <p className="text-xs text-ink-faint">{healthResult.disclaimer}</p>
                    ) : null}
                  </div>
                  <ResumeScoreWidget
                    total={healthResult.overallScore}
                    breakdown={toScoreBreakdown(healthResult)}
                  />
                  <ResumeHealth
                    items={toResumeHealthItems(healthResult)}
                    onImprove={(item) => {
                      const sectionMap: Record<string, CvSectionType> = {
                        content: "summary",
                        summary: "summary",
                        experience: "experience",
                        skills: "skills",
                        education: "education",
                        structure: "personal",
                        ats: "summary",
                        readability: "summary",
                        relevance: "summary",
                      };
                      const section = sectionMap[item.id] ?? "summary";
                      onNavigateSection(section);
                      onImprove({
                        id: item.id,
                        priority: item.status === "needs-work" ? "high" : "medium",
                        title: `Improve ${item.label}`,
                        reason: item.recommendation,
                        action: "Improve with AI",
                        sectionType: section,
                        aiAction:
                          section === "summary"
                            ? "summary"
                            : section === "experience"
                              ? "experience"
                              : section === "skills"
                                ? "skills"
                                : "ats",
                      });
                    }}
                  />
                  <AnalysisRecommendations
                    title="Top improvements"
                    items={healthResult.improvementPlan}
                    onAction={onImprove}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    shape="soft"
                    className="w-full"
                    disabled={loading}
                    onClick={() => void analyzeCv(true)}
                  >
                    <RefreshCw className="size-4" />
                    Analyze again
                  </Button>
                </>
              ) : null}
            </TabsContent>

            <TabsContent value="ats" className="mt-4 space-y-4">
              {!healthResult && !loading ? (
                <EmptyState
                  icon={Sparkles}
                  title="Run CV analysis first"
                  description="ATS compatibility is included in your CV health analysis."
                  actionLabel="Analyze CV"
                  onAction={() => void analyzeCv()}
                />
              ) : loading ? (
                <LoadingBlock label="Analyzing ATS compatibility…" />
              ) : healthResult && !healthResult.isIncomplete ? (
                <AtsAnalysisView
                  atsScore={healthResult.atsScore}
                  breakdown={toAtsBreakdown(healthResult)}
                  issues={healthResult.atsIssues}
                  onOptimize={() =>
                    onImprove({
                      id: "ats_optimize",
                      priority: "high",
                      title: "Optimize for ATS",
                      reason: "Improve keyword alignment and section clarity.",
                      action: "Optimize summary for ATS",
                      sectionType: "summary",
                      aiAction: "ats",
                    })
                  }
                />
              ) : null}
            </TabsContent>

            <TabsContent value="match" className="mt-4 space-y-4">
              <JobMatchView
                jobDescription={jobDescription}
                jobTitle={jobTitle}
                onJobDescriptionChange={setJobDescription}
                onJobTitleChange={setJobTitle}
                match={jobMatchResult}
                loading={jobMatchLoading}
                onAnalyze={() => void analyzeJobMatch()}
                onImprove={onImprove}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[12px] border border-line bg-emerald-wash/50 px-3.5 py-6 text-sm text-emerald">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

function IncompleteCvState({
  missingAreas,
  message,
}: {
  missingAreas: string[];
  message: string;
}) {
  return (
    <div className="space-y-3 rounded-[14px] border border-line-strong bg-surface p-4">
      <p className="text-sm font-medium text-ink">{message}</p>
      <p className="text-xs text-ink-soft">Complete these areas first:</p>
      <ul className="list-disc space-y-1 pl-4 text-sm text-ink-soft">
        {missingAreas.map((area) => (
          <li key={area}>{area}</li>
        ))}
      </ul>
    </div>
  );
}
