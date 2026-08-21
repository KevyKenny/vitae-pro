"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutTemplate } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { TemplateCard } from "@/features/templates/components/template-card";
import { TemplateComparison } from "@/features/templates/components/template-comparison";
import { SavedTemplateCard } from "@/features/templates/components/saved-template-card";
import { MiniPreview } from "@/features/templates/components/template-card";
import { galleryTemplates } from "@/mocks/templates-gallery";
import type {
  GalleryTemplate,
  SavedTemplateEntry,
} from "@/features/templates/types";
import {
  listActiveTemplates,
  listUserCustomizations,
  templateErrorMessage,
} from "@/lib/templates";
import { toast } from "sonner";

export function TemplateGallery() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [templates, setTemplates] = useState<GalleryTemplate[]>([]);
  const [saved, setSaved] = useState<SavedTemplateEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [active, customizations] = await Promise.all([
          listActiveTemplates(),
          listUserCustomizations(),
        ]);
        if (cancelled) return;

        // Fallback: empty DB seed keeps the gallery usable with mock layouts.
        setTemplates(active.length > 0 ? active : galleryTemplates);
        setSaved(customizations);
      } catch (error) {
        if (cancelled) return;
        toast.error(templateErrorMessage(error));
        setTemplates(galleryTemplates);
        setSaved([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured =
    templates.find((t) => t.isFeatured) ?? templates[0] ?? galleryTemplates[0];

  const compareTemplates = templates.filter((t) =>
    compareIds.includes(t.id),
  );

  const recent = saved.filter((s) => s.kind === "recent");
  const savedOnly = saved.filter((s) => s.kind === "saved");
  const custom = saved.filter((s) => s.kind === "custom");

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton variant="page" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AppHeader
        title="Templates"
        description="Professionally designed CV layouts that make a strong impression on recruiters."
        showNewCv={false}
        actions={
          <Button asChild variant="outline" shape="soft">
            <Link href={`/customize?template=${featured.id}`}>
              Start customizing
            </Link>
          </Button>
        }
      />

      {/* Hero */}
      <section className="mb-10 overflow-hidden rounded-[20px] border border-line bg-surface shadow-s">
        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8 lg:p-10">
          <div className="flex flex-col justify-center">
            <p className="text-[0.72rem] font-bold tracking-[0.05em] text-emerald uppercase">
              Template gallery
            </p>
            <h2 className="mt-2 font-serif text-[1.85rem] font-semibold tracking-tight text-ink md:text-[2.1rem]">
              Choose a CV design that represents your career.
            </h2>
            <p className="mt-3 max-w-xl text-[0.95rem] text-ink-soft">
              Professionally designed templates for recruiters — preview, compare,
              and customize in minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild shape="soft">
                <a href="#gallery-grid">Explore Templates</a>
              </Button>
              <Button asChild variant="outline" shape="soft">
                <Link href={`/templates/${featured.id}`}>
                  Featured: {featured.name}
                </Link>
              </Button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto aspect-[3/4] w-full max-w-[260px] rounded-[14px] border border-line-strong bg-paper-dim p-4 shadow-m"
          >
            <MiniPreview templateId={featured.id} />
          </motion.div>
        </div>
      </section>

      {/* My Templates */}
      <section className="mb-10 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">
              My Templates
            </h2>
            <p className="text-sm text-ink-soft">
              Recently used, saved, and custom designs.
            </p>
          </div>
        </div>
        {saved.length === 0 ? (
          <EmptyState
            icon={LayoutTemplate}
            title="No saved templates"
            description="Save a template from the gallery or customizer to see it here."
            actionLabel="Browse gallery"
            onAction={() =>
              document.getElementById("gallery-grid")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <SavedGroup
              title="Recently used"
              empty="No recent templates"
              entries={recent}
              onDuplicate={(e) => duplicateSaved(e, setSaved)}
              onDelete={(id) => {
                setSaved((s) => s.filter((x) => x.id !== id));
                toast.success("Removed");
              }}
            />
            <SavedGroup
              title="Saved templates"
              empty="No saved templates"
              entries={savedOnly}
              onDuplicate={(e) => duplicateSaved(e, setSaved)}
              onDelete={(id) => {
                setSaved((s) => s.filter((x) => x.id !== id));
                toast.success("Removed");
              }}
            />
            <SavedGroup
              title="Custom designs"
              empty="No custom designs"
              entries={custom}
              onDuplicate={(e) => duplicateSaved(e, setSaved)}
              onDelete={(id) => {
                setSaved((s) => s.filter((x) => x.id !== id));
                toast.success("Removed");
              }}
            />
          </div>
        )}
      </section>

      <section className="mb-6" id="gallery-grid">
        <h2 className="font-serif text-xl font-semibold text-ink">
          Browse all templates
        </h2>
      </section>

      {templates.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="No templates yet"
          description="Templates will appear here once they are available."
        />
      ) : (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={compareIds.includes(template.id)}
              onToggleCompare={() => {
                setCompareIds((ids) => {
                  if (ids.includes(template.id)) {
                    return ids.filter((id) => id !== template.id);
                  }
                  if (ids.length >= 3) {
                    toast.message("Compare up to 3 templates");
                    return ids;
                  }
                  return [...ids, template.id];
                });
              }}
            />
          ))}
        </motion.div>
      )}

      <div className="mt-8">
        <TemplateComparison
          templates={compareTemplates}
          onRemove={(id) =>
            setCompareIds((ids) => ids.filter((x) => x !== id))
          }
          onClear={() => setCompareIds([])}
        />
      </div>
    </PageContainer>
  );
}

function SavedGroup({
  title,
  empty,
  entries,
  onDuplicate,
  onDelete,
}: {
  title: string;
  empty: string;
  entries: SavedTemplateEntry[];
  onDuplicate: (e: SavedTemplateEntry) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
        {title}
      </h3>
      {entries.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-line-strong px-4 py-8 text-center text-sm text-ink-faint">
          {empty}
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <SavedTemplateCard
              key={entry.id}
              entry={entry}
              onDuplicate={() => onDuplicate(entry)}
              onDelete={() => onDelete(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function duplicateSaved(
  entry: SavedTemplateEntry,
  setSaved: React.Dispatch<React.SetStateAction<SavedTemplateEntry[]>>,
) {
  setSaved((prev) => [
    {
      ...entry,
      id: `saved_${Date.now()}`,
      name: `${entry.name} (copy)`,
      kind: "custom",
      updatedAt: new Date().toISOString(),
    },
    ...prev,
  ]);
  toast.success("Duplicated");
}
