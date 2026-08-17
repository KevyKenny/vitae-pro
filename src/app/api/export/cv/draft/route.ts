import { NextResponse } from "next/server";
import { z } from "zod";
import type { CvDocument } from "@/features/cv-editor/types";
import { assertCvOwnership } from "@/lib/ai/auth";
import { AiServiceError } from "@/lib/ai/errors";
import { getCurrentUser } from "@/lib/auth/session";
import { storeCvDraft, validateCvExport } from "@/lib/export";

const bodySchema = z.object({
  cvId: z.string().uuid(),
  document: z.record(z.string(), z.unknown()),
  pageSize: z.enum(["a4", "letter"]).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = bodySchema.parse(await request.json());
    await assertCvOwnership(body.cvId, user.id);

    const document = body.document as unknown as CvDocument;
    const validation = validateCvExport(document);
    if (!validation.canExport) {
      return NextResponse.json(
        { error: validation.blockers[0] ?? "Cannot export this CV." },
        { status: 400 },
      );
    }

    const token = await storeCvDraft(user.id, {
      ...document,
      id: body.cvId,
    });

    return NextResponse.json({ token });
  } catch (error) {
    if (error instanceof AiServiceError && error.status === 403) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }
    console.error("[export cv draft]", error);
    return NextResponse.json({ error: "Could not stage draft." }, { status: 500 });
  }
}
