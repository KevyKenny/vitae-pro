import {
  TemplateDetailClient,
  resolveTemplateTitle,
} from "@/features/templates/components/template-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `${resolveTemplateTitle(id)} · Templates`,
  };
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <TemplateDetailClient id={id} />;
}
