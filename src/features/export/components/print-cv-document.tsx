"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CvDocumentView } from "@/components/document";
import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateCustomization } from "@/features/templates/types";
import type { DocumentPageSize } from "@/components/document/types";
import { AutoPrint } from "@/features/export/components/auto-print";
import { EXPORT_CV_STORAGE_KEY } from "@/features/export/constants";
import { getCvWithContent } from "@/lib/cvs";
import { resolveCvTemplateCustomization } from "@/lib/templates";

type PrintCvDocumentProps = {
  cvId: string;
};

function parsePageSize(value: string | null): DocumentPageSize {
  return value === "letter" ? "letter" : "a4";
}

export function PrintCvDocument({ cvId }: PrintCvDocumentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("print") === "1";
  const pageSize = parsePageSize(searchParams.get("pageSize"));
  const [document, setDocument] = useState<CvDocument | null>(null);
  const [customization, setCustomization] = useState<TemplateCustomization | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let doc: CvDocument | null = null;

        const raw = sessionStorage.getItem(EXPORT_CV_STORAGE_KEY(cvId));
        if (raw) {
          doc = JSON.parse(raw) as CvDocument;
          sessionStorage.removeItem(EXPORT_CV_STORAGE_KEY(cvId));
        } else {
          const draftToken = searchParams.get("draftToken");
          if (draftToken) {
            const response = await fetch(
              `/api/export/draft/cv?token=${encodeURIComponent(draftToken)}`,
            );
            if (!response.ok) throw new Error("Draft not found");
            const payload = (await response.json()) as { document: CvDocument };
            doc = payload.document;
          } else {
            doc = await getCvWithContent(cvId);
          }
        }

        if (cancelled || !doc) return;

        const custom = await resolveCvTemplateCustomization(
          cvId,
          doc.templateId,
        ).catch(() => null);

        if (!cancelled) {
          setDocument(doc);
          setCustomization(custom);
          setLoading(false);
        }
      } catch {
        if (!cancelled) router.replace("/cvs");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [cvId, router, searchParams]);

  if (loading || !document) {
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
        pageSize={pageSize}
        mode="print"
      />
    </>
  );
}
