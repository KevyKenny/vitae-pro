import type {
  AchievementEntry,
  AttachmentExperience,
  CertificationEntry,
  CvDocument,
  CvSectionMeta,
  EducationEntry,
  EmploymentExperience,
  ExamBoardId,
  ExperienceDateMode,
  ExperienceEntry,
  FreelanceExperience,
  GraduateTraineeExperience,
  LanguageEntry,
  PersonalCustomField,
  PersonalFieldVisibility,
  PersonalInfo,
  ProjectEntry,
  ReferenceEntry,
  SkillCategory,
  SkillEntry,
  SubjectGrade,
  VolunteerExperience,
} from "@/features/cv-editor/types";
import { isTemplateRendererKey, resolveRendererKey } from "@/lib/templates/definitions";
import { parseEditorStyle } from "@/lib/templates/mappers";
import {
  toDbExperienceType,
  toDbQualificationType,
  toEditorExperienceType,
  toEditorQualificationType,
} from "@/lib/database/constants";
import {
  normalizeTertiaryEntry,
  syncTertiaryDates,
} from "@/lib/cvs/education-dates";
import { applySectionCompletions } from "@/lib/cvs/completion";
import {
  normalizePersonalInfo,
  syncPersonalLegacyFields,
} from "@/lib/cvs/personal-info";
import type {
  Tables,
  TablesInsert,
} from "@/lib/database/types";

type CvRow = Tables<"cvs">;
type SectionRow = Tables<"cv_sections">;
type PersonalRow = Tables<"cv_personal_info">;
type SummaryRow = Tables<"cv_summaries">;
type WorkExperienceRow = Tables<"work_experiences">;
type BulletRow = Tables<"experience_bullets">;
type EducationRow = Tables<"educations">;
type SubjectRow = Tables<"education_subjects">;
type SkillRow = Tables<"skills">;
type ProjectRow = Tables<"projects">;
type CertificationRow = Tables<"certifications">;
type LanguageRow = Tables<"languages">;
type AchievementRow = Tables<"achievements">;
type ReferenceRow = Tables<"cv_references">;

export type CvDocumentParts = {
  cv: CvRow;
  sections: SectionRow[];
  personal: PersonalRow | null;
  summary: SummaryRow | null;
  experiences: WorkExperienceRow[];
  bullets: BulletRow[];
  educations: EducationRow[];
  subjects: SubjectRow[];
  skills: SkillRow[];
  projects: ProjectRow[];
  certifications: CertificationRow[];
  languages: LanguageRow[];
  achievements: AchievementRow[];
  references: ReferenceRow[];
};

const EMPLOYMENT_TYPES = new Set([
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "consulting",
  "self-employed",
  "apprenticeship",
  "other",
]);

const ATTACHMENT_TYPES = new Set(["internship", "industrial-attachment"]);

function parseOptionalDate(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}$/.test(trimmed)) return `${trimmed}-01`;
  if (/^\d{4}$/.test(trimmed)) return `${trimmed}-01-01`;
  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return null;
}

function formatOptionalDate(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function toEditorSkillCategory(dbCategory: string): SkillCategory {
  switch (dbCategory) {
    case "soft_skill":
      return "soft";
    case "tool":
      return "tools";
    case "language":
      return "languages";
    case "framework":
      return "frameworks";
    case "technical":
      return "technical";
    default:
      return "technical";
  }
}

function toDbSkillCategory(category: SkillCategory): string {
  switch (category) {
    case "soft":
      return "soft_skill";
    case "tools":
      return "tool";
    case "languages":
      return "language";
    case "frameworks":
      return "framework";
    case "technical":
      return "technical";
    default:
      return "other";
  }
}

function bulletsForExperience(
  experienceId: string,
  bullets: BulletRow[],
): {
  responsibilities: string[];
  skillsGained: string[];
  achievements: string[];
} {
  const filtered = bullets
    .filter((b) => b.experience_id === experienceId)
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    responsibilities: filtered
      .filter((b) => b.bullet_type === "responsibility")
      .map((b) => b.content),
    skillsGained: filtered
      .filter((b) => b.bullet_type === "skill_gained")
      .map((b) => b.content),
    achievements: filtered
      .filter((b) => b.bullet_type === "achievement")
      .map((b) => b.content),
  };
}

