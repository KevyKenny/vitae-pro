"use client";

import { use } from "react";
import { PrintCoverLetterDocument } from "@/features/export/components/print-cover-letter-document";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CoverLetterPrintPage({ params }: PageProps) {
  const { id } = use(params);
  return <PrintCoverLetterDocument coverLetterId={id} />;
}
