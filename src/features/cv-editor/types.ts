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

export type ExperienceEntry = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
};

export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  achievements: string;
  description: string;
};

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
  atsCompatible: boolean;
  description: string;
};
