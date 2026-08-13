import type { CvDocument, ExperienceEntry } from "@/features/cv-editor/types";
import { AI_MAX_CV_CONTEXT_CHARS } from "@/lib/ai/limits";

export type CvContextPayload = {
  title: string;
  professionalTitle: string;
  summary: string;
  skills: string[];
  experience: Array<{
    id: string;
    type: string;
    company: string;
    role: string;
    location?: string;
    duration?: string;
    responsibilities: string[];
    achievements: string[];
    skillsGained: string[];
  }>;
  education: Array<{
    qualification: string;
    institution: string;
    year?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
};

function experienceCompany(exp: ExperienceEntry): string {
  if ("company" in exp && exp.company) return exp.company;
  if ("organization" in exp) return exp.organization;
  if ("clientName" in exp) return exp.clientName;
  return "";
}

function experienceRole(exp: ExperienceEntry): string {
  if ("position" in exp && exp.position) return exp.position;
  if ("role" in exp && exp.role) return exp.role;
  if ("projectName" in exp) return exp.projectName;
  if ("programmeName" in exp) return exp.programmeName;
  return "";
}

function experienceLocation(exp: ExperienceEntry): string | undefined {
  if ("location" in exp && exp.location) return exp.location;
  return undefined;
}

function formatDuration(exp: ExperienceEntry): string | undefined {
  if ("duration" in exp && exp.duration?.trim()) return exp.duration.trim();
  if ("dateMode" in exp && exp.dateMode === "duration" && "duration" in exp) {
    return exp.duration || undefined;
  }
  const start =
    "startMonth" in exp
      ? [exp.startMonth, exp.startYear].filter(Boolean).join("/")
      : "";
  const end =
    "current" in exp && exp.current
      ? "Present"
      : "endMonth" in exp
        ? [exp.endMonth, exp.endYear].filter(Boolean).join("/")
        : "";
  if (!start && !end) return undefined;
  return [start, end].filter(Boolean).join(" – ");
}

function experienceLists(exp: ExperienceEntry) {
  return {
    responsibilities: "responsibilities" in exp ? exp.responsibilities : [],
    achievements: "achievements" in exp ? exp.achievements : [],
    skillsGained: "skillsGained" in exp ? exp.skillsGained : [],
  };
}

export function buildCvContext(document: CvDocument): CvContextPayload {
  return {
    title: document.title,
    professionalTitle: document.personal.title,
    summary: document.summary,
    skills: document.skills.map((s) => s.name),
    experience: document.experience.map((exp) => ({
      id: exp.id,
      type: exp.experienceType,
      company: experienceCompany(exp),
      role: experienceRole(exp),
      location: experienceLocation(exp),
      duration: formatDuration(exp),
      ...experienceLists(exp),
    })),
    education: document.education.map((ed) => {
      let institution = "";
      if ("schoolName" in ed && typeof ed.schoolName === "string") {
        institution = ed.schoolName;
      } else if ("institutionName" in ed && typeof ed.institutionName === "string") {
        institution = ed.institutionName;
      }

      let year: string | undefined;
      if ("yearCompleted" in ed && typeof ed.yearCompleted === "string") {
        year = ed.yearCompleted;
      } else if ("graduationYear" in ed && typeof ed.graduationYear === "string") {
        year = ed.graduationYear;
      }

      return {
        qualification:
          "qualificationType" in ed
            ? String(ed.qualificationType).replace(/-/g, " ")
            : "qualification",
        institution,
        year,
      };
    }),
    projects: document.projects.map((p) => ({
      name: p.name,
      description: p.description,
      technologies: p.technologies ?? [],
    })),
  };
}

export function serializeCvContext(document: CvDocument): string {
  const payload = buildCvContext(document);
  let text = JSON.stringify(payload, null, 2);
  if (text.length > AI_MAX_CV_CONTEXT_CHARS) {
    text = text.slice(0, AI_MAX_CV_CONTEXT_CHARS);
  }
  return text;
}

export function buildSummaryInput(document: CvDocument, currentSummary: string): string {
  const ctx = buildCvContext(document);
  return JSON.stringify(
    {
      professionalTitle: ctx.professionalTitle,
      summary: currentSummary,
      skills: ctx.skills,
      experience: ctx.experience.slice(0, 6),
      education: ctx.education.slice(0, 4),
      targetRole: document.personal.title,
    },
    null,
    2,
  );
}