function mapExperienceRow(
  row: WorkExperienceRow,
  bullets: BulletRow[],
): ExperienceEntry {
  const editorType = toEditorExperienceType(row.experience_type);
  const bulletGroups = bulletsForExperience(row.id, bullets);
  const baseDates = {
    startMonth: row.start_month ?? "",
    startYear: row.start_year ?? "",
    endMonth: row.end_month ?? "",
    endYear: row.end_year ?? "",
    current: row.is_current,
  };

  if (ATTACHMENT_TYPES.has(editorType)) {
    const entry: AttachmentExperience = {
      id: row.id,
      experienceType: editorType as AttachmentExperience["experienceType"],
      company: row.company_name ?? "",
      department: row.department ?? "",
      role: row.job_title ?? "",
      location: row.location ?? "",
      dateMode: (row.date_mode as ExperienceDateMode) || "range",
      duration: row.duration_text ?? "",
      responsibilities: bulletGroups.responsibilities,
      skillsGained: bulletGroups.skillsGained,
      achievements: bulletGroups.achievements,
      supervisor: {
        name: row.supervisor_name ?? "",
        position: row.supervisor_position ?? "",
        email: row.supervisor_email ?? "",
        phone: row.supervisor_phone ?? "",
      },
      includeSupervisorOnExport: row.include_supervisor_on_export,
      ...baseDates,
    };
    return entry;
  }

  if (editorType === "graduate-trainee") {
    const entry: GraduateTraineeExperience = {
      id: row.id,
      experienceType: "graduate-trainee",
      programmeName: row.programme_name ?? "",
      department: row.department ?? "",
      company: row.company_name ?? "",
      rotationDetails: row.rotation_details ?? "",
      location: row.location ?? "",
      responsibilities: bulletGroups.responsibilities,
      skillsGained: bulletGroups.skillsGained,
      achievements: bulletGroups.achievements,
      ...baseDates,
    };
    return entry;
  }

  if (editorType === "volunteer") {
    const entry: VolunteerExperience = {
      id: row.id,
      experienceType: "volunteer",
      organization: row.organization_name ?? "",
      role: row.job_title ?? "",
      cause: row.cause ?? "",
      impact: row.impact ?? "",
      location: row.location ?? "",
      responsibilities: bulletGroups.responsibilities,
      achievements: bulletGroups.achievements,
      ...baseDates,
    };
    return entry;
  }

  if (editorType === "freelance") {
    const entry: FreelanceExperience = {
      id: row.id,
      experienceType: "freelance",
      clientName: row.client_name ?? "",
      projectName: row.project_name ?? "",
      technologies: row.technologies ?? [],
      duration: row.duration_text ?? "",
      dateMode: (row.date_mode as ExperienceDateMode) || "range",
      achievements: bulletGroups.achievements,
      portfolioLink: row.portfolio_link ?? "",
      ...baseDates,
    };
    return entry;
  }

  const entry: EmploymentExperience = {
    id: row.id,
    experienceType: (EMPLOYMENT_TYPES.has(editorType)
      ? editorType
      : "other") as EmploymentExperience["experienceType"],
    company: row.company_name ?? "",
    position: row.job_title ?? "",
    location: row.location ?? "",
    responsibilities: bulletGroups.responsibilities,
    skillsGained: bulletGroups.skillsGained,
    achievements: bulletGroups.achievements,
    ...baseDates,
  };
  return entry;
}

