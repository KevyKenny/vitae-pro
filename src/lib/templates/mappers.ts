import type { EditorTemplateId } from "@/features/cv-editor/types";
import type {
  CareerLevel,
  GalleryTemplate,
  Industry,
  SavedTemplateEntry,
  TemplateBadge,
  TemplateCustomization,
  TemplateStyle,
} from "@/features/templates/types";
import type { Json, Tables } from "@/lib/database/types";

type TemplateRow = Tables<"templates">;
type CustomizationRow = Tables<"user_template_customizations">;

const EDITOR_STYLES: EditorTemplateId[] = [
  "modern",
  "professional",
  "executive",
  "minimal",
  "creative",
];

const CAREER_LEVELS: CareerLevel[] = [
  "student",
  "graduate",
  "junior",
  "mid-level",
  "senior",
  "executive",
];

const INDUSTRIES: Industry[] = [
  "technology",
  "finance",
  "healthcare",
  "marketing",
  "engineering",
  "design",
];

const BADGES: TemplateBadge[] = [
  "free",
  "premium",
  "recommended",
  "recruiter-favorite",
  "popular",
];

const STYLES: TemplateStyle[] = [
  "modern",
  "professional",
  "minimal",
  "executive",
  "creative",
  "academic",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseEnumArray<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T[] {
  return parseStringArray(value).filter((item): item is T =>
    (allowed as readonly string[]).includes(item),
  );
}

function parseNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseMetadata(raw: Json): Record<string, unknown> {
  if (!isRecord(raw)) return {};
  return raw;
}

export function parseEditorStyle(
  value: string | null | undefined,
): EditorTemplateId {
  if (value && EDITOR_STYLES.includes(value as EditorTemplateId)) {
    return value as EditorTemplateId;
  }
  return "modern";
}

export function rowToGalleryTemplate(row: TemplateRow): GalleryTemplate {
  const meta = parseMetadata(row.metadata);
  const styleFromMeta =
    typeof meta.style === "string" ? meta.style : row.category ?? "modern";
  const style = STYLES.includes(styleFromMeta as TemplateStyle)
    ? (styleFromMeta as TemplateStyle)
    : "modern";

  const accent =
    typeof meta.accent === "string" ? meta.accent : "#1F4D3D";
  const previewAccent =
    typeof meta.previewAccent === "string" ? meta.previewAccent : accent;

  const badges = parseEnumArray(meta.badges, BADGES);
  const derivedBadges: TemplateBadge[] = [...badges];
  if (row.is_free && !derivedBadges.includes("free")) {
    derivedBadges.push("free");
  }
  if (row.is_premium && !derivedBadges.includes("premium")) {
    derivedBadges.push("premium");
  }

  return {
    id: row.slug,
    name: row.name,
    description: row.description ?? "",
    style,
    careerLevels: parseEnumArray(meta.careerLevels, CAREER_LEVELS),
    industries: parseEnumArray(meta.industries, INDUSTRIES),
    rating: parseNumber(meta.rating, 4.5),
    reviews: parseNumber(meta.reviews, 0),
    popularity: parseNumber(meta.popularity, 0),
    badges: derivedBadges,
    isPremium: row.is_premium,
    ...(row.is_featured ? { isFeatured: true } : {}),
    accent,
    previewAccent,
    editorStyle: parseEditorStyle(row.editor_style),
    typography:
      typeof meta.typography === "string" ? meta.typography : "Inter",
    layoutStyle:
      typeof meta.layoutStyle === "string"
        ? meta.layoutStyle
        : "Single column",
    bestFor: parseStringArray(meta.bestFor),
    features: parseStringArray(meta.features),
    readability: parseNumber(meta.readability, 90),
  };
}

function parseFontFamilyId(
  value: unknown,
): TemplateCustomization["fontFamily"] {
  const allowed: TemplateCustomization["fontFamily"][] = [
    "inter",
    "roboto",
    "open-sans",
    "lato",
    "merriweather",
    "fraunces",
  ];
  if (typeof value === "string" && allowed.includes(value as TemplateCustomization["fontFamily"])) {
    return value as TemplateCustomization["fontFamily"];
  }
  return "inter";
}

function parseLayout(value: unknown): TemplateCustomization["layout"] {
  const allowed: TemplateCustomization["layout"][] = [
    "single",
    "two-column",
    "sidebar",
  ];
  if (typeof value === "string" && allowed.includes(value as TemplateCustomization["layout"])) {
    return value as TemplateCustomization["layout"];
  }
  return "single";
}

function parseHeadingStyle(
  value: unknown,
): TemplateCustomization["headingStyle"] {
  const allowed: TemplateCustomization["headingStyle"][] = [
    "serif",
    "sans",
    "mixed",
  ];
  if (
    typeof value === "string" &&
    allowed.includes(value as TemplateCustomization["headingStyle"])
  ) {
    return value as TemplateCustomization["headingStyle"];
  }
  return "sans";
}

function parseSections(
  value: unknown,
): TemplateCustomization["sections"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((section) => ({
      id: typeof section.id === "string"
        ? (section.id as TemplateCustomization["sections"][number]["id"])
        : "summary",
      label: typeof section.label === "string" ? section.label : "Section",
      visible: section.visible !== false,
    }));
}

export function parseTemplateCustomization(
  raw: Json,
  templateSlug: string,
): TemplateCustomization | null {
  if (!isRecord(raw)) return null;

  return {
    templateId: typeof raw.templateId === "string" ? raw.templateId : templateSlug,
    primaryColor:
      typeof raw.primaryColor === "string" ? raw.primaryColor : "#1F4D3D",
    accentColor:
      typeof raw.accentColor === "string" ? raw.accentColor : "#B08D3E",
    backgroundColor:
      typeof raw.backgroundColor === "string"
        ? raw.backgroundColor
        : "#FFFFFF",
    textColor:
      typeof raw.textColor === "string" ? raw.textColor : "#1B1D1B",
    fontFamily: parseFontFamilyId(raw.fontFamily),
    fontSize: parseNumber(raw.fontSize, 11),
    headingStyle: parseHeadingStyle(raw.headingStyle),
    bodySpacing: parseNumber(raw.bodySpacing, 1.45),
    layout: parseLayout(raw.layout),
    sectionSpacing: parseNumber(raw.sectionSpacing, 14),
    margins: parseNumber(raw.margins, 48),
    pageSize: "a4",
    sections: parseSections(raw.sections),
  };
}

export function customizationToJson(
  customization: TemplateCustomization,
): Json {
  return customization as unknown as Json;
}

export function rowToSavedTemplateEntry(
  row: CustomizationRow,
): SavedTemplateEntry {
  return {
    id: row.id,
    templateId: row.template_slug ?? row.template_id ?? "",
    name: row.name,
    kind: "custom",
    updatedAt: row.updated_at,
    customizationId: row.id,
  };
}

export type { TemplateRow, CustomizationRow };
