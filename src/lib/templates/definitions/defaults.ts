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
      // Measured from template-default.pdf: 10pt body, #385987 band/headings,
      // 200pt rail, 15pt side insets.
      primaryColor: "#385987",
      accentColor: "#395a86",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "sidebar",
      margins: 33,
      sectionSpacing: 10,
      fontSize: 13.33,
      bodySpacing: 1.375,
    },
    tpl_0: {
      // template-2.pdf: 10pt Inter, 25pt margins, charcoal #303845 header.
      primaryColor: "#303845",
      accentColor: "#303845",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "sidebar",
      margins: 33,
      sectionSpacing: 12,
      fontSize: 13.33,
      bodySpacing: 1.375,
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
      // template-3.pdf: 10pt body, 40pt margins, taupe headings #b59e96.
      primaryColor: "#b59e96",
      accentColor: "#b59e96",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "single",
      margins: 53,
      sectionSpacing: 12,
      fontSize: 13.33,
      bodySpacing: 1.375,
    },
    tpl_3: {
      // template-5.pdf: 10pt Inter, 30pt margins, black type, #d9d9d9 rules.
      primaryColor: "#000000",
      accentColor: "#000000",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "single",
      margins: 40,
      sectionSpacing: 12,
      fontSize: 13.33,
      bodySpacing: 1.375,
    },
    tpl_4: {
      // template-4.pdf: 10pt body, 30pt inset, accent #ad3f40 on #faf5f5 rail.
      primaryColor: "#ad3f40",
      accentColor: "#ad3f40",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontFamily: "inter",
      headingStyle: "sans",
      layout: "sidebar",
      margins: 40,
      sectionSpacing: 10,
      fontSize: 13.33,
      bodySpacing: 1.375,
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
