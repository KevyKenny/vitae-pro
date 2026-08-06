export type CvSectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "achievements"
  | "references"
  | "custom";

export type SaveStatus = "saved" | "saving" | "unsaved" | "failed";

export type EditorTemplateId =
  | "modern"
  | "professional"
  | "executive"
  | "minimal"
  | "creative";

export type PersonalInfo = {
  photoUrl?: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  socialLinks: string[];
};

export type EducationQualificationType =
  | "o-level"
  | "a-level"
  | "certificate"
  | "diploma"
  | "hnd"
  | "bachelors"
  | "honours"
  | "masters"
  | "doctorate"
  | "professional"
  | "short-course"
  | "apprenticeship"
  | "vocational"
  | "other";

export type ExamBoardId = "zimsec" | "cambridge" | "other";

export type SubjectGrade = {
  id: string;
  name: string;
  grade: string;
};

type EducationBase = {
  id: string;
};

export type ExamSubjectsEducation = EducationBase & {
  qualificationType: "o-level" | "a-level";
  examinationBoard: ExamBoardId;
  examinationBoardOther: string;
  schoolName: string;
  yearCompleted: string;
  candidateNumber: string;
  subjects: SubjectGrade[];
};

export type TertiaryEducation = EducationBase & {
  qualificationType:
    | "diploma"
    | "hnd"
    | "bachelors"
    | "honours"
    | "masters"
    | "doctorate"
    | "other";
  institution: string;
  qualification: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  achievements: string;
  description: string;
};

export type CertificateEducation = EducationBase & {
  qualificationType: "certificate";
  certificateName: string;
  institution: string;
  year: string;
  credentialNumber: string;
  description: string;
};

export type ProfessionalEducation = EducationBase & {
  qualificationType: "professional";
  certificationName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  verificationUrl: string;
};

export type VocationalEducation = EducationBase & {
  qualificationType: "vocational" | "short-course" | "apprenticeship";
  trainingProvider: string;
  programmeName: string;
  duration: string;
  completionDate: string;
  skillsAcquired: string;
};

export type EducationEntry =
  | ExamSubjectsEducation
  | TertiaryEducation
  | CertificateEducation
  | ProfessionalEducation
  | VocationalEducation;

export type ExperienceTypeId =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "industrial-attachment"
  | "graduate-trainee"
  | "apprenticeship"
  | "freelance"
  | "volunteer"
  | "consulting"
  | "self-employed"
  | "temporary"
  | "other";

export type ExperienceDateMode = "range" | "duration";

export type SupervisorReference = {
  name: string;
  position: string;
  email: string;
  phone: string;
};

type ExperienceBase = {
  id: string;
};

export type EmploymentExperience = ExperienceBase & {
  experienceType:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "consulting"
    | "self-employed"
    | "apprenticeship"
    | "other";
  company: string;
  position: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  responsibilities: string[];
  skillsGained: string[];
  achievements: string[];
};

export type AttachmentExperience = ExperienceBase & {
  experienceType: "industrial-attachment" | "internship";
  company: string;
  department: string;
  role: string;
  location: string;
  dateMode: ExperienceDateMode;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  duration: string;
  current: boolean;
  responsibilities: string[];
  skillsGained: string[];
  achievements: string[];
  supervisor: SupervisorReference;
  includeSupervisorOnExport: boolean;
};

export type GraduateTraineeExperience = ExperienceBase & {
  experienceType: "graduate-trainee";
  programmeName: string;
  department: string;
  company: string;
  rotationDetails: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  responsibilities: string[];
  skillsGained: string[];
  achievements: string[];
};

export type VolunteerExperience = ExperienceBase & {
  experienceType: "volunteer";
  organization: string;
  role: string;
  cause: string;
  impact: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
};

export type FreelanceExperience = ExperienceBase & {
  experienceType: "freelance";
  clientName: string;
  projectName: string;
  technologies: string[];
  duration: string;
  dateMode: ExperienceDateMode;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  achievements: string[];
  portfolioLink: string;
};

export type ExperienceEntry =
  | EmploymentExperience
  | AttachmentExperience
  | GraduateTraineeExperience
  | VolunteerExperience
  | FreelanceExperience;

export type SkillCategory =
  | "technical"
  | "soft"
  | "tools"
  | "languages"
  | "frameworks";

export type SkillEntry = {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
};

export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  imageUrl?: string;
};

export type CertificationEntry = {
  id: string;
  name: string;
  provider: string;
  date: string;
  credentialUrl: string;
};

export type LanguageEntry = {
  id: string;
  name: string;
  proficiency: string;
};

export type AchievementEntry = {
  id: string;
  title: string;
  description: string;
};

export type ReferenceEntry = {
  id: string;
  name: string;
  relationship: string;
  contact: string;
};

export type CvSectionMeta = {
  id: string;
  type: CvSectionType;
  label: string;
  visible: boolean;
  completion: number;
};

export type CvDocument = {
  id: string;
  title: string;
  templateId: EditorTemplateId;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  achievements: AchievementEntry[];
  references: ReferenceEntry[];
  sections: CvSectionMeta[];
  updatedAt: string;
};

export type EditorAiSuggestion = {
  id: string;
  sectionId: string;
  sectionType: CvSectionType;
  action: string;
  original: string;
  suggestion: string;
  explanation: string;
  confidence: number;
  targetPath?: string;
};

export type CvVersion = {
  id: string;
  label: string;
  createdAt: string;
  note: string;
};

export type EditorTemplate = {
  id: EditorTemplateId;
  name: string;
  description: string;
};
