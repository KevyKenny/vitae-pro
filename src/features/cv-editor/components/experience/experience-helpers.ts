import type {
  ExperienceEntry,
  ExperienceTypeId,
  SupervisorReference,
} from "@/features/cv-editor/types";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "@/lib/cvs/date-options";
import {
  Briefcase,
  Building2,
  Clock,
  FileSignature,
  GraduationCap,
  HandHelping,
  Laptop,
  Target,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export { MONTH_OPTIONS, YEAR_OPTIONS };

export const EXPERIENCE_TYPE_OPTIONS: {
  id: ExperienceTypeId;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "full-time",
    label: "Full-Time Employment",
    description: "Permanent or ongoing full-time roles",
    icon: Briefcase,
  },
  {
    id: "part-time",
    label: "Part-Time Employment",
    description: "Regular part-time paid work",
    icon: Clock,
  },
  {
    id: "internship",
    label: "Internship",
    description: "Structured internship programmes",
    icon: Target,
  },
  {
    id: "industrial-attachment",
    label: "Industrial Attachment",
    description: "Work attachments and industrial training",
    icon: GraduationCap,
  },
  {
    id: "graduate-trainee",
    label: "Graduate Trainee",
    description: "Graduate trainee or rotation programmes",
    icon: Users,
  },
  {
    id: "apprenticeship",
    label: "Apprenticeship",
    description: "Trade or professional apprenticeships",
    icon: Wrench,
  },
  {
    id: "freelance",
    label: "Freelance",
    description: "Client projects and contract gigs",
    icon: Laptop,
  },
  {
    id: "volunteer",
    label: "Volunteer",
    description: "Community and nonprofit contributions",
    icon: HandHelping,
  },
  {
    id: "contract",
    label: "Contract",
    description: "Fixed-term contract roles",
    icon: FileSignature,
  },
  {
    id: "temporary",
    label: "Temporary Employment",
    description: "Temp or short-term placements",
    icon: Clock,
  },
  {
    id: "consulting",
    label: "Consulting",
    description: "Advisory or consulting engagements",
    icon: Building2,
  },
  {
    id: "self-employed",
    label: "Self-Employed",
    description: "Your own business or solo practice",
    icon: UserRound,
  },
  {
    id: "other",
    label: "Other",
    description: "Any other professional experience",
    icon: Briefcase,
  },
];

export const DURATION_OPTIONS = [
  "3 Months",
  "6 Months",
  "8 Months",
  "10 Months",
  "12 Months",
  "1 Year",
] as const;

export const SUGGESTED_SKILLS = [
  "React",
  "Customer Service",
  "Networking",
  "Sales",
  "Accounting",
  "Java",
  "Python",
  "Communication",
  "Leadership",
  "Microsoft Excel",
  "Problem Solving",
  "Data Analysis",
  "Teamwork",
  "Time Management",
] as const;

export function emptySupervisor(): SupervisorReference {
  return { name: "", position: "", email: "", phone: "" };
}

export function experienceTypeLabel(type: ExperienceTypeId): string {
  return EXPERIENCE_TYPE_OPTIONS.find((o) => o.id === type)?.label ?? type;
}

export function experiencePrimaryTitle(entry: ExperienceEntry): string {
  switch (entry.experienceType) {
    case "industrial-attachment":
    case "internship":
      return entry.role || experienceTypeLabel(entry.experienceType);
    case "graduate-trainee":
      return entry.programmeName || "Graduate Trainee";
    case "volunteer":
      return entry.role || "Volunteer";
    case "freelance":
      return entry.projectName || "Freelance project";
    default:
      return entry.position || experienceTypeLabel(entry.experienceType);
  }
}

export function experienceOrganization(entry: ExperienceEntry): string {
  switch (entry.experienceType) {
    case "volunteer":
      return entry.organization;
    case "freelance":
      return entry.clientName;
    default:
      return "company" in entry ? entry.company : "";
  }
}

export function experienceResponsibilityList(
  entry: ExperienceEntry,
): string[] {
  if ("responsibilities" in entry) return entry.responsibilities;
  if ("achievements" in entry) return entry.achievements;
  return [];
}

export function withUpdatedFirstBullet(
  entry: ExperienceEntry,
  text: string,
): ExperienceEntry {
  return withUpdatedExperienceField(entry, "responsibilities", 0, text);
}

