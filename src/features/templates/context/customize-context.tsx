"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { LayoutTemplate } from "lucide-react";
import {
  createDefaultCustomization,
  getGalleryTemplateById,
} from "@/mocks/templates-gallery";
import type {
  ColorPalette,
  FontFamilyId,
  GallerySectionId,
  GalleryTemplate,
  LayoutMode,
  TemplateCustomization,
} from "@/features/templates/types";
import { listUserCvs } from "@/lib/cvs";
import {
  applyGalleryTemplateToCv,
  getTemplateBySlugOrId,
  getTemplateCustomization,
  saveTemplateCustomization,
  templateErrorMessage,
} from "@/lib/templates";

type CustomizeContextValue = {
  template: GalleryTemplate;
  customization: TemplateCustomization;
  zoom: number;
  setZoom: (z: number) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  update: (patch: Partial<TemplateCustomization>) => void;
  applyPalette: (palette: ColorPalette) => void;
  setFont: (id: FontFamilyId) => void;
  setLayout: (layout: LayoutMode) => void;
  toggleSection: (id: GallerySectionId) => void;
  moveSection: (id: GallerySectionId, direction: "up" | "down") => void;
  reset: () => void;
  saveCustom: () => Promise<void>;
  applyToCv: () => Promise<void>;
  applying: boolean;
  saving: boolean;
};

const CustomizeContext = createContext<CustomizeContextValue | null>(null);

export function CustomizeProvider({
  templateId,
  children,
}: {
  templateId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState<GalleryTemplate | null>(null);
  const [customization, setCustomization] =
    useState<TemplateCustomization | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setMissing(false);

      try {
        const fromDb = await getTemplateBySlugOrId(templateId);
        if (cancelled) return;

        const resolved =
          fromDb ??
          getGalleryTemplateById(templateId) ??
          getGalleryTemplateById("tpl_meridian");

        if (!resolved) {
          setMissing(true);
          setTemplate(null);
          setCustomization(null);
          return;
        }

        setTemplate(resolved);

        try {
          const saved = await getTemplateCustomization(resolved.id);
          if (cancelled) return;
          setCustomization(saved ?? createDefaultCustomization(resolved));
        } catch {
          if (cancelled) return;
          setCustomization(createDefaultCustomization(resolved));
        }
      } catch (error) {
        if (cancelled) return;

        const fallback =
          getGalleryTemplateById(templateId) ??
          getGalleryTemplateById("tpl_meridian");

        if (fallback) {
          setTemplate(fallback);
          setCustomization(createDefaultCustomization(fallback));
        } else {
          toast.error(templateErrorMessage(error));
          setMissing(true);
          setTemplate(null);
          setCustomization(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [templateId]);

  const update = useCallback((patch: Partial<TemplateCustomization>) => {
    setCustomization((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const saveCustom = useCallback(async () => {
    if (!template || !customization) return;

    setSaving(true);
    try {
      await saveTemplateCustomization({
        templateSlug: template.id,
        name: `${template.name} customization`,
        customization,
      });
      toast.success("Design saved", {
        description: "Added to My Templates.",
      });
    } catch (error) {
      toast.error(templateErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }, [template, customization]);

  const applyToCv = useCallback(async () => {
    if (!template) return;

    setApplying(true);
    try {
      const cvs = await listUserCvs();
      const target = cvs.find((cv) => cv.isDefault) ?? cvs[0];

      if (!target) {
        router.push(`/cvs?template=${template.id}`);
        return;
      }

      await applyGalleryTemplateToCv(target.id, template.id);
      toast.success("Template applied", {
        description: `Updated "${target.title}".`,
      });
      router.push(`/cvs/${target.id}/edit`);
    } catch (error) {
      toast.error(templateErrorMessage(error));
    } finally {
      setApplying(false);
    }
  }, [router, template]);

  const value = useMemo<CustomizeContextValue | null>(() => {
    if (!template || !customization) return null;

    return {
      template,
      customization,
      zoom,
      setZoom,
      drawerOpen,
      setDrawerOpen,
      update,
      applyPalette: (palette) =>
        update({
          primaryColor: palette.primary,
          accentColor: palette.accent,
          backgroundColor: palette.background,
          textColor: palette.text,
        }),
      setFont: (fontFamily) => update({ fontFamily }),
      setLayout: (layout) => update({ layout }),
      toggleSection: (id) =>
        setCustomization((prev) =>
          prev
            ? {
                ...prev,
                sections: prev.sections.map((s) =>
                  s.id === id ? { ...s, visible: !s.visible } : s,
                ),
              }
            : prev,
        ),
      moveSection: (id, direction) =>
        setCustomization((prev) => {
          if (!prev) return prev;
          const index = prev.sections.findIndex((s) => s.id === id);
          if (index < 0) return prev;
          const target = direction === "up" ? index - 1 : index + 1;
          if (target < 0 || target >= prev.sections.length) return prev;
          const sections = [...prev.sections];
          const [item] = sections.splice(index, 1);
          sections.splice(target, 0, item);
          return { ...prev, sections };
        }),
      reset: () => {
        setCustomization(createDefaultCustomization(template));
        toast.message("Customization reset");
      },
      saveCustom,
      applyToCv,
      applying,
      saving,
    };
  }, [
    template,
    customization,
    zoom,
    drawerOpen,
    update,
    saveCustom,
    applyToCv,
    applying,
    saving,
  ]);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-paper-dim">
        <LoadingSkeleton variant="editor" className="w-full max-w-lg" />
      </div>
    );
  }

  if (missing || !value) {
    return (
      <div className="flex h-dvh items-center justify-center bg-paper-dim p-6">
        <EmptyState
          icon={LayoutTemplate}
          title="Template not found"
          description="We couldn't load this template. Pick another from the gallery."
          actionLabel="Browse templates"
          onAction={() => router.push("/templates")}
        />
      </div>
    );
  }

  return (
    <CustomizeContext.Provider value={value}>
      {children}
    </CustomizeContext.Provider>
  );
}

export function useCustomize() {
  const ctx = useContext(CustomizeContext);
  if (!ctx) {
    throw new Error("useCustomize must be used within CustomizeProvider");
  }
  return ctx;
}
