import type { CvDocument, CvSectionType } from "@/features/cv-editor/types";
import { calculateCvCompletion } from "@/lib/cvs/completion";

export type CompletionCheckItem = {
  id: string;
  label: string;
  complete: boolean;
  sectionType?: CvSectionType;
  optional?: boolean;
};

export type CvSmartRecommendation = {
  id: string;
  title: string;
  description: string;
  action: "navigate" | "analyze" | "tailor" | "template";
  sectionType?: CvSectionType;
  href?: string;
};

function hasText(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

export function getCvCompletionChecklist(doc: CvDocument): CompletionCheckItem[] {
  const hasPersonal =
    hasText(doc.personal.fullName) &&
    (hasText(doc.personal.email) || hasText(doc.personal.phone));

  const hasSummary = doc.summary.trim().length >= 40;
  const hasExperience = doc.experience.length > 0;
  const hasEducation = doc.education.length > 0;
  const hasSkills = doc.skills.filter((s) => hasText(s.name)).length >= 2;
  const hasProjects = doc.projects.some((p) => hasText(p.name));

  return [
    {
      id: "personal",
      label: "Personal information",
      complete: hasPersonal,
      sectionType: "personal",
    },
    {
      id: "summary",
      label: "Professional summary",
      complete: hasSummary,
      sectionType: "summary",
      optional: true,
    },
    {
      id: "experience",
      label: "Experience or attachment",
      complete: hasExperience,
      sectionType: "experience",
      optional: true,
    },
    {
      id: "education",
      label: "Education",
      complete: hasEducation,
      sectionType: "education",
      optional: true,
    },
    {
      id: "skills",
      label: "Skills",
      complete: hasSkills,
      sectionType: "skills",
      optional: true,
    },
    {
      id: "projects",
      label: "Projects or achievements",
      complete: hasProjects || doc.achievements.some((a) => hasText(a.title)),
      sectionType: "projects",
      optional: true,
    },
  ];
}

export function getCvSmartRecommendations(
  doc: CvDocument,
  options?: { hasAnalysis?: boolean; targetRole?: string | null },
): CvSmartRecommendation[] {
  const checklist = getCvCompletionChecklist(doc);
  const completion = calculateCvCompletion(doc);
  const recs: CvSmartRecommendation[] = [];

  const incomplete = checklist.filter((item) => !item.complete && item.sectionType);

  if (incomplete.some((i) => i.id === "personal")) {
    recs.push({
      id: "add-personal",
      title: "Add your contact details",
      description: "Recruiters need a way to reach you.",
      action: "navigate",
      sectionType: "personal",
    });
  } else if (doc.experience.length > 0 && !checklist.find((i) => i.id === "summary")?.complete) {
    recs.push({
      id: "add-summary",
      title: "Add a professional summary",
      description: "A short summary helps recruiters understand your focus quickly.",
      action: "navigate",
      sectionType: "summary",
    });
  } else if (doc.education.length > 0 && !checklist.find((i) => i.id === "skills")?.complete) {
    recs.push({
      id: "add-skills",
      title: "Add your skills",
      description: "Include technical and soft skills relevant to your target role.",
      action: "navigate",
      sectionType: "skills",
    });
  } else if (
    doc.experience.length === 0 &&
    doc.education.length === 0
  ) {
    recs.push({
      id: "add-education",
      title: "Add your education",
      description: "O Level, A Level, diploma, or degree — include what you have completed.",
      action: "navigate",
      sectionType: "education",
    });
  }

  if (options?.targetRole && completion >= 50) {
    recs.push({
      id: "tailor-cv",
      title: "Create a tailored CV",
      description: `Duplicate your CV and tailor it for ${options.targetRole}.`,
      action: "tailor",
    });
  }

  if (completion >= 60 && !options?.hasAnalysis) {
    recs.push({
      id: "run-analysis",
      title: "Run your CV analysis",
      description: "See ATS score, strengths, and improvement tips.",
      action: "analyze",
    });
  }

  return recs.slice(0, 3);
}

export function getCompletionSummary(doc: CvDocument): {
  percent: number;
  readyMessage: string;
} {
  const percent = calculateCvCompletion(doc);
  const readyMessage =
    percent >= 80
      ? "Your CV is ready to preview and download."
      : percent >= 50
        ? `Your CV is ${percent}% complete — keep going.`
        : `Your CV is ${percent}% complete — add a few more sections.`;

  return { percent, readyMessage };
}
