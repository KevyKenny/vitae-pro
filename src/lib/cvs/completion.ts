import type { CvDocument, CvSectionMeta, ExperienceEntry } from "@/features/cv-editor/types";

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function hasContact(personal: CvDocument["personal"]): boolean {
  return hasText(personal.email) || hasText(personal.phone);
}

function countMeaningfulBullets(items: string[]): number {
  return items.filter((item) => hasText(item)).length;
}

function sectionScore(
  filled: number,
  target: number,
  weight: number,
): number {
  if (target <= 0) return 0;
  return Math.min(weight, (filled / target) * weight);
}

function experienceEntryCompletion(entry: ExperienceEntry): number {
  const hasRole =
    "position" in entry
      ? hasText(entry.position)
      : "role" in entry
        ? hasText(entry.role)
        : "programmeName" in entry
          ? hasText(entry.programmeName)
          : "clientName" in entry
            ? hasText(entry.clientName)
            : "projectName" in entry
              ? hasText(entry.projectName)
              : false;

  const hasOrg =
    "company" in entry
      ? hasText(entry.company)
      : "organization" in entry
        ? hasText(entry.organization)
        : false;

  const bullets =
    "responsibilities" in entry
      ? countMeaningfulBullets(entry.responsibilities)
      : "achievements" in entry && !("responsibilities" in entry)
        ? countMeaningfulBullets(entry.achievements)
        : 0;

  let score = 0;
  if (hasRole) score += 40;
  if (hasOrg) score += 30;
  if (bullets >= 2) score += 30;
  else if (bullets >= 1) score += 15;

  return Math.min(100, score);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/** Returns 0–100 completion for a single CV section. */
export function calculateSectionCompletion(
  doc: CvDocument,
  section: CvSectionMeta,
): number {
  switch (section.type) {
    case "personal": {
      const checks = [
        hasText(doc.personal.fullName),
        hasText(doc.personal.title),
        hasContact(doc.personal),
        hasText(doc.personal.city) ||
          hasText(doc.personal.address) ||
          hasText(doc.personal.location),
        hasText(doc.personal.linkedin) || hasText(doc.personal.portfolio),
      ];
      const filled = checks.filter(Boolean).length;
      return Math.round((filled / checks.length) * 100);
    }
    case "summary": {
      const len = doc.summary.trim().length;
      if (len >= 120) return 100;
      if (len >= 60) return 70;
      if (len > 0) return 35;
      return 0;
    }
    case "experience": {
      if (doc.experience.length === 0) return 0;
      return average(doc.experience.map(experienceEntryCompletion));
    }
    case "education": {
      if (doc.education.length === 0) return 0;
      const scores = doc.education.map((entry) => {
        let score = 0;
        if ("institution" in entry && hasText(entry.institution)) score += 40;
        if ("schoolName" in entry && hasText(entry.schoolName)) score += 40;
        if ("degree" in entry && hasText(entry.degree)) score += 30;
        if ("qualificationType" in entry) score += 30;
        if ("subjects" in entry && entry.subjects.some((s) => hasText(s.name))) {
          score += 30;
        }
        return Math.min(100, score || 25);
      });
      return average(scores);
    }
    case "skills": {
      const named = doc.skills.filter((skill) => hasText(skill.name)).length;
      if (named === 0) return 0;
      return Math.min(100, Math.round((named / 3) * 100));
    }
    case "projects": {
      if (doc.projects.length === 0) return 0;
      const scores = doc.projects.map((project) => {
        let score = 0;
        if (hasText(project.name)) score += 35;
        if (hasText(project.description)) score += 25;
        if (project.technologies.some((tech) => hasText(tech))) score += 25;
        if (hasText(project.link)) score += 15;
        return score;
      });
      return average(scores);
    }
    case "certifications": {
      if (doc.certifications.length === 0) return 0;
      const scores = doc.certifications.map((cert) => {
        let score = 0;
        if (hasText(cert.name)) score += 40;
        if (hasText(cert.provider)) score += 25;
        if (hasText(cert.date)) score += 20;
        if (hasText(cert.credentialUrl)) score += 15;
        return score;
      });
      return average(scores);
    }
    case "languages": {
      if (doc.languages.length === 0) return 0;
      const scores = doc.languages.map((lang) => {
        let score = 0;
        if (hasText(lang.name)) score += 60;
        if (hasText(lang.proficiency)) score += 40;
        return score;
      });
      return average(scores);
    }
    case "achievements": {
      if (doc.achievements.length === 0) return 0;
      const scores = doc.achievements.map((item) => {
        let score = 0;
        if (hasText(item.title)) score += 60;
        if (hasText(item.description)) score += 40;
        return score;
      });
      return average(scores);
    }
    case "references": {
      if (doc.references.length === 0) return 0;
      const scores = doc.references.map((ref) => {
        let score = 0;
        if (hasText(ref.name)) score += 50;
        if (hasText(ref.relationship)) score += 25;
        if (hasText(ref.contact)) score += 25;
        return score;
      });
      return average(scores);
    }
    case "custom": {
      const text = section.content?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ?? "";
      if (text.length >= 80) return 100;
      if (text.length >= 30) return 65;
      if (text.length > 0) return 30;
      return 0;
    }
    default:
      return 0;
  }
}

export function applySectionCompletions(doc: CvDocument): CvDocument {
  return {
    ...doc,
    sections: doc.sections.map((section) => ({
      ...section,
      completion: calculateSectionCompletion(doc, section),
    })),
  };
}

/** Returns 0–100 based on meaningful CV content across core sections. */
export function calculateCvCompletion(doc: CvDocument): number {
  let score = 0;

  // Personal (20): name, title, and at least one contact method
  let personalFilled = 0;
  if (hasText(doc.personal.fullName)) personalFilled += 1;
  if (hasText(doc.personal.title)) personalFilled += 1;
  if (hasContact(doc.personal)) personalFilled += 1;
  score += sectionScore(personalFilled, 3, 20);

  // Summary (15): meaningful paragraph
  const summaryLen = doc.summary.trim().length;
  if (summaryLen >= 120) score += 15;
  else if (summaryLen >= 60) score += 10;
  else if (summaryLen > 0) score += 5;

  // Experience (25): at least one entry with role/company and bullets
  if (doc.experience.length > 0) {
    const richEntries = doc.experience.filter((entry) => {
      const hasRole =
        "position" in entry
          ? hasText(entry.position)
          : "role" in entry
            ? hasText(entry.role)
            : "programmeName" in entry
              ? hasText(entry.programmeName)
              : "clientName" in entry
                ? hasText(entry.clientName)
                : false;
      const hasOrg =
        "company" in entry
          ? hasText(entry.company)
          : "organization" in entry
            ? hasText(entry.organization)
            : false;
      const bullets =
        "responsibilities" in entry
          ? countMeaningfulBullets(entry.responsibilities)
          : "achievements" in entry && !("responsibilities" in entry)
            ? countMeaningfulBullets(entry.achievements)
            : 0;
      return (hasRole || hasOrg) && bullets > 0;
    }).length;
    score += sectionScore(richEntries, 1, 25);
  }

  // Education (15): at least one qualification
  if (doc.education.length > 0) score += 15;

  // Skills (10): at least three named skills
  const namedSkills = doc.skills.filter((s) => hasText(s.name)).length;
  score += sectionScore(namedSkills, 3, 10);

  // Optional sections (15 total)
  if (doc.projects.some((p) => hasText(p.name))) score += 4;
  if (doc.certifications.some((c) => hasText(c.name))) score += 3;
  if (doc.languages.some((l) => hasText(l.name))) score += 3;
  if (doc.achievements.some((a) => hasText(a.title))) score += 3;
  if (doc.references.some((r) => hasText(r.name))) score += 2;

  return Math.min(100, Math.round(score));
}