function mapEducationRow(
  row: EducationRow,
  subjects: SubjectRow[],
): EducationEntry {
  const qualificationType = toEditorQualificationType(row.qualification_type);

  if (qualificationType === "o-level" || qualificationType === "a-level") {
    const entrySubjects: SubjectGrade[] = subjects
      .filter((s) => s.education_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        id: s.id,
        name: s.subject_name,
        grade: s.grade,
      }));

    return {
      id: row.id,
      qualificationType,
      examinationBoard: (row.examination_board ?? "other") as ExamBoardId,
      examinationBoardOther: row.examination_board_other ?? "",
      schoolName: row.school_name ?? "",
      yearCompleted: row.year_completed ?? "",
      candidateNumber: row.candidate_number ?? "",
      subjects: entrySubjects,
    };
  }

  if (qualificationType === "certificate") {
    return {
      id: row.id,
      qualificationType: "certificate",
      certificateName: row.certificate_name ?? "",
      institution: row.institution ?? "",
      year: row.completion_year ?? row.year_completed ?? "",
      credentialNumber: row.credential_number ?? "",
      description: row.description ?? "",
    };
  }

  if (qualificationType === "professional") {
    return {
      id: row.id,
      qualificationType: "professional",
      certificationName: row.certification_name ?? "",
      issuingOrganization: row.issuing_organization ?? "",
      issueDate: formatOptionalDate(row.issue_date),
      expiryDate: formatOptionalDate(row.expiry_date),
      credentialId: row.credential_id ?? "",
      verificationUrl: row.verification_url ?? "",
    };
  }

  if (
    qualificationType === "vocational" ||
    qualificationType === "short-course" ||
    qualificationType === "apprenticeship"
  ) {
    return {
      id: row.id,
      qualificationType,
      trainingProvider: row.training_provider ?? "",
      programmeName: row.programme_name ?? "",
      duration: row.duration ?? "",
      completionDate: formatOptionalDate(row.completion_date),
      skillsAcquired: row.skills_acquired ?? "",
    };
  }

  return normalizeTertiaryEntry({
    id: row.id,
    qualificationType: (qualificationType === "honours"
      ? "honours"
      : qualificationType === "diploma"
        ? "diploma"
        : qualificationType === "hnd"
          ? "hnd"
          : qualificationType === "bachelors"
            ? "bachelors"
            : qualificationType === "masters"
              ? "masters"
              : qualificationType === "doctorate"
                ? "doctorate"
                : "other") as
      | "diploma"
      | "hnd"
      | "bachelors"
      | "honours"
      | "masters"
      | "doctorate"
      | "other",
    institution: row.institution ?? "",
    city: row.location ?? "",
    qualification: row.qualification ?? "",
    field: row.field_of_study ?? "",
    startDate: formatOptionalDate(row.start_date),
    endDate: formatOptionalDate(row.end_date),
    current: Boolean(row.start_date && !row.end_date),
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    grade: row.grade ?? "",
    achievements: row.achievements ?? "",
    description: row.description ?? "",
  });
}

function parseCustomFields(value: unknown): PersonalCustomField[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is PersonalCustomField =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as PersonalCustomField).id === "string",
        ),
    )
    .map((item) => ({
      id: item.id,
      label: item.label ?? "",
      value: item.value ?? "",
    }));
}

function parseFieldVisibility(value: unknown): PersonalFieldVisibility {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as PersonalFieldVisibility;
}

function mapPersonalRow(row: PersonalRow | null): PersonalInfo {
  if (!row) {
    return normalizePersonalInfo({});
  }

  return normalizePersonalInfo({
    photoUrl: row.photo_url ?? undefined,
    givenName: row.given_name ?? "",
    familyName: row.family_name ?? "",
    fullName: row.full_name ?? "",
    title: row.professional_title ?? "",
    useAsHeadline: row.use_as_headline ?? true,
    email: row.email ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    postCode: row.post_code ?? "",
    city: row.city ?? "",
    location: row.location ?? "",
    driversLicense: row.drivers_license ?? "",
    linkedin: row.linkedin ?? "",
    portfolio: row.portfolio ?? "",
    socialLinks: row.social_links ?? [],
    dateOfBirth: row.date_of_birth ?? "",
    placeOfBirth: row.place_of_birth ?? "",
    gender: row.gender ?? "",
    nationality: row.nationality ?? "",
    civilStatus: row.civil_status ?? "",
    customFields: parseCustomFields(row.custom_fields),
    fieldVisibility: parseFieldVisibility(row.field_visibility),
  });
}

