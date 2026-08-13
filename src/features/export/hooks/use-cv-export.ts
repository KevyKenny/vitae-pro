"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { CvDocument } from "@/features/cv-editor/types";
import {
  EXPORT_CV_STORAGE_KEY,
} from "@/features/export/constants";
import { buildCvFilename } from "@/lib/export/filename";
import { validateCvExport } from "@/lib/export/validation";

export type ExportStatus = "idle" | "preparing" | "generating" | "done" | "error";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useCvExport() {
  const [status, setStatus] = useState<ExportStatus>("idle");

  const printCv = useCallback(
    (cvId: string, document?: CvDocument) => {
      if (document) {
        sessionStorage.setItem(
          EXPORT_CV_STORAGE_KEY(cvId),
          JSON.stringify(document),
        );
      }
      window.open(`/cvs/${cvId}/print?print=1`, "_blank", "noopener,noreferrer");
    },
    [],
  );

  const downloadCvPdf = useCallback(
    async (cvId: string, document?: CvDocument, pageSize: "a4" | "letter" = "a4") => {
      if (document) {
        const validation = validateCvExport(document);
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
      } else {
        toast.message("Preparing your CV…");
      }

      setStatus("preparing");

      try {
        setStatus("generating");
        const response = await fetch("/api/export/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvId,
            ...(document ? { document } : {}),
            pageSize,
          }),
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
            printCv(cvId, document);
            return;
          }

          throw new Error(payload?.message ?? "Export failed.");
        }

        const blob = await response.blob();
        const disposition = response.headers.get("Content-Disposition");
        const filename =
          disposition?.match(/filename="(.+?)"/)?.[1] ??
          (document ? buildCvFilename(document) : "VitatePro_CV.pdf");
        downloadBlob(blob, filename);
        setStatus("done");
        toast.success("Download complete");
      } catch (error) {
        setStatus("error");
        toast.error(
          error instanceof Error ? error.message : "Could not download your CV.",
        );
        printCv(cvId, document);
      } finally {
        window.setTimeout(() => setStatus("idle"), 1200);
      }
    },
    [printCv],
  );

  return { status, downloadCvPdf, printCv };
}
