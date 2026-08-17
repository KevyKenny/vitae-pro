import { notFound } from "next/navigation";
import { TemplateReferenceProof } from "@/features/templates/components/template-reference-proof";
import { isTemplateRendererKey } from "@/lib/templates/definitions/types";

/**
 * Development-only harness that renders a template at true A4 size with the
 * reference fixture, so previews can be diffed against templates-layout PDFs.
 */
export default async function TemplateProofPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { key } = await params;
  if (!isTemplateRendererKey(key)) notFound();

  return <TemplateReferenceProof rendererKey={key} />;
}
