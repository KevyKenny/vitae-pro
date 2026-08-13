"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CoverLetterDocumentView } from "@/components/document";
import type { CoverLetterDocument } from "@/features/cover-letter/types";
import { AutoPrint } from "@/features/export/components/auto-print";
import { EXPORT_COVER_LETTER_STORAGE_KEY } from "@/features/export/constants";
import { getCoverLetter } from "@/lib/cover-letters";

type PrintCoverLetterDocumentProps = {
  coverLetterId: string;
};

export function PrintCoverLetterDocument({
  coverLetterId,
}: PrintCoverLetterDocumentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("print") === "1";
  const [document, setDocument] = useState<CoverLetterDocument | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const raw = sessionStorage.getItem(
          EXPORT_COVER_LETTER_STORAGE_KEY(coverLetterId),
        );
        if (raw) {
          if (!cancelled) {
            setDocument(JSON.parse(raw) as CoverLetterDocument);
            sessionStorage.removeItem(
              EXPORT_COVER_LETTER_STORAGE_KEY(coverLetterId),
            );
          }
          return;
        }

        const draftToken = searchParams.get("draftToken");
        if (draftToken) {
          const response = await fetch(
            `/api/export/draft/cover-letter?token=${encodeURIComponent(draftToken)}`,
          );
          if (!response.ok) throw new Error("Draft not found");
          const payload = (await response.json()) as {
            document: CoverLetterDocument;
          };
          if (!cancelled) setDocument(payload.document);
          return;
        }

        const doc = await getCoverLetter(coverLetterId);
        if (!cancelled) setDocument(doc);
      } catch {
        if (!cancelled) router.replace("/cover-letters");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [coverLetterId, router, searchParams]);

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
      <CoverLetterDocumentView document={document} mode="print" />
    </>
  );
}
