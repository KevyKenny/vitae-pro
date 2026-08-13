"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { aiApi, aiClientErrorMessage } from "@/features/ai/api";
import type { CVAnalysisResult, JobMatchResult } from "@/lib/analysis/types";
import { toast } from "sonner";

export function useCvAnalysis(cvId: string) {
  const [healthResult, setHealthResult] = useState<CVAnalysisResult | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobMatchLoading, setJobMatchLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const loadCached = useCallback(async () => {
    try {
      const { analysis } = await aiApi.getCachedAnalysis(cvId, "cv_health");
      if (analysis && analysis.analysisType === "cv_health") {
        setHealthResult(analysis.result as CVAnalysisResult);
        setIsStale(analysis.isStale);
      }
    } catch {
      /* optional cache load */
    }
  }, [cvId]);

  useEffect(() => {
    void loadCached();
  }, [loadCached]);

  const analyzeCv = useCallback(
    async (force = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await aiApi.cvAnalysis({ cvId, force }, controller.signal);
        setHealthResult(res.analysis);
        setIsStale(false);
        if (res.incomplete) {
          toast.message("Complete your CV for a full assessment");
        } else if (!res.cached) {
          toast.success("CV analysis ready");
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast.error("Analysis failed", { description: aiClientErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    },
    [cvId],
  );

  const analyzeJobMatch = useCallback(
    async (force = false) => {
      if (jobDescription.trim().length < 20) {
        toast.error("Paste a job description first (at least 20 characters)");
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setJobMatchLoading(true);
      try {
        const res = await aiApi.jobMatch(
          {
            cvId,
            jobDescription,
            jobTitle: jobTitle || undefined,
            force,
          },
          controller.signal,
        );
        setJobMatchResult(res.match);
        if (!res.cached) toast.success("Job match analysis ready");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast.error("Job match failed", { description: aiClientErrorMessage(error) });
      } finally {
        setJobMatchLoading(false);
      }
    },
    [cvId, jobDescription, jobTitle],
  );

  return {
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
    loadCached,
  };
}
