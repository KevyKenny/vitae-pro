import type { EditorTemplateId } from "@/features/cv-editor/types";

export type TemplateStyle =
  | "modern"
  | "professional"
  | "minimal"
  | "executive"
  | "creative"
  | "academic";

export type CareerLevel =
  | "student"
  | "graduate"
  | "junior"
  | "mid-level"
  | "senior"
  | "executive";

export type Industry =
  | "technology"
  | "finance"
  | "healthcare"
  | "marketing"
  | "engineering"
  | "design";

export type TemplateBadge =
  | "free"
  | "premium"
  | "recommended"
  | "recruiter-favorite"
  | "popular";

export type LayoutMode = "single" | "two-column" | "sidebar";

export type PageSize = "a4";

export type FontFamilyId =
  | "inter"
  | "roboto"
  | "open-sans"
  | "lato"
  | "merriweather"
  | "fraunces"
  | "montserrat";

export type GallerySectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certificates"
  | "languages";

export type ColorPalette = {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
};

export type FontOption = {
  id: FontFamilyId;
  label: string;
  stack: string;
};

export type GalleryTemplate = {
  id: string;
  name: string;
  description: string;
  style: TemplateStyle;
  careerLevels: CareerLevel[];
  industries: Industry[];
  rating: number;
  reviews: number;
  popularity: number;
  badges: TemplateBadge[];
  isPremium: boolean;
  isFeatured?: boolean;
  accent: string;
  previewAccent: string;
  editorStyle: EditorTemplateId;
  typography: string;
  layoutStyle: string;
  bestFor: string[];
  features: string[];
  readability: number;
};

export type SavedTemplateEntry = {
  id: string;
  templateId: string;
  name: string;
  kind: "recent" | "saved" | "custom";
  updatedAt: string;
  customizationId?: string;
};

export type TemplateCustomization = {
  templateId: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: FontFamilyId;
  fontSize: number;
  headingStyle: "serif" | "sans" | "mixed";
  bodySpacing: number;
  layout: LayoutMode;
  sectionSpacing: number;
  margins: number;
  pageSize: PageSize;
  sections: { id: GallerySectionId; label: string; visible: boolean }[];
};
