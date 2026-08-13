import type {
  EducationEntry,
  EducationQualificationType,
  ExamBoardId,
  SubjectGrade,
  TertiaryEducation,
} from "@/features/cv-editor/types";
import {
  normalizeTertiaryEntry,
  syncTertiaryDates,
} from "@/lib/cvs/education-dates";

export const QUALIFICATION_OPTIONS: {
  id: EducationQualificationType;
  label: string;
  description: string;
}[] = [
  {
    id: "o-level",
    label: "Ordinary Level (O Level)",
    description: "Secondary school exam subjects and grades",
  },
  {
    id: "a-level",
    label: "Advanced Level (A Level)",
    description: "Sixth form / A Level subjects and grades",
  },
  {
    id: "certificate",
    label: "Certificate",
    description: "Short academic or skills certificates",
  },
  {
    id: "diploma",
    label: "Diploma",
    description: "College or polytechnic diploma",
  },
  {
    id: "hnd",
    label: "Higher National Diploma",
    description: "HND and equivalent qualifications",
  },
  {
    id: "bachelors",
    label: "Bachelor's Degree",
    description: "Undergraduate degree programmes",
  },
  {
    id: "honours",
    label: "Honours Degree",
    description: "Honours classification programmes",
  },
  {
    id: "masters",
    label: "Master's Degree",
    description: "Postgraduate master's programmes",
  },
  {
    id: "doctorate",
    label: "Doctorate (PhD)",
    description: "Doctoral research qualifications",
  },
  {
    id: "professional",
    label: "Professional Certification",
    description: "Industry or professional body credentials",
  },
  {
    id: "vocational",
    label: "Vocational Training",
    description: "Skills programmes and trade training",
  },
  {
    id: "short-course",
    label: "Short Course",
    description: "Focused short learning programmes",
  },
  {
    id: "apprenticeship",
    label: "Apprenticeship",
    description: "Work-based apprenticeship programmes",
  },
  {
    id: "other",
    label: "Other",
    description: "Any other qualification type",
  },
];

export const EXAM_BOARD_OPTIONS: { id: ExamBoardId; label: string; short: string }[] = [
  {
    id: "zimsec",
    label: "Zimbabwe School Examinations Council (ZIMSEC)",
    short: "ZIMSEC",
  },
  {
    id: "cambridge",
    label: "Cambridge Assessment International Education",
    short: "Cambridge",
  },
  { id: "other", label: "Other", short: "Other" },
];

