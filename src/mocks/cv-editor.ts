import type {
  CvDocument,
  CvVersion,
  EditorAiSuggestion,
  EditorTemplate,
} from "@/features/cv-editor/types";

export const editorTemplates: EditorTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    atsCompatible: true,
    description: "Clean serifs and airy spacing for product roles.",
  },
  {
    id: "professional",
    name: "Professional",
    atsCompatible: true,
    description: "Structured columns suited to corporate applications.",
  },
  {
    id: "executive",
    name: "Executive",
    atsCompatible: true,
    description: "Bold hierarchy for senior leadership CVs.",
  },
  {
    id: "minimal",
    name: "Minimal",
    atsCompatible: true,
    description: "Single-column ATS-safe layout with crisp density.",
  },
  {
    id: "creative",
    name: "Creative",
    atsCompatible: false,
    description: "Editorial accent rules for design portfolios.",
  },
];

export const mockCvDocument: CvDocument = {
  id: "cv_1",
  title: "Senior Product Designer",
  templateId: "modern",
  updatedAt: "2026-08-05T14:00:00.000Z",
  personal: {
    fullName: "Kennedy Sithole",
    title: "Senior Product Designer",
    email: "kennedy.Sithole@email.com",
    phone: "+1 (415) 555-0182",
    location: "London, UK · Remote",
    linkedin: "linkedin.com/in/kennedySithole",
    portfolio: "kennedy.design",
    socialLinks: ["dribbble.com/kennedy"],
  },
  summary:
    "Product designer with 8 years of experience leading design for consumer apps. Responsible for onboarding flows and design systems work across cross-functional teams.",
  experience: [
    {
      id: "exp_1",
      company: "Northline",
      position: "Senior Product Designer",
      startDate: "2022-01",
      endDate: "",
      current: true,
      location: "Remote · London",
      bullets: [
        "Responsible for redesigning the onboarding flow for the mobile app.",
        "Owned design system tokens used across 6 product squads.",
        "Partnered with research to run 24 interviews informing roadmap bets.",
      ],
    },
    {
      id: "exp_2",
      company: "Ledger Labs",
      position: "Product Designer",
      startDate: "2019-06",
      endDate: "2021-12",
      current: false,
      location: "Berlin",
      bullets: [
        "Designed mobile trading flows used by 140k monthly active users.",
        "Reduced support tickets related to KYC by 22% via clearer states.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      institution: "Royal College of Art",
      degree: "MA",
      field: "Service Design",
      startDate: "2017",
      endDate: "2019",
      achievements: "Distinction · Thesis on activation loops",
      description: "Focus on service ecosystems and participatory research.",
    },
  ],
  skills: [
    { id: "sk_1", name: "Product Design", category: "technical", level: 5 },
    { id: "sk_2", name: "Design Systems", category: "technical", level: 5 },
    { id: "sk_3", name: "User Research", category: "technical", level: 4 },
    { id: "sk_4", name: "Figma", category: "tools", level: 5 },
    { id: "sk_5", name: "Workshop Facilitation", category: "soft", level: 4 },
    { id: "sk_6", name: "Prototyping", category: "frameworks", level: 4 },
  ],
  projects: [
    {
      id: "pr_1",
      name: "Northline Activation Suite",
      description:
        "End-to-end redesign of signup and first-week rituals for a multi-product fintech.",
      technologies: ["Figma", "FigJam", "Amplitude"],
      link: "kennedy.design/northline",
    },
  ],
  certifications: [
    {
      id: "cert_1",
      name: "NN/g UX Certification",
      provider: "Nielsen Norman Group",
      date: "2021-05",
      credentialUrl: "https://www.nngroup.com",
    },
  ],
  languages: [
    { id: "lang_1", name: "English", proficiency: "Native" },
    { id: "lang_2", name: "French", proficiency: "Professional" },
  ],
  achievements: [
    {
      id: "ach_1",
      title: "Design Systems Guild Lead",
      description: "Led cross-org guild of 40 designers for two years.",
    },
  ],
  references: [
    {
      id: "ref_1",
      name: "Available upon request",
      relationship: "",
      contact: "",
    },
  ],
  sections: [
    { id: "sec_personal", type: "personal", label: "Personal Information", visible: true, completion: 90 },
    { id: "sec_summary", type: "summary", label: "Professional Summary", visible: true, completion: 70 },
    { id: "sec_experience", type: "experience", label: "Work Experience", visible: true, completion: 85 },
    { id: "sec_education", type: "education", label: "Education", visible: true, completion: 95 },
    { id: "sec_skills", type: "skills", label: "Skills", visible: true, completion: 80 },
    { id: "sec_projects", type: "projects", label: "Projects", visible: true, completion: 60 },
    { id: "sec_certifications", type: "certifications", label: "Certifications", visible: true, completion: 100 },
    { id: "sec_languages", type: "languages", label: "Languages", visible: true, completion: 100 },
    { id: "sec_achievements", type: "achievements", label: "Achievements", visible: false, completion: 40 },
    { id: "sec_references", type: "references", label: "References", visible: true, completion: 50 },
  ],
};

export const mockCvVersions: CvVersion[] = [
  {
    id: "v_4",
    label: "Current draft",
    createdAt: "2026-08-05T14:00:00.000Z",
    note: "Summary AI polish pending",
  },
  {
    id: "v_3",
    label: "Today, 11:20",
    createdAt: "2026-08-05T11:20:00.000Z",
    note: "Added Northline activation bullet",
  },
  {
    id: "v_2",
    label: "Yesterday",
    createdAt: "2026-08-04T16:40:00.000Z",
    note: "Switched to Modern template",
  },
  {
    id: "v_1",
    label: "Last week",
    createdAt: "2026-07-29T09:10:00.000Z",
    note: "Imported from Meridian export",
  },
];

export const mockEditorSuggestions: Record<string, EditorAiSuggestion> = {
  summary_improve: {
    id: "sug_summary",
    sectionId: "sec_summary",
    sectionType: "summary",
    action: "Improve",
    original:
      "Product designer with 8 years of experience leading design for consumer apps. Responsible for onboarding flows and design systems work across cross-functional teams.",
    suggestion:
      "Product designer with 8 years leading onboarding and design-systems work for consumer apps used by 2M+ people — most recently lifting activation 34% at Northline.",
    explanation:
      "Opens with scope (2M+ users), closes with a quantified result, and cuts passive phrasing like “responsible for.”",
    confidence: 0.91,
  },
  bullet_rewrite: {
    id: "sug_bullet",
    sectionId: "sec_experience",
    sectionType: "experience",
    action: "Rewrite",
    original: "Responsible for redesigning the onboarding flow for the mobile app.",
    suggestion:
      "Developed and optimized responsive onboarding, improving activation by 35% within two quarters.",
    explanation:
      "Replaces vague ownership with a measurable outcome recruiters can scan in seconds.",
    confidence: 0.88,
    targetPath: "experience.0.bullets.0",
  },
  skills_gap: {
    id: "sug_skills",
    sectionId: "sec_skills",
    sectionType: "skills",
    action: "Recommend",
    original: "",
    suggestion: "Add “Stakeholder workshops” and “A/B testing” — both appear in target fintech roles.",
    explanation:
      "Keyword coverage improves ATS match for senior product design postings.",
    confidence: 0.84,
  },
};

export function getMockDocumentById(id: string): CvDocument {
  return {
    ...mockCvDocument,
    id,
    title:
      id === "cv_2"
        ? "Product Designer — Fintech"
        : id === "cv_3"
          ? "Design Systems Lead"
          : mockCvDocument.title,
  };
}
