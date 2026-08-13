"use client";

import { use } from "react";
import { PrintCvDocument } from "@/features/export/components/print-cv-document";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CvPrintPage({ params }: PageProps) {
  const { id } = use(params);
  return <PrintCvDocument cvId={id} />;
}
