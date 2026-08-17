import type { TemplateCustomization } from "@/features/templates/types";
import type { TemplateRendererKey } from "@/lib/templates/definitions/types";

const BASE_SECTIONS: TemplateCustomization["sections"] = [
  { id: "summary", label: "Summary", visible: true },
  { id: "experience", label: "Experience", visible: true },
  { id: "education", label: "Education", visible: true },
  { id: "skills", label: "Skills", visible: true },
  { id: "projects", label: "Projects", visible: true },
  { id: "certificates", label: "Certificates", visible: true },
  { id: "languages", label: "Languages", visible: true },
];

export function createTemplateDefaultCustomization(
  templateId: TemplateRendererKey,
  overrides: Partial<TemplateCustomization> = {},
): TemplateCustomization {
  const presets: Record<
    TemplateRendererKey,
    Pick<
      TemplateCustomization,
      | "primaryColor"
      | "accentColor"
      | "backgroundColor"
      | "textColor"
      | "fontFamily"
      | "headingStyle"
      | "layout"
      | "margins"
      | "sectionSpacing"
      | "fontSize"
      | "bodySpacing"
    >
  > = {
    tpl_default: {
      primaryColor: "#1f4471",
      accentColor: "#2f6099",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "sidebar",
      margins: 32,
      sectionSpacing: 10,
      fontSize: 13,
      bodySpacing: 1.45,
    },
    tpl_0: {
      primaryColor: "#1e4a8a",
      accentColor: "#1e4a8a",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      fontFamily: "roboto",
      headingStyle: "sans",
      layout: "sidebar",
      margins: 28,
      sectionSpacing: 10,
      fontSize: 10.5,
      bodySpacing: 1.4,
    },
    tpl_1: {
      // Measured from template-0.pdf: Roboto, 11pt body, 30pt side margins,
      // sky-400 headings on near-black text.
      primaryColor: "#38bdf8",
      accentColor: "#38bdf8",
      backgroundColor: "#ffffff",
      textColor: "#171717",
      fontFamily: "roboto",
      headingStyle: "sans",
      layout: "single",
      margins: 44,
      sectionSpacing: 12,
      fontSize: 14.7,
      bodySpacing: 1.32,
    },
    tpl_2: {
      primaryColor: "#2563eb",
      accentColor: "#2563eb",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "single",
      margins: 30,
      sectionSpacing: 11,
      fontSize: 10.5,
      bodySpacing: 1.42,
    },
    tpl_3: {
      primaryColor: "#8b6914",
      accentColor: "#8b6914",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "two-column",
      margins: 26,
      sectionSpacing: 10,
      fontSize: 10.5,
      bodySpacing: 1.4,
    },
    tpl_4: {
      primaryColor: "#c0392b",
      accentColor: "#c0392b",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "sidebar",
      margins: 28,
      sectionSpacing: 10,
      fontSize: 10.5,
      bodySpacing: 1.4,
    },
    tpl_5: {
      // Measured from template-1.pdf: Montserrat, 10pt body, 20pt margins,
      // #3d94e3 accent on #333 text.
      primaryColor: "#3d94e3",
      accentColor: "#3d94e3",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      fontFamily: "montserrat",
      headingStyle: "sans",
      layout: "two-column",
      margins: 27,
      sectionSpacing: 10,
      fontSize: 13.34, // 10pt at 96dpi; every tpl-5 `em` below is one point.
      bodySpacing: 1.375,
    },
  };

  return {
    templateId,
    ...presets[templateId],
    pageSize: "a4",
    sections: BASE_SECTIONS,
    ...overrides,
  };
}
