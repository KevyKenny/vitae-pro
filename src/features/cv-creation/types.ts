import type { CvSectionType } from "@/features/cv-editor/types";

export type GuidedCvStepId =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "additional"
  | "template"
  | "review";

export type GuidedCvStep = {
  id: GuidedCvStepId;
  label: string;
  sectionType?: CvSectionType;
  optional?: boolean;
  description: string;
};

export const GUIDED_CV_STEPS: GuidedCvStep[] = [
  {
    id: "personal",
    label: "Personal",
    sectionType: "personal",
    description: "Your name and contact details — pulled from your profile when available.",
  },
  {
    id: "summary",
    label: "Summary",
    sectionType: "summary",
    optional: true,
    description: "A short introduction. Not sure what to write? AI can help.",
  },
  {
    id: "experience",
    label: "Experience",
    sectionType: "experience",
    optional: true,
    description:
      "Work, internship, industrial attachment, volunteer roles, or graduate trainee programmes.",
  },
  {
    id: "education",
    label: "Education",
    sectionType: "education",
    optional: true,
    description:
      "O Level, A Level, diploma, degree, or vocational training — add what applies to you.",
  },
  {
    id: "skills",
    label: "Skills",
    sectionType: "skills",
    optional: true,
    description: "Technical and soft skills. AI can suggest skills for your background.",
  },
  {
    id: "additional",
    label: "More",
    sectionType: "projects",
    optional: true,
    description: "Projects, achievements, certifications, or languages — optional extras.",
  },
  {
    id: "template",
    label: "Design",
    optional: true,
    description: "Choose a professional template when your content is ready.",
  },
  {
    id: "review",
    label: "Review",
    optional: true,
    description: "Check completeness, run analysis, and download when you're happy.",
  },
];

export type CreateCvMethod = "guided" | "scratch" | "import";

export type CreateCvFormValues = {
  targetRole: string;
  targetIndustry: string;
  targetLocation: string;
  jobDescription: string;
};
