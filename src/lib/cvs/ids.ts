import type { CvDocument } from "@/features/cv-editor/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

export function ensureUuid(id: string): string {
  return isUuid(id) ? id : crypto.randomUUID();
}

/** Ensure all entity ids are UUIDs, preserving stable remaps within one call. */
export function remapDocumentIds(doc: CvDocument): CvDocument {
  const idMap = new Map<string, string>();

  const remap = (id: string): string => {
    const existing = idMap.get(id);
    if (existing) return existing;
    const next = ensureUuid(id);
    idMap.set(id, next);
    return next;
  };

  return {
    ...doc,
    id: remap(doc.id),
    sections: (doc.sections ?? []).map((section) => ({
      ...section,
      id: remap(section.id),
    })),
    experience: (doc.experience ?? []).map((entry) => ({
      ...entry,
      id: remap(entry.id),
    })),
    education: (doc.education ?? []).map((entry) => {
      if ("subjects" in entry) {
        return {
          ...entry,
          id: remap(entry.id),
          subjects: (entry.subjects ?? []).map((subject) => ({
            ...subject,
            id: remap(subject.id),
          })),
        };
      }
      return { ...entry, id: remap(entry.id) };
    }),
    skills: (doc.skills ?? []).map((skill) => ({ ...skill, id: remap(skill.id) })),
    projects: (doc.projects ?? []).map((project) => ({
      ...project,
      id: remap(project.id),
    })),
    certifications: (doc.certifications ?? []).map((cert) => ({
      ...cert,
      id: remap(cert.id),
    })),
    languages: (doc.languages ?? []).map((lang) => ({
      ...lang,
      id: remap(lang.id),
    })),
    achievements: (doc.achievements ?? []).map((achievement) => ({
      ...achievement,
      id: remap(achievement.id),
    })),
    references: (doc.references ?? []).map((reference) => ({
      ...reference,
      id: remap(reference.id),
    })),
  };
}