export function withUpdatedExperienceField(
  entry: ExperienceEntry,
  field: "responsibilities" | "achievements",
  index: number,
  text: string,
): ExperienceEntry {
  if (field === "responsibilities" && "responsibilities" in entry) {
    const responsibilities = [...entry.responsibilities];
    while (responsibilities.length <= index) responsibilities.push("");
    responsibilities[index] = text;
    return { ...entry, responsibilities };
  }
  if (field === "achievements" && "achievements" in entry) {
    const achievements = [...entry.achievements];
    while (achievements.length <= index) achievements.push("");
    achievements[index] = text;
    return { ...entry, achievements };
  }
  return entry;
}

export function appendExperienceBullets(
  entry: ExperienceEntry,
  bullets: string[],
): ExperienceEntry {
  if ("responsibilities" in entry) {
    const existing = entry.responsibilities.filter((b) => b.trim());
    return {
      ...entry,
      responsibilities: [...existing, ...bullets.filter((b) => b.trim())],
    };
  }
  return entry;
}

/** Replace the responsibility list with AI-generated bullets (description rewrite). */
export function replaceExperienceBullets(
  entry: ExperienceEntry,
  bullets: string[],
  field: "responsibilities" | "achievements" = "responsibilities",
): ExperienceEntry {
  const next = bullets.map((b) => b.trim()).filter(Boolean);
  if (field === "achievements" && "achievements" in entry) {
    return { ...entry, achievements: next };
  }
  if ("responsibilities" in entry) {
    return { ...entry, responsibilities: next };
  }
  return entry;
}

export function formatMonthYear(month: string, year: string): string {
  if (!year) return "";
  const label = MONTH_OPTIONS.find((m) => m.id === month)?.label;
  return label ? `${label} ${year}` : year;
}

