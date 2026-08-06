import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { TemplatePreview } from "@/features/templates/components/template-preview";
import { getGalleryTemplateById } from "@/mocks/templates-gallery";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const template = getGalleryTemplateById(id);
  return {
    title: template ? `${template.name} · Templates` : "Template",
  };
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = getGalleryTemplateById(id);
  if (!template) notFound();

  return (
    <PageContainer>
      <AppHeader
        title={template.name}
        description="Preview details and customization options."
        showNewCv={false}
        actions={
          <Button asChild variant="ghost" shape="soft">
            <Link href="/templates">
              <ArrowLeft className="size-4" />
              Gallery
            </Link>
          </Button>
        }
      />
      <TemplatePreview template={template} />
    </PageContainer>
  );
}