export const SUBJECT_GRADE_OPTIONS = [
  "A*",
  "A",
  "B",
  "C",
  "D",
  "E",
  "U",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

export function qualificationLabel(type: EducationQualificationType): string {
  return QUALIFICATION_OPTIONS.find((o) => o.id === type)?.label ?? type;
}

export function examBoardLabel(
  board: ExamBoardId,
  other?: string,
): string {
  if (board === "other") return other?.trim() || "Other";
  return EXAM_BOARD_OPTIONS.find((o) => o.id === board)?.label ?? board;
}

export function examBoardShort(
  board: ExamBoardId,
  other?: string,
): string {
  if (board === "other") return other?.trim() || "Other";
  return EXAM_BOARD_OPTIONS.find((o) => o.id === board)?.short ?? board;
}

export function createSubject(partial?: Partial<SubjectGrade>): SubjectGrade {
  return {
    id: crypto.randomUUID(),
    name: "",
    grade: "",
    ...partial,
  };
}

export function createEducationEntry(
  type: EducationQualificationType,
  id = crypto.randomUUID(),
): EducationEntry {
  switch (type) {
    case "o-level":
    case "a-level":
      return {
        id,
        qualificationType: type,
        examinationBoard: "zimsec",
        examinationBoardOther: "",
        schoolName: "",
        yearCompleted: "",
        candidateNumber: "",
        subjects: [createSubject()],
      };
    case "certificate":
      return {
        id,
        qualificationType: "certificate",
        certificateName: "",
        institution: "",
        year: "",
        credentialNumber: "",
        description: "",
      };
    case "professional":
      return {
        id,
        qualificationType: "professional",
        certificationName: "",
        issuingOrganization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        verificationUrl: "",
      };
    case "vocational":
    case "short-course":
    case "apprenticeship":
      return {
        id,
        qualificationType: type,
        trainingProvider: "",
        programmeName: "",
        duration: "",
        completionDate: "",
        skillsAcquired: "",
      };
    default:
      return normalizeTertiaryEntry({
        id,
        qualificationType: type,
        institution: "",
        city: "",
        qualification: "",
        field: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        current: false,
        startDate: "",
        endDate: "",
        grade: "",
        achievements: "",
        description: "",
      });
  }
}

export function patchTertiaryEntry(
  entry: TertiaryEducation,
  patch: Partial<TertiaryEducation>,
): TertiaryEducation {
  return normalizeTertiaryEntry({ ...entry, ...patch });
}

export function educationCardSummary(entry: EducationEntry): {
  title: string;
  subtitle: string;
  meta: string;
} {
  switch (entry.qualificationType) {
    case "o-level":
    case "a-level": {
      const count = entry.subjects.filter((s) => s.name.trim()).length;
      return {
        title: qualificationLabel(entry.qualificationType),
        subtitle:
          count > 0
            ? `${count} Subject${count === 1 ? "" : "s"}`
            : "No subjects added",
        meta: entry.yearCompleted
          ? `Completed ${entry.yearCompleted}`
          : entry.schoolName || "In progress",
      };
    }
    case "certificate":
      return {
        title: qualificationLabel(entry.qualificationType),
        subtitle: entry.certificateName || "Untitled certificate",
        meta: [entry.institution, entry.year].filter(Boolean).join(" · "),
      };
    case "professional":
      return {
        title: qualificationLabel(entry.qualificationType),
        subtitle: entry.certificationName || "Untitled certification",
        meta: [entry.issuingOrganization, entry.issueDate]
          .filter(Boolean)
          .join(" · "),
      };
    case "vocational":
    case "short-course":
    case "apprenticeship":
      return {
        title: qualificationLabel(entry.qualificationType),
        subtitle: entry.programmeName || "Untitled programme",
        meta: [entry.trainingProvider, entry.completionDate]
          .filter(Boolean)
          .join(" · "),
      };
    default: {
      const synced = syncTertiaryDates(entry);
      const title =
        synced.qualification.trim() ||
        qualificationLabel(entry.qualificationType);
      return {
        title,
        subtitle: synced.institution || "Untitled institution",
        meta: [synced.city, formatTertiaryDateMeta(synced)]
          .filter(Boolean)
          .join(" · "),
      };
    }
  }
}

function formatTertiaryDateMeta(entry: TertiaryEducation): string {
  const start = [entry.startMonth, entry.startYear].filter(Boolean).length
    ? [entry.startMonth, entry.startYear].filter(Boolean).join("/")
    : entry.startDate;
  const end = entry.current
    ? "Present"
    : [entry.endMonth, entry.endYear].filter(Boolean).length
      ? [entry.endMonth, entry.endYear].filter(Boolean).join("/")
      : entry.endDate;
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

export type EducationFieldErrors = Record<string, string>;

export function validateEducationEntry(
  entry: EducationEntry,
): EducationFieldErrors {
  const errors: EducationFieldErrors = {};
  const yearOk = (y: string) => !y || /^(19|20)\d{2}$/.test(y.trim());

  switch (entry.qualificationType) {
    case "o-level":
    case "a-level": {
      if (!entry.schoolName.trim()) errors.schoolName = "School name is required";
      if (!entry.yearCompleted.trim()) {
        errors.yearCompleted = "Year completed is required";
      } else if (!yearOk(entry.yearCompleted)) {
        errors.yearCompleted = "Enter a valid year (e.g. 2022)";
      }
      if (entry.examinationBoard === "other" && !entry.examinationBoardOther.trim()) {
        errors.examinationBoardOther = "Specify the examination board";
      }
      const seen = new Map<string, number>();
      entry.subjects.forEach((s, i) => {
        const key = s.name.trim().toLowerCase();
        if (!s.name.trim()) errors[`subjects.${i}.name`] = "Subject is required";
        if (!s.grade.trim()) errors[`subjects.${i}.grade`] = "Grade is required";
        if (key) {
          if (seen.has(key)) {
            errors[`subjects.${i}.name`] = "Duplicate subject";
            errors[`subjects.${seen.get(key)}.name`] = "Duplicate subject";
          } else {
            seen.set(key, i);
          }
        }
      });
      break;
    }
    case "certificate":
      if (!entry.certificateName.trim()) {
        errors.certificateName = "Certificate name is required";
      }
      if (!entry.institution.trim()) errors.institution = "Institution is required";
      if (entry.year && !yearOk(entry.year)) {
        errors.year = "Enter a valid year";
      }
      break;
    case "professional":
      if (!entry.certificationName.trim()) {
        errors.certificationName = "Certification name is required";
      }
      if (!entry.issuingOrganization.trim()) {
        errors.issuingOrganization = "Issuing organization is required";
      }
      break;
    case "vocational":
    case "short-course":
    case "apprenticeship":
      if (!entry.programmeName.trim()) {
        errors.programmeName = "Programme name is required";
      }
      if (!entry.trainingProvider.trim()) {
        errors.trainingProvider = "Training provider is required";
      }
      break;
    default: {
      if (!entry.qualification.trim()) {
        errors.qualification = "Education is required";
      }
      if (!entry.institution.trim()) {
        errors.institution = "Institution is required";
      }
      const monthYearOk = (month: string, year: string) =>
        !year.trim() || /^(19|20)\d{2}$/.test(year.trim());
      if (!monthYearOk(entry.startMonth, entry.startYear)) {
        errors.startYear = "Enter a valid start year";
      }
      if (!entry.current && !monthYearOk(entry.endMonth, entry.endYear)) {
        errors.endYear = "Enter a valid end year";
      }
      break;
    }
  }

  return errors;
}

export function isExamSubjectsEntry(
  entry: EducationEntry,
): entry is Extract<EducationEntry, { qualificationType: "o-level" | "a-level" }> {
  return entry.qualificationType === "o-level" || entry.qualificationType === "a-level";
}

export function isTertiaryEntry(
  entry: EducationEntry,
): entry is Extract<
  EducationEntry,
  {
    qualificationType:
      | "diploma"
      | "hnd"
      | "bachelors"
      | "honours"
      | "masters"
      | "doctorate"
      | "other";
  }
> {
  return (
    entry.qualificationType === "diploma" ||
    entry.qualificationType === "hnd" ||
    entry.qualificationType === "bachelors" ||
    entry.qualificationType === "honours" ||
    entry.qualificationType === "masters" ||
    entry.qualificationType === "doctorate" ||
    entry.qualificationType === "other"
  );
}
