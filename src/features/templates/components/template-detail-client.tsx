"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { TemplatePreview } from "@/features/templates/components/template-preview";
import type { GalleryTemplate } from "@/features/templates/types";
import {
  getTemplateBySlugOrId,
  templateErrorMessage,
} from "@/lib/templates";
import { getGalleryTemplateById } from "@/mocks/templates-gallery";

export function TemplateDetailClient({ id }: { id: string }) {
  const [template, setTemplate] = useState<GalleryTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setMissing(false);

      try {
        const fromDb = await getTemplateBySlugOrId(id);
        if (cancelled) return;

        if (fromDb) {
          setTemplate(fromDb);
          return;
        }

        const mock = getGalleryTemplateById(id);
        if (mock) {
          setTemplate(mock);
          return;
        }

        setMissing(true);
        setTemplate(null);
      } catch (error) {
        if (cancelled) return;

        const mock = getGalleryTemplateById(id);
        if (mock) {
          setTemplate(mock);
          return;
        }

        toast.error(templateErrorMessage(error));
        setMissing(true);
        setTemplate(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton variant="page" />
      </PageContainer>
    );
  }

  if (missing || !template) {
    return (
      <PageContainer>
        <EmptyState
          icon={LayoutTemplate}
          title="Template not found"
          description="This template may have been removed or the link is invalid."
          actionLabel="Back to gallery"
          onAction={() => {
            window.location.href = "/templates";
          }}
        />
      </PageContainer>
    );
  }

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
