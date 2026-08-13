import type { CSSProperties } from "react";
import type { EditorTemplateId } from "@/features/cv-editor/types";
import type { TemplateCustomization } from "@/features/templates/types";
import { templateFonts } from "@/mocks/templates-gallery";
import type { DocumentPageSize, DocumentStyleVars } from "@/components/document/types";

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

function resolveFontStack(
  fontId: TemplateCustomization["fontFamily"] | undefined,
): string {
  const match = templateFonts.find((f) => f.id === fontId);
  return match?.stack ?? templateFonts[0].stack;
}

function resolveHeadingFont(
  headingStyle: TemplateCustomization["headingStyle"] | undefined,
  bodyFont: string,
): string {
  if (headingStyle === "sans") {
    return "var(--font-sans), Inter, system-ui, sans-serif";
  }
  if (headingStyle === "mixed") {
    return "var(--font-serif), Fraunces, Georgia, serif";
  }
  return bodyFont;
}

export function resolveCvDocumentStyle(
  templateId: EditorTemplateId,
  customization?: Partial<TemplateCustomization> | null,
  pageSize: DocumentPageSize = "a4",
): DocumentStyleVars {
  const fontFamily = resolveFontStack(customization?.fontFamily);
  const margins = customization?.margins ?? 32;

  return {
    accent: customization?.accentColor ?? TEMPLATE_ACCENT[templateId],
    primary: customization?.primaryColor ?? TEMPLATE_PRIMARY[templateId],
    background: customization?.backgroundColor ?? "#FFFFFF",
    text: customization?.textColor ?? "#1B1D1B",
    fontFamily,
    fontHeading: resolveHeadingFont(customization?.headingStyle, fontFamily),
    fontSize: customization?.fontSize ?? 11,
    lineHeight: customization?.bodySpacing ?? 1.45,
    padX: Math.round(margins * 0.9),
    padY: Math.round(margins),
    sectionSpacing: customization?.sectionSpacing ?? 12,
    layout: customization?.layout ?? "single",
    pageSize: customization?.pageSize === "a4" ? "a4" : pageSize,
  };
}

export function documentStyleToCssVars(
  style: DocumentStyleVars,
): CSSProperties {
  return {
    ["--doc-accent" as string]: style.accent,
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
