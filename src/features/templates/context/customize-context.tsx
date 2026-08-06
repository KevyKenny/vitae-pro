"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
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
  saveCustom: () => void;
};

const CustomizeContext = createContext<CustomizeContextValue | null>(null);

export function CustomizeProvider({
  templateId,
  children,
}: {
  templateId: string;
  children: React.ReactNode;
}) {
  const template =
    getGalleryTemplateById(templateId) ?? getGalleryTemplateById("tpl_meridian")!;
  const [customization, setCustomization] = useState(() =>
    createDefaultCustomization(template.id),
  );
  const [zoom, setZoom] = useState(100);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const update = useCallback((patch: Partial<TemplateCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<CustomizeContextValue>(
    () => ({
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
        setCustomization((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === id ? { ...s, visible: !s.visible } : s,
          ),
        })),
      moveSection: (id, direction) =>
        setCustomization((prev) => {
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
        setCustomization(createDefaultCustomization(template.id));
        toast.message("Customization reset");
      },
      saveCustom: () => {
        toast.success("Design saved", {
          description: "Added to My Templates (UI only).",
        });
      },
    }),
    [template, customization, zoom, drawerOpen, update],
  );

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
