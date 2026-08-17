import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";
import type { CoverLetterDocument } from "@/features/cover-letter/types";
import { assertCoverLetterOwnership } from "@/lib/ai/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { getCoverLetterServer } from "@/lib/cover-letters/server-access";
import {
  buildCoverLetterFilename,
  coverLetterExportRequestSchema,
  PdfGenerationError,
  storeCoverLetterDraft,
  urlToPdfBuffer,
  validateCoverLetterExport,
} from "@/lib/export";

function exportError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return exportError("Sign in to export your cover letter.", 401);
    }

    const body = coverLetterExportRequestSchema.parse(await request.json());
    await assertCoverLetterOwnership(body.coverLetterId, user.id);

    let document: CoverLetterDocument;
    if (body.document) {
      document = body.document as unknown as CoverLetterDocument;
      if (document.id !== body.coverLetterId) {
        document = { ...document, id: body.coverLetterId };
      }
    } else {
      document = await getCoverLetterServer(body.coverLetterId);
    }

    const validation = validateCoverLetterExport(document);
    if (!validation.canExport) {
      return exportError(
        validation.blockers[0] ?? "Cannot export this cover letter.",
        400,
      );
    }

    const pageSize = body.pageSize ?? "a4";
    const origin = new URL(request.url).origin;
    const cookie = request.headers.get("cookie");

    let printUrl = `${origin}/cover-letter/${body.coverLetterId}/print?pageSize=${pageSize}`;
    if (body.document) {
      const token = await storeCoverLetterDraft(user.id, document);
      printUrl = `${origin}/cover-letter/${body.coverLetterId}/print?draftToken=${token}&pageSize=${pageSize}`;
    }

    const pdf = await urlToPdfBuffer(printUrl, cookie, pageSize);
    const filename = buildCoverLetterFilename(document);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Export-Warnings": validation.warnings.join("|"),
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
    console.error("[export cover-letter]", error);
    return exportError(
      "Could not generate your cover letter PDF. Please try Print instead.",
      500,
    );
  }
}
