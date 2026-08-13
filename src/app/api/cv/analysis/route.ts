import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { assertCvOwnership } from "@/lib/ai/auth";
import { getCachedAnalysis } from "@/lib/analysis/repository";
import { getAnalysisQuerySchema } from "@/lib/ai/schemas";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { error: "unauthorized", message: "Sign in to view analysis." },
        { status: 401 },
      );
    }

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const query = getAnalysisQuerySchema.parse({
      cvId: params.cvId,
      type: params.type ?? "cv_health",
      jobDescription: params.jobDescription,
    });

    await assertCvOwnership(query.cvId, user.id);

    const analysis = await getCachedAnalysis(
      query.cvId,
      query.type,
      query.jobDescription,
    );

    return Response.json({ analysis, cached: Boolean(analysis) });
  } catch {
    return Response.json(
      { error: "validation", message: "Invalid request." },
      { status: 400 },
    );
  }
}
