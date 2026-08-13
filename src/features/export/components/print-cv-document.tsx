"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CvDocumentView } from "@/components/document";
import type { CvDocument } from "@/features/cv-editor/types";
import { AutoPrint } from "@/features/export/components/auto-print";
import { EXPORT_CV_STORAGE_KEY } from "@/features/export/constants";
import { getCvWithContent } from "@/lib/cvs";
import { getTemplateCustomization } from "@/lib/templates";
import type { TemplateCustomization } from "@/features/templates/types";

type PrintCvDocumentProps = {
  cvId: string;
};

export function PrintCvDocument({ cvId }: PrintCvDocumentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("print") === "1";
  const [document, setDocument] = useState<CvDocument | null>(null);
  const [customization, setCustomization] = useState<TemplateCustomization | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const raw = sessionStorage.getItem(EXPORT_CV_STORAGE_KEY(cvId));
        if (raw) {
          if (!cancelled) {
            setDocument(JSON.parse(raw) as CvDocument);
            sessionStorage.removeItem(EXPORT_CV_STORAGE_KEY(cvId));
          }
          return;
        }

        const draftToken = searchParams.get("draftToken");
        if (draftToken) {
          const response = await fetch(
            `/api/export/draft/cv?token=${encodeURIComponent(draftToken)}`,
          );
          if (!response.ok) throw new Error("Draft not found");
          const payload = (await response.json()) as { document: CvDocument };
          if (!cancelled) setDocument(payload.document);
          return;
        }

        const doc = await getCvWithContent(cvId);
        if (!cancelled) setDocument(doc);
      } catch {
        if (!cancelled) router.replace("/cvs");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [cvId, router, searchParams]);

  useEffect(() => {
    if (!document) return;
    void getTemplateCustomization(document.templateId)
      .then(setCustomization)
      .catch(() => setCustomization(null));
  }, [document]);

  if (!document) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-ink-soft">
        Preparing document…
      </div>
    );
  }

  return (
    <>
      <AutoPrint enabled={autoPrint} />
      <CvDocumentView
        document={document}
        customization={customization}
        mode="print"
      />
    </>
  );
}
