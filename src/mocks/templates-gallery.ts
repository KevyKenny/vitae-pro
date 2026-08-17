import type {
  ColorPalette,
  FontOption,
  GalleryTemplate,
  SavedTemplateEntry,
  TemplateCustomization,
} from "@/features/templates/types";
import { TEMPLATE_DEFINITIONS } from "@/lib/templates/definitions";
import { createTemplateDefaultCustomization } from "@/lib/templates/definitions/defaults";

export const templateFonts: FontOption[] = [
  {
    id: "inter",
    label: "Inter",
    stack: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  {
    id: "roboto",
    label: "Roboto",
    stack: "var(--font-roboto), Roboto, system-ui, sans-serif",
  },
  {
    id: "open-sans",
    label: "Open Sans",
    stack: "'Open Sans', var(--font-inter), sans-serif",
  },
  {
    id: "lato",
    label: "Lato",
    stack: "Lato, var(--font-inter), sans-serif",
  },
  {
    id: "merriweather",
    label: "Merriweather",
    stack: "Merriweather, var(--font-fraunces), serif",
  },
  {
    id: "fraunces",
    label: "Fraunces",
    stack: "var(--font-fraunces), Fraunces, serif",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    stack: "var(--font-montserrat), Montserrat, system-ui, sans-serif",
  },
];

export const colorPalettes: ColorPalette[] = [
  {
    id: "blue",
    name: "Blue",
    primary: "#1e4a8a",
    accent: "#2563eb",
    background: "#FFFFFF",
    text: "#1a1a1a",
  },
  {
    id: "red",
    name: "Red",
    primary: "#c0392b",
    accent: "#c0392b",
    background: "#FFFFFF",
    text: "#1a1a1a",
  },
  {
    id: "brown",
    name: "Brown",
    primary: "#8b6914",
    accent: "#8b6914",
    background: "#FFFFFF",
    text: "#1a1a1a",
  },
];

function layoutStyleFor(definition: (typeof TEMPLATE_DEFINITIONS)[number]): string {
  switch (definition.layoutFamily) {
    case "sidebar":
      return "Sidebar + main column";
    case "form-two-column":
      return "Form two-column";
    default:
      return "Single column";
  }
}

export const galleryTemplates: GalleryTemplate[] = TEMPLATE_DEFINITIONS.map(
  (definition, index) => ({
    id: definition.slug,
    name: definition.name,
    description: definition.description,
    style: "modern",
    careerLevels: ["junior", "mid-level", "senior"],
    industries: ["technology", "engineering", "design"],
    rating: 4.8,
    reviews: 120 + index * 10,
    popularity: 95 - index * 3,
    badges: index === 0 ? ["recommended", "popular"] : ["free"],
    isPremium: false,
    isFeatured: index === 0,
    accent: definition.defaultCustomization.accentColor,
    previewAccent: definition.defaultCustomization.accentColor,
    editorStyle: "modern",
    typography: definition.fonts.body.includes("Montserrat")
      ? "Montserrat"
      : definition.fonts.body.includes("Poppins")
        ? "Poppins"
        : definition.fonts.body.includes("Roboto")
          ? "Roboto"
          : "Inter",
    layoutStyle: layoutStyleFor(definition),
    bestFor: ["Software engineers", "Graduates", "Professionals"],
    features: ["ATS-friendly", "Reference matched", "A4 layout"],
    readability: 92,
  }),
);

export const savedTemplates: SavedTemplateEntry[] = [
  {
    id: "saved_1",
    templateId: "tpl_default",
    name: "Classic Sidebar",
    kind: "recent",
    updatedAt: "2026-08-05T16:00:00.000Z",
  },
  {
    id: "saved_2",
    templateId: "tpl_1",
    name: "Professional",
    kind: "saved",
    updatedAt: "2026-08-04T11:20:00.000Z",
  },
];

export function getGalleryTemplateById(id: string): GalleryTemplate | undefined {
  return galleryTemplates.find((t) => t.id === id);
}

export function createDefaultCustomization(
  templateOrId: string | GalleryTemplate,
): TemplateCustomization {
  const templateId =
    typeof templateOrId === "string" ? templateOrId : templateOrId.id;
  const match = TEMPLATE_DEFINITIONS.find((d) => d.slug === templateId);
  if (match) {
    return createTemplateDefaultCustomization(match.id);
  }
  return createTemplateDefaultCustomization("tpl_default");
}
