import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import type {
  CVAnalysisResult,
  JobMatchResult,
  StoredCvAnalysis,
} from "@/lib/analysis/types";
import { hashJobDescription } from "@/lib/analysis/hash";
import type { Json } from "@/lib/database/types";

type AnalysisRow = {
  id: string;
  user_id: string;
  cv_id: string;
  analysis_type: "cv_health" | "job_match";
  job_description_hash: string | null;
  result: Json;
  model: string | null;
  cv_updated_at: string;
  created_at: string;
  updated_at: string;
};

function mapRow(
  row: AnalysisRow,
  cvUpdatedAt: string | null,
): StoredCvAnalysis {
  const isStale =
    cvUpdatedAt != null &&
    new Date(cvUpdatedAt).getTime() > new Date(row.cv_updated_at).getTime();

  return {
    id: row.id,
    cvId: row.cv_id,
    analysisType: row.analysis_type,
    result: row.result as unknown as CVAnalysisResult | JobMatchResult,
    model: row.model,
    cvUpdatedAt: row.cv_updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isStale,
    jobDescriptionHash: row.job_description_hash,
  };
}

async function getCvUpdatedAt(cvId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cvs")
    .select("updated_at")
    .eq("id", cvId)
    .maybeSingle();
  return data?.updated_at ?? null;
}

export async function getCachedAnalysis(
  cvId: string,
  analysisType: "cv_health" | "job_match",
  jobDescription?: string,
): Promise<StoredCvAnalysis | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  let query = supabase
    .from("cv_ai_analyses")
    .select("*")
    .eq("cv_id", cvId)
    .eq("user_id", user.id)
    .eq("analysis_type", analysisType);

  if (analysisType === "job_match" && jobDescription) {
    query = query.eq("job_description_hash", hashJobDescription(jobDescription));
  }

  const { data, error } = await query
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const cvUpdatedAt = await getCvUpdatedAt(cvId);
  return mapRow(data as AnalysisRow, cvUpdatedAt);
}

export async function saveAnalysis(input: {
  cvId: string;
  analysisType: "cv_health" | "job_match";
  result: CVAnalysisResult | JobMatchResult;
  model: string;
  cvUpdatedAt: string;
  jobDescription?: string;
  inputTokens?: number;
  outputTokens?: number;
}): Promise<StoredCvAnalysis> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = await createClient();
  const jobHash =
    input.analysisType === "job_match" && input.jobDescription
      ? hashJobDescription(input.jobDescription)
      : null;

  const payload = {
    user_id: user.id,
    cv_id: input.cvId,
    analysis_type: input.analysisType,
    job_description_hash: jobHash,
    result: input.result as unknown as Json,
    model: input.model,
    cv_updated_at: input.cvUpdatedAt,
    input_tokens: input.inputTokens ?? null,
    output_tokens: input.outputTokens ?? null,
    updated_at: new Date().toISOString(),
  };

  if (input.analysisType === "cv_health") {
    const { data: existing } = await supabase
      .from("cv_ai_analyses")
      .select("id")
      .eq("cv_id", input.cvId)
      .eq("analysis_type", "cv_health")
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("cv_ai_analyses")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single();
      if (error) throw error;

      if ("overallScore" in input.result) {
        await supabase
          .from("cvs")
          .update({ score: Math.round(input.result.overallScore) })
          .eq("id", input.cvId)
          .eq("user_id", user.id);
      }

      return mapRow(data as AnalysisRow, input.cvUpdatedAt);
    }
  }

  if (input.analysisType === "job_match" && jobHash) {
    const { data: existing } = await supabase
      .from("cv_ai_analyses")
      .select("id")
      .eq("cv_id", input.cvId)
      .eq("analysis_type", "job_match")
      .eq("job_description_hash", jobHash)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("cv_ai_analyses")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single();
      if (error) throw error;
      return mapRow(data as AnalysisRow, input.cvUpdatedAt);
    }
  }

  const { data, error } = await supabase
    .from("cv_ai_analyses")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;

  if (input.analysisType === "cv_health" && "overallScore" in input.result) {
    await supabase
      .from("cvs")
      .update({ score: Math.round(input.result.overallScore) })
      .eq("id", input.cvId)
      .eq("user_id", user.id);
  }

  return mapRow(data as AnalysisRow, input.cvUpdatedAt);
}

export async function getLatestHealthForUser(): Promise<{
  cvId: string;
  cvTitle: string;
  analysis: StoredCvAnalysis;
} | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data: defaultCv } = await supabase
    .from("cvs")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .maybeSingle();

  const { data: latestCv } = defaultCv
    ? { data: defaultCv }
    : await supabase
        .from("cvs")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  if (!latestCv) return null;

  const analysis = await getCachedAnalysis(latestCv.id, "cv_health");
  if (!analysis) return null;

  return {
    cvId: latestCv.id,
    cvTitle: latestCv.title,
    analysis,
  };
}
