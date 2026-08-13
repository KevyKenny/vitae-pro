import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";
import type { CvDocument } from "@/features/cv-editor/types";
import { assertCvOwnership } from "@/lib/ai/auth";
import { getCurrentUser } from "@/lib/auth/session";
import {
  buildCvFilename,
  cvExportRequestSchema,
  PdfGenerationError,
  storeCvDraft,
  urlToPdfBuffer,
  validateCvExport,
} from "@/lib/export";
import { getCvWithContentServer } from "@/lib/cvs/server-access";

function exportError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return exportError("Sign in to export your CV.", 401);
    }

    const body = cvExportRequestSchema.parse(await request.json());
    await assertCvOwnership(body.cvId, user.id);

    let document: CvDocument;
    if (body.document) {
      document = body.document as unknown as CvDocument;
      if (document.id !== body.cvId) {
        document = { ...document, id: body.cvId };
      }
    } else {
      document = await getCvWithContentServer(body.cvId);
    }

    const validation = validateCvExport(document);
    if (!validation.canExport) {
      return exportError(validation.blockers[0] ?? "Cannot export this CV.", 400);
    }

    const pageSize = body.pageSize ?? "a4";
    const origin = new URL(request.url).origin;
    const cookie = request.headers.get("cookie");

    let printUrl = `${origin}/cvs/${body.cvId}/print`;
    if (body.document) {
      const token = storeCvDraft(user.id, document);
      printUrl = `${origin}/cvs/${body.cvId}/print?draftToken=${token}`;
    }

    const pdf = await urlToPdfBuffer(printUrl, cookie, pageSize);
    const filename = buildCvFilename(document);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Export-Warnings": validation.warnings.join("|"),
        "X-Export-Completion": String(validation.completionPercent ?? 0),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return exportError(error.issues[0]?.message ?? "Invalid request.", 400);
    }
    if (error instanceof PdfGenerationError) {
      return NextResponse.json(
        { error: "pdf_unavailable", message: error.message },
        { status: 503 },
      );
    }
    console.error("[export cv]", error);
    return exportError("Could not generate your CV PDF. Please try Print instead.", 500);
  }
}
