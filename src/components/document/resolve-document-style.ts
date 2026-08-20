import type { CSSProperties } from "react";
import type { EditorTemplateId } from "@/features/cv-editor/types";
import type { TemplateCustomization } from "@/features/templates/types";
import { templateFonts } from "@/mocks/templates-gallery";
import type { DocumentPageSize, DocumentStyleVars } from "@/components/document/types";
import type { TemplateDefinition } from "@/lib/templates/definitions/types";

const TEMPLATE_PRIMARY: Record<EditorTemplateId, string> = {
  modern: "#1F4D3D",
  professional: "#2C3E50",
  executive: "#1F4D3D",
  minimal: "#1B1D1B",
  creative: "#1B1D1B",
};

const TEMPLATE_ACCENT: Record<EditorTemplateId, string> = {
  modern: "#1F4D3D",
  professional: "#2C3E50",
  executive: "#2F7A5C",
  minimal: "#55584F",
  creative: "#B08D3E",
};

const FONT_STACKS: Record<string, string> = {
  inter: "var(--font-inter), Inter, system-ui, sans-serif",
  roboto: "var(--font-roboto), Roboto, system-ui, sans-serif",
  "open-sans": "'Open Sans', var(--font-inter), sans-serif",
  lato: "Lato, var(--font-inter), sans-serif",
  merriweather: "Merriweather, var(--font-serif), serif",
  fraunces: "var(--font-fraunces), Fraunces, serif",
  montserrat: "var(--font-montserrat), Montserrat, system-ui, sans-serif",
  poppins: "var(--font-poppins), Poppins, system-ui, sans-serif",
};

function resolveFontStack(
  fontId: TemplateCustomization["fontFamily"] | undefined,
  definition?: TemplateDefinition,
): string {
  if (fontId && FONT_STACKS[fontId]) return FONT_STACKS[fontId];
  const match = templateFonts.find((f) => f.id === fontId);
  if (match?.stack) return match.stack;
  return definition?.fonts.body ?? FONT_STACKS.inter;
}

function resolveHeadingFont(
  headingStyle: TemplateCustomization["headingStyle"] | undefined,
  bodyFont: string,
  definition?: TemplateDefinition,
): string {
  if (definition?.fonts.heading) return definition.fonts.heading;
  if (headingStyle === "sans") {
    return "var(--font-inter), Inter, system-ui, sans-serif";
  }
  if (headingStyle === "mixed") {
    return "var(--font-fraunces), Fraunces, Georgia, serif";
  }
  return bodyFont;
}

export function resolveCvDocumentStyle(
  templateId: EditorTemplateId,
  customization?: Partial<TemplateCustomization> | null,
  pageSize: DocumentPageSize = "a4",
  definition?: TemplateDefinition,
): DocumentStyleVars {
  const defaults = definition?.defaultCustomization;
  const fontFamily = resolveFontStack(
    customization?.fontFamily ?? defaults?.fontFamily,
    definition,
  );
  const margins = customization?.margins ?? defaults?.margins ?? 32;
  const padRatio = definition?.pagePaddingRatio ?? { x: 0.9, y: 1 };

  return {
    accent:
      customization?.accentColor ??
      defaults?.accentColor ??
      TEMPLATE_ACCENT[templateId],
    primary:
      customization?.primaryColor ??
      defaults?.primaryColor ??
      TEMPLATE_PRIMARY[templateId],
    background:
      customization?.backgroundColor ?? defaults?.backgroundColor ?? "#FFFFFF",
    text: customization?.textColor ?? defaults?.textColor ?? "#1B1D1B",
    fontFamily,
    fontHeading: resolveHeadingFont(
      customization?.headingStyle ?? defaults?.headingStyle,
      fontFamily,
      definition,
    ),
    fontSize: customization?.fontSize ?? defaults?.fontSize ?? 11,
    lineHeight: customization?.bodySpacing ?? defaults?.bodySpacing ?? 1.45,
    padX: Math.round(margins * padRatio.x),
    padY: Math.round(margins * padRatio.y),
    sectionSpacing:
      customization?.sectionSpacing ?? defaults?.sectionSpacing ?? 12,
    layout: customization?.layout ?? defaults?.layout ?? "single",
    pageSize,
  };
}

export function documentStyleToCssVars(
  style: DocumentStyleVars,
): CSSProperties {
  return {
    ["--doc-accent" as string]: style.accent,
    ["--doc-primary" as string]: style.primary,
    ["--doc-ink" as string]: style.text,
    ["--doc-bg" as string]: style.background,
    ["--doc-font" as string]: style.fontFamily,
    ["--doc-font-heading" as string]: style.fontHeading,
    ["--doc-base-size" as string]: `${style.fontSize}px`,
    ["--doc-line-height" as string]: String(style.lineHeight),
    ["--doc-pad-x" as string]: `${style.padX}px`,
    ["--doc-pad-y" as string]: `${style.padY}px`,
    color: style.text,
    background: style.background,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
  };
}
