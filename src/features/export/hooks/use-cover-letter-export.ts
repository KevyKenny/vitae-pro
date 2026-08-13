"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { CoverLetterDocument } from "@/features/cover-letter/types";
import { EXPORT_COVER_LETTER_STORAGE_KEY } from "@/features/export/constants";
import { buildCoverLetterFilename } from "@/lib/export/filename";
import { validateCoverLetterExport } from "@/lib/export/validation";
import type { ExportStatus } from "@/features/export/hooks/use-cv-export";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useCoverLetterExport() {
  const [status, setStatus] = useState<ExportStatus>("idle");

  const printCoverLetter = useCallback(
    (coverLetterId: string, document?: CoverLetterDocument) => {
      if (document) {
        sessionStorage.setItem(
          EXPORT_COVER_LETTER_STORAGE_KEY(coverLetterId),
          JSON.stringify(document),
        );
      }
      window.open(
        `/cover-letter/${coverLetterId}/print?print=1`,
        "_blank",
        "noopener,noreferrer",
      );
    },
    [],
  );

  const downloadCoverLetterPdf = useCallback(
    async (
      coverLetterId: string,
      document: CoverLetterDocument,
      pageSize: "a4" | "letter" = "a4",
    ) => {
      const validation = validateCoverLetterExport(document);
      if (!validation.canExport) {
        toast.error(validation.blockers[0]);
        return;
      }

      for (const warning of validation.warnings) {
        toast.warning(warning);
      }

      if (validation.readyMessage) {
        toast.message(validation.readyMessage);
      }

      setStatus("preparing");

      try {
        setStatus("generating");
        const response = await fetch("/api/export/cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coverLetterId, document, pageSize }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            message?: string;
            error?: string;
          } | null;

          if (payload?.error === "pdf_unavailable") {
            toast.message("Opening print view", {
              description: payload.message,
            });
            printCoverLetter(coverLetterId, document);
            return;
          }

          throw new Error(payload?.message ?? "Export failed.");
        }

        const blob = await response.blob();
        downloadBlob(blob, buildCoverLetterFilename(document));
        setStatus("done");
        toast.success("Download complete");
      } catch (error) {
        setStatus("error");
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not download your cover letter.",
        );
        printCoverLetter(coverLetterId, document);
      } finally {
        window.setTimeout(() => setStatus("idle"), 1200);
      }
    },
    [printCoverLetter],
  );

  return { status, downloadCoverLetterPdf, printCoverLetter };
}
