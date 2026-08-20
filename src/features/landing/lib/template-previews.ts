import type { EditorTemplateId } from "@/features/cv-editor/types";

export type LandingLayoutTemplate = {
  id: EditorTemplateId;
  slug: string;
  name: string;
  description: string;
  previewSrc: string;
};

/** First-page previews rendered from `templates layout/*.pdf`. */
export const LAYOUT_TEMPLATES: LandingLayoutTemplate[] = [
  {
    id: "professional",
    slug: "template-default",
    name: "Default",
    description: "Two-column layout with a name block and skills sidebar.",
    previewSrc: "/templates/template-default.png",
  },
  {
    id: "minimal",
    slug: "template-0",
    name: "Compact",
    description: "Single-column layout with a centered header and clear rules.",
    previewSrc: "/templates/template-0.png",
  },
  {
    id: "modern",
    slug: "template-1",
    name: "Timeline",
    description: "Dates on the left, roles on the right, with a vertical rail.",
    previewSrc: "/templates/template-1.png",
  },
  {
    id: "executive",
    slug: "template-2",
    name: "Contrast",
    description: "Dark header bar with a right-hand details column.",
    previewSrc: "/templates/template-2.png",
  },
  {
    id: "professional",
    slug: "template-3",
    name: "Classic",
    description: "Serif name, labeled details, and a warm accent tab.",
    previewSrc: "/templates/template-3.png",
  },
  {
    id: "creative",
    slug: "template-4",
    name: "Split",
    description: "Cream sidebar for details and skills, burgundy headings.",
    previewSrc: "/templates/template-4.png",
  },
  {
    id: "minimal",
    slug: "template-5",
    name: "Formal",
    description: "Centered resume title with labeled fields and open spacing.",
    previewSrc: "/templates/template-5.png",
  },
];