function mapSections(rows: SectionRow[]): CvSectionMeta[] {
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: row.id,
      type: row.section_type as CvSectionMeta["type"],
      label: row.title,
      visible: row.is_visible,
      completion: 0,
      ...(row.section_type === "custom" ? { content: row.content ?? "" } : {}),
    }));
}

export function assembleCvDocument(parts: CvDocumentParts): CvDocument {
  const rawKey = parts.cv.template_key ?? "modern";
  const rendererKey = isTemplateRendererKey(rawKey)
    ? rawKey
    : resolveRendererKey({ legacyTemplateId: parseEditorStyle(rawKey) });
  const templateKey = parseEditorStyle(
    isTemplateRendererKey(rawKey) ? "modern" : rawKey,
  );

  const document: CvDocument = {
    id: parts.cv.id,
    title: parts.cv.title,
    templateId: templateKey,
    templateSlug: rendererKey,
    rendererKey,
    personal: mapPersonalRow(parts.personal),
    summary: parts.summary?.content ?? "",
    experience: parts.experiences
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((row) => mapExperienceRow(row, parts.bullets)),
    education: parts.educations
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((row) => mapEducationRow(row, parts.subjects)),
    skills: parts.skills
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (row): SkillEntry => ({
          id: row.id,
          name: row.name,
          category: toEditorSkillCategory(row.category),
          level: row.proficiency_level,
        }),
      ),
    projects: parts.projects
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (row): ProjectEntry => ({
          id: row.id,
          name: row.project_name,
          description: row.description ?? "",
          technologies: row.technologies ?? [],
          link: row.project_url ?? row.repository_url ?? "",
          imageUrl: row.image_url ?? undefined,
        }),
      ),
    certifications: parts.certifications
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((row): CertificationEntry => {
        const issueDate = formatOptionalDate(row.issue_date);
        const dateText =
          issueDate ||
          (row.description?.match(/^\[Date: ([^\]]+)\]/)?.[1] ?? "");
        return {
          id: row.id,
          name: row.certification_name,
          provider: row.issuing_organization ?? "",
          date: dateText,
          credentialUrl: row.verification_url ?? "",
        };
      }),
    languages: parts.languages
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (row): LanguageEntry => ({
          id: row.id,
          name: row.language,
          proficiency: row.proficiency ?? "",
        }),
      ),
    achievements: parts.achievements
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (row): AchievementEntry => ({
          id: row.id,
          title: row.title,
          description: row.description ?? "",
        }),
      ),
    references: parts.references
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (row): ReferenceEntry => ({
          id: row.id,
          name: row.name,
          relationship: row.relationship ?? "",
          contact: row.contact ?? "",
        }),
      ),
    sections: mapSections(parts.sections),
    updatedAt: parts.cv.updated_at,
  };
  return applySectionCompletions(document);
}