export function formatDateRange(entry: {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current?: boolean;
}): string {
  const start = formatMonthYear(entry.startMonth, entry.startYear);
  if (entry.current) {
    return start ? `${start} – Present` : "Present";
  }
  const end = formatMonthYear(entry.endMonth, entry.endYear);
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

export function aiTipForExperienceType(type: ExperienceTypeId): string {
  switch (type) {
    case "industrial-attachment":
      return "Highlight what you learned and the impact you made.";
    case "internship":
      return "Emphasize practical skills and contributions.";
    case "volunteer":
      return "Focus on measurable community impact.";
    case "freelance":
      return "Highlight deliverables and client outcomes.";
    case "graduate-trainee":
      return "Show growth across rotations and programme outcomes.";
    default:
      return "Lead with impact, metrics, and clear ownership.";
  }
}

export function createExperienceEntry(
  type: ExperienceTypeId,
  id = crypto.randomUUID(),
): ExperienceEntry {
  const sharedDates = {
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
  };

  switch (type) {
    case "industrial-attachment":
    case "internship":
      return {
        id,
        experienceType: type,
        company: "",
        department: "",
        role: "",
        location: "",
        dateMode: "range",
        ...sharedDates,
        duration: "",
        responsibilities: [""],
        skillsGained: [],
        achievements: [""],
        supervisor: emptySupervisor(),
        includeSupervisorOnExport: false,
      };
    case "graduate-trainee":
      return {
        id,
        experienceType: "graduate-trainee",
        programmeName: "",
        department: "",
        company: "",
        rotationDetails: "",
        location: "",
        ...sharedDates,
        responsibilities: [""],
        skillsGained: [],
        achievements: [""],
      };
    case "volunteer":
      return {
        id,
        experienceType: "volunteer",
        organization: "",
        role: "",
        cause: "",
        impact: "",
        location: "",
        ...sharedDates,
        responsibilities: [""],
        achievements: [""],
      };
    case "freelance":
      return {
        id,
        experienceType: "freelance",
        clientName: "",
        projectName: "",
        technologies: [],
        duration: "",
        dateMode: "duration",
        ...sharedDates,
        achievements: [""],
        portfolioLink: "",
      };
    default:
      return {
        id,
        experienceType: type,
        company: "",
        position: "",
        location: "",
        ...sharedDates,
        responsibilities: [""],
        skillsGained: [],
        achievements: [""],
      };
  }
}

export function experienceCardSummary(entry: ExperienceEntry): {
  title: string;
  subtitle: string;
  meta: string;
  badge: string;
} {
  const badge = experienceTypeLabel(entry.experienceType);

  switch (entry.experienceType) {
    case "industrial-attachment":
    case "internship": {
      const span =
        entry.dateMode === "duration" && entry.duration
          ? entry.duration
          : formatDateRange(entry);
      return {
        title: entry.role || badge,
        subtitle: [entry.company, entry.department].filter(Boolean).join(" · "),
        meta: span || "Dates not set",
        badge,
      };
    }
    case "graduate-trainee":
      return {
        title: entry.programmeName || badge,
        subtitle: [entry.company, entry.department].filter(Boolean).join(" · "),
        meta: formatDateRange(entry) || "Dates not set",
        badge,
      };
    case "volunteer":
      return {
        title: entry.role || badge,
        subtitle: entry.organization || "Organization not set",
        meta: formatDateRange(entry) || "Dates not set",
        badge,
      };
    case "freelance":
      return {
        title: entry.projectName || badge,
        subtitle: entry.clientName || "Client optional",
        meta:
          entry.dateMode === "duration" && entry.duration
            ? entry.duration
            : formatDateRange(entry) || "Duration not set",
        badge,
      };
    default:
      return {
        title: entry.position || badge,
        subtitle: [entry.company, entry.location].filter(Boolean).join(" · "),
        meta: formatDateRange(entry) || "Dates not set",
        badge,
      };
  }
}

export type ExperienceFieldErrors = Record<string, string>;

function validYear(y: string) {
  return !y || /^(19|20)\d{2}$/.test(y.trim());
}

export function validateExperienceEntry(
  entry: ExperienceEntry,
): ExperienceFieldErrors {
  const errors: ExperienceFieldErrors = {};

  const requireRange = (
    startMonth: string,
    startYear: string,
    endMonth: string,
    endYear: string,
    current: boolean,
    mode?: "range" | "duration",
    duration?: string,
  ) => {
    if (mode === "duration") {
      if (!duration?.trim()) errors.duration = "Select or enter a duration";
      return;
    }
    if (!startYear.trim()) errors.startYear = "Start year is required";
    else if (!validYear(startYear)) errors.startYear = "Enter a valid year";
    if (!startMonth) errors.startMonth = "Start month is required";
    if (!current) {
      if (!endYear.trim()) errors.endYear = "End year is required";
      else if (!validYear(endYear)) errors.endYear = "Enter a valid year";
      if (!endMonth) errors.endMonth = "End month is required";
      if (
        startYear &&
        endYear &&
        Number(endYear) < Number(startYear)
      ) {
        errors.endYear = "End must be after start";
      }
    }
  };

  switch (entry.experienceType) {
    case "industrial-attachment":
    case "internship":
      if (!entry.company.trim()) errors.company = "Company is required";
      if (!entry.role.trim()) errors.role = "Role is required";
      requireRange(
        entry.startMonth,
        entry.startYear,
        entry.endMonth,
        entry.endYear,
        entry.current,
        entry.dateMode,
        entry.duration,
      );
      break;
    case "graduate-trainee":
      if (!entry.programmeName.trim()) {
        errors.programmeName = "Programme name is required";
      }
      if (!entry.company.trim()) errors.company = "Company is required";
      requireRange(
        entry.startMonth,
        entry.startYear,
        entry.endMonth,
        entry.endYear,
        entry.current,
      );
      break;
    case "volunteer":
      if (!entry.organization.trim()) {
        errors.organization = "Organization is required";
      }
      if (!entry.role.trim()) errors.role = "Role is required";
      requireRange(
        entry.startMonth,
        entry.startYear,
        entry.endMonth,
        entry.endYear,
        entry.current,
      );
      break;
    case "freelance":
      if (!entry.projectName.trim()) {
        errors.projectName = "Project name is required";
      }
      requireRange(
        entry.startMonth,
        entry.startYear,
        entry.endMonth,
        entry.endYear,
        false,
        entry.dateMode,
        entry.duration,
      );
      break;
    default:
      if (!entry.company.trim()) errors.company = "Company is required";
      if (!entry.position.trim()) errors.position = "Position is required";
      requireRange(
        entry.startMonth,
        entry.startYear,
        entry.endMonth,
        entry.endYear,
        entry.current,
      );
      break;
  }

  return errors;
}
