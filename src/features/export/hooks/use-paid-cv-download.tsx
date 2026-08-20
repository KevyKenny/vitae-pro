"use client";

import { useCallback, useState } from "react";
import type { CvDocument } from "@/features/cv-editor/types";
import { DownloadPaymentDialog } from "@/features/export/components/download-payment-dialog";
import { useCvExport } from "@/features/export/hooks/use-cv-export";

export function usePaidCvDownload() {
  const { downloadCvPdf, printCv, status } = useCvExport();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<{
    cvId: string;
    document?: CvDocument;
  } | null>(null);

  const requestDownload = useCallback(
    (cvId: string, document?: CvDocument) => {
      setPending({ cvId, document });
      setOpen(true);
    },
    [],
  );

  const confirmDownload = useCallback(async () => {
    if (!pending) return;
    await downloadCvPdf(pending.cvId, pending.document);
    setOpen(false);
    setPending(null);
  }, [downloadCvPdf, pending]);

  const paymentDialog = (
    <DownloadPaymentDialog
      open={open}
      onOpenChange={setOpen}
      onConfirm={confirmDownload}
      status={status}
    />
  );

  return { requestDownload, printCv, status, paymentDialog };
}