function experienceToRow(
  cvId: string,
  entry: ExperienceEntry,
  sortOrder: number,
): TablesInsert<"work_experiences"> {
  const dbType = toDbExperienceType(entry.experienceType);
  const base: TablesInsert<"work_experiences"> = {
    id: entry.id,
    cv_id: cvId,
    experience_type: dbType,
    sort_order: sortOrder,
    date_mode: "range",
    is_current: "current" in entry ? entry.current : false,
    technologies: [],
    include_supervisor_on_export: false,
  };

  if ("dateMode" in entry) {
    base.date_mode = entry.dateMode;
  }
  if ("startMonth" in entry) base.start_month = entry.startMonth || null;
  if ("startYear" in entry) base.start_year = entry.startYear || null;
  if ("endMonth" in entry) base.end_month = entry.endMonth || null;
  if ("endYear" in entry) base.end_year = entry.endYear || null;
  if ("duration" in entry && entry.duration) {
    base.duration_text = entry.duration;
  }
  if ("location" in entry) base.location = entry.location || null;

  if ("company" in entry) base.company_name = entry.company || null;
  if ("position" in entry) base.job_title = entry.position || null;
  if ("department" in entry) base.department = entry.department || null;
  if ("role" in entry && !("position" in entry)) {
    base.job_title = entry.role || null;
  }
  if ("programmeName" in entry) base.programme_name = entry.programmeName || null;
  if ("rotationDetails" in entry) {
    base.rotation_details = entry.rotationDetails || null;
  }
  if ("organization" in entry) {
    base.organization_name = entry.organization || null;
  }
  if ("cause" in entry) base.cause = entry.cause || null;
  if ("impact" in entry) base.impact = entry.impact || null;
  if ("clientName" in entry) base.client_name = entry.clientName || null;
  if ("projectName" in entry) base.project_name = entry.projectName || null;
  if ("technologies" in entry && Array.isArray(entry.technologies)) {
    base.technologies = entry.technologies;
  }
  if ("portfolioLink" in entry) {
    base.portfolio_link = entry.portfolioLink || null;
  }
  if ("supervisor" in entry) {
    base.supervisor_name = entry.supervisor.name || null;
    base.supervisor_position = entry.supervisor.position || null;
    base.supervisor_email = entry.supervisor.email || null;
    base.supervisor_phone = entry.supervisor.phone || null;
    base.include_supervisor_on_export = entry.includeSupervisorOnExport;
  }

  return base;
}

function experienceBulletsToRows(
  entry: ExperienceEntry,
): TablesInsert<"experience_bullets">[] {
  const rows: TablesInsert<"experience_bullets">[] = [];
  let order = 0;

  const pushBullets = (
    items: string[] | undefined,
    bulletType: "responsibility" | "skill_gained" | "achievement",
  ) => {
    for (const content of items ?? []) {
      if (!content.trim()) continue;
      rows.push({
        id: crypto.randomUUID(),
        experience_id: entry.id,
        bullet_type: bulletType,
        content: content.trim(),
        sort_order: order++,
      });
    }
  };

  if ("responsibilities" in entry) {
    pushBullets(entry.responsibilities, "responsibility");
  }
  if ("skillsGained" in entry) {
    pushBullets(entry.skillsGained, "skill_gained");
  }
  if ("achievements" in entry) {
    pushBullets(entry.achievements, "achievement");
  }

  return rows;
}

