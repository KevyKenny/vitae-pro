import type {
  CvDocument,
  CvSectionMeta,
  CvSectionType,
  EditorTemplateId,
  PersonalInfo,
} from "@/features/cv-editor/types";
import type { Profile } from "@/lib/database/types";
import { profileDisplayName } from "@/lib/auth/names";
import { normalizePersonalInfo } from "@/lib/cvs/personal-info";

export const DEFAULT_SECTION_DEFS: ReadonlyArray<{
  type: CvSectionType;
  title: string;
}> = [
  { type: "personal", title: "Personal Information" },
  { type: "summary", title: "Professional Summary" },
  { type: "experience", title: "Work Experience" },
  { type: "education", title: "Education" },
  { type: "skills", title: "Skills" },
  { type: "projects", title: "Projects" },
  { type: "certifications", title: "Certifications" },
  { type: "languages", title: "Languages" },
  { type: "achievements", title: "Achievements" },
  { type: "references", title: "References" },
];

const TEMPLATE_LABELS: Record<EditorTemplateId, string> = {
  modern: "Modern",
  professional: "Professional",
  executive: "Executive",
  minimal: "Minimal",
  creative: "Creative",
};

export function editorTemplateLabel(key: EditorTemplateId): string {
  return TEMPLATE_LABELS[key] ?? "Modern";
}

export function buildEmptyPersonalFromProfile(
  profile: Profile | null,
  email?: string | null,
): PersonalInfo {
  const fullName = profileDisplayName(profile, email);
  const socialLinks: string[] = [];
  if (profile?.github_url?.trim()) socialLinks.push(profile.github_url.trim());
  if (profile?.website_url?.trim()) socialLinks.push(profile.website_url.trim());

  return normalizePersonalInfo({
    photoUrl: profile?.photo_url ?? undefined,
    givenName: profile?.first_name?.trim() ?? "",
    familyName: profile?.last_name?.trim() ?? "",
    fullName,
    title: profile?.professional_title?.trim() ?? "",
    useAsHeadline: true,
    email: profile?.email?.trim() ?? email?.trim() ?? "",
    phone: profile?.phone?.trim() ?? "",
    address: profile?.location?.trim() ?? "",
    city: profile?.country?.trim() ?? "",
    linkedin: profile?.linkedin_url?.trim() ?? "",
    portfolio: profile?.portfolio_url?.trim() ?? "",
    socialLinks,
    fieldVisibility: {
      website: true,
      linkedin: true,
      driversLicense: true,
    },
  });
}

export function buildDefaultSections(): CvSectionMeta[] {
  return DEFAULT_SECTION_DEFS.map(({ type, title }) => ({
    id: crypto.randomUUID(),
    type,
    label: title,
    visible: true,
    completion: 0,
    ...(type === "custom" ? { content: "" } : {}),
  }));
}

/** Rebuild the section rail when a CV was persisted without cv_sections rows. */
export function ensureDocumentSections(doc: CvDocument): CvDocument {
  if (Array.isArray(doc.sections) && doc.sections.length > 0) {
    return doc;
  }
  return {
    ...doc,
    sections: buildDefaultSections(),
  };
}

export function newEmptyDocument(
  partial: Partial<CvDocument> & Pick<CvDocument, "id">,
): CvDocument {
  const now = new Date().toISOString();
  return {
    id: partial.id,
    title: partial.title ?? "My Professional CV",
    templateId: partial.templateId ?? "modern",
    personal: partial.personal ?? buildEmptyPersonalFromProfile(null),
    summary: partial.summary ?? "",
    experience: partial.experience ?? [],
    education: partial.education ?? [],
    skills: partial.skills ?? [],
    projects: partial.projects ?? [],
    certifications: partial.certifications ?? [],
    languages: partial.languages ?? [],
    achievements: partial.achievements ?? [],
    references: partial.references ?? [],
    sections: partial.sections ?? buildDefaultSections(),
    updatedAt: partial.updatedAt ?? now,
  };
}