function isTertiaryShape(
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

function educationToRow(
  cvId: string,
  entry: EducationEntry,
  sortOrder: number,
): TablesInsert<"educations"> {
  const row: TablesInsert<"educations"> = {
    id: entry.id,
    cv_id: cvId,
    qualification_type: toDbQualificationType(entry.qualificationType),
    sort_order: sortOrder,
  };

  if ("examinationBoard" in entry) {
    row.examination_board = entry.examinationBoard;
    row.examination_board_other = entry.examinationBoardOther || null;
    row.school_name = entry.schoolName || null;
    row.year_completed = entry.yearCompleted || null;
    row.candidate_number = entry.candidateNumber || null;
  }

  if ("institution" in entry && "qualification" in entry && isTertiaryShape(entry)) {
    const synced = syncTertiaryDates(entry);
    row.institution = synced.institution || null;
    row.location = synced.city || null;
    row.qualification = synced.qualification || null;
    row.field_of_study = synced.field || null;
    row.start_date = parseOptionalDate(synced.startDate);
    row.end_date = synced.current ? null : parseOptionalDate(synced.endDate);
    row.grade = synced.grade || null;
    row.achievements = synced.achievements || null;
    row.description = synced.description || null;
  }

  if ("certificateName" in entry) {
    row.certificate_name = entry.certificateName || null;
    row.institution = entry.institution || null;
    row.completion_year = entry.year || null;
    row.credential_number = entry.credentialNumber || null;
    row.description = entry.description || null;
  }

  if ("certificationName" in entry) {
    row.certification_name = entry.certificationName || null;
    row.issuing_organization = entry.issuingOrganization || null;
    row.issue_date = parseOptionalDate(entry.issueDate);
    row.expiry_date = parseOptionalDate(entry.expiryDate);
    row.credential_id = entry.credentialId || null;
    row.verification_url = entry.verificationUrl || null;
  }

  if ("trainingProvider" in entry) {
    row.training_provider = entry.trainingProvider || null;
    row.programme_name = entry.programmeName || null;
    row.duration = entry.duration || null;
    row.completion_date = parseOptionalDate(entry.completionDate);
    row.skills_acquired = entry.skillsAcquired || null;
  }

  return row;
}

function educationSubjectsToRows(
  entry: EducationEntry,
): TablesInsert<"education_subjects">[] {
  if (!("subjects" in entry)) return [];
  return entry.subjects
    .filter((s) => s.name.trim())
    .map((subject, index) => ({
      id: subject.id,
      education_id: entry.id,
      subject_name: subject.name.trim(),
      grade: subject.grade.trim(),
      sort_order: index,
    }));
}

function parseProjectUrls(link: string): {
  project_url: string | null;
  repository_url: string | null;
} {
  const trimmed = link.trim();
  if (!trimmed) return { project_url: null, repository_url: null };
  if (/github\.com|gitlab\.com|bitbucket\.org/i.test(trimmed)) {
    return { project_url: null, repository_url: trimmed };
  }
  return { project_url: trimmed, repository_url: null };
}

function certificationToRow(
  cvId: string,
  entry: CertificationEntry,
  sortOrder: number,
): TablesInsert<"certifications"> {
  const issueDate = parseOptionalDate(entry.date);
  let description: string | null = null;
  if (!issueDate && entry.date.trim()) {
    description = `[Date: ${entry.date.trim()}]`;
  }

  return {
    id: entry.id,
    cv_id: cvId,
    certification_name: entry.name,
    issuing_organization: entry.provider || null,
    issue_date: issueDate,
    verification_url: entry.credentialUrl || null,
    description,
    sort_order: sortOrder,
  };
}

export type CvPersistPayload = {
  cvUpdate: TablesInsert<"cvs">;
  personal: TablesInsert<"cv_personal_info">;
  summary: TablesInsert<"cv_summaries">;
  sections: TablesInsert<"cv_sections">[];
  experiences: TablesInsert<"work_experiences">[];
  bullets: TablesInsert<"experience_bullets">[];
  educations: TablesInsert<"educations">[];
  subjects: TablesInsert<"education_subjects">[];
  skills: TablesInsert<"skills">[];
  projects: TablesInsert<"projects">[];
  certifications: TablesInsert<"certifications">[];
  languages: TablesInsert<"languages">[];
  achievements: TablesInsert<"achievements">[];
  references: TablesInsert<"cv_references">[];
};

export function documentToPersistPayload(
  doc: CvDocument,
  userId: string,
  completion: number,
): CvPersistPayload {
  const cvUpdate: TablesInsert<"cvs"> = {
    id: doc.id,
    user_id: userId,
    title: doc.title,
    template_key: doc.rendererKey ?? doc.templateSlug ?? doc.templateId,
    completion,
    updated_at: new Date().toISOString(),
  };

  const syncedPersonal = syncPersonalLegacyFields(doc.personal);

  // Extended Personal Details fields. Persist when migration is applied;
  // repository falls back to legacy columns if the schema is older.
  const personal: TablesInsert<"cv_personal_info"> = {
    cv_id: doc.id,
    photo_url: syncedPersonal.photoUrl ?? null,
    given_name: syncedPersonal.givenName || null,
    family_name: syncedPersonal.familyName || null,
    full_name: syncedPersonal.fullName || null,
    professional_title: syncedPersonal.title || null,
    use_as_headline: syncedPersonal.useAsHeadline,
    email: syncedPersonal.email || null,
    phone: syncedPersonal.phone || null,
    address: syncedPersonal.address || null,
    post_code: syncedPersonal.postCode || null,
    city: syncedPersonal.city || null,
    location: syncedPersonal.location || null,
    drivers_license: syncedPersonal.driversLicense || null,
    linkedin: syncedPersonal.linkedin || null,
    portfolio: syncedPersonal.portfolio || null,
    social_links: syncedPersonal.socialLinks ?? [],
    date_of_birth: syncedPersonal.dateOfBirth || null,
    place_of_birth: syncedPersonal.placeOfBirth || null,
    gender: syncedPersonal.gender || null,
    nationality: syncedPersonal.nationality || null,
    civil_status: syncedPersonal.civilStatus || null,
    custom_fields: syncedPersonal.customFields,
    field_visibility: syncedPersonal.fieldVisibility,
  };

  const summary: TablesInsert<"cv_summaries"> = {
    cv_id: doc.id,
    content: doc.summary ?? "",
  };

  const sections: TablesInsert<"cv_sections">[] = doc.sections.map(
    (section, index) => ({
      id: section.id,
      cv_id: doc.id,
      section_type: section.type,
      title: section.label,
      sort_order: index,
      is_visible: section.visible,
      content: section.type === "custom" ? (section.content ?? "") : "",
    }),
  );

  const experiences = doc.experience.map((entry, index) =>
    experienceToRow(doc.id, entry, index),
  );
  const bullets = doc.experience.flatMap((entry) =>
    experienceBulletsToRows(entry),
  );

  const educations = doc.education.map((entry, index) =>
    educationToRow(doc.id, entry, index),
  );
  const subjects = doc.education.flatMap((entry) =>
    educationSubjectsToRows(entry),
  );

  const skills: TablesInsert<"skills">[] = doc.skills.map((skill, index) => ({
    id: skill.id,
    cv_id: doc.id,
    name: skill.name,
    category: toDbSkillCategory(skill.category),
    proficiency_level: skill.level ?? null,
    sort_order: index,
  }));

  const projects: TablesInsert<"projects">[] = doc.projects.map(
    (project, index) => {
      const urls = parseProjectUrls(project.link);
      return {
        id: project.id,
        cv_id: doc.id,
        project_name: project.name,
        description: project.description || null,
        technologies: project.technologies ?? [],
        project_url: urls.project_url,
        repository_url: urls.repository_url,
        image_url: project.imageUrl ?? null,
        sort_order: index,
      };
    },
  );

  const certifications = doc.certifications.map((entry, index) =>
    certificationToRow(doc.id, entry, index),
  );

  const languages: TablesInsert<"languages">[] = doc.languages.map(
    (lang, index) => ({
      id: lang.id,
      cv_id: doc.id,
      language: lang.name,
      proficiency: lang.proficiency || null,
      sort_order: index,
    }),
  );

  const achievements: TablesInsert<"achievements">[] = doc.achievements.map(
    (entry, index) => ({
      id: entry.id,
      cv_id: doc.id,
      title: entry.title,
      description: entry.description || null,
      achievement_date: null,
      sort_order: index,
    }),
  );

  const references: TablesInsert<"cv_references">[] = doc.references.map(
    (entry, index) => ({
      id: entry.id,
      cv_id: doc.id,
      name: entry.name,
      relationship: entry.relationship || null,
      contact: entry.contact || null,
      sort_order: index,
    }),
  );

  return {
    cvUpdate,
    personal,
    summary,
    sections,
    experiences,
    bullets,
    educations,
    subjects,
    skills,
    projects,
    certifications,
    languages,
    achievements,
    references,
  };
}
