import type {
  CvDocument,
  CvVersion,
  EditorAiSuggestion,
  EditorTemplate,
} from "@/features/cv-editor/types";
import { normalizePersonalInfo } from "@/lib/cvs/personal-info";
import { normalizeTertiaryEntry } from "@/lib/cvs/education-dates";

export const editorTemplates: EditorTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean serifs and airy spacing for product roles.",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Structured columns suited to corporate applications.",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold hierarchy for senior leadership CVs.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Single-column layout with crisp density.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Editorial accent rules for design portfolios.",
  },
];

export const mockCvDocument: CvDocument = {
  id: "cv_1",
  title: "Senior Product Designer",
  templateId: "modern",
  updatedAt: "2026-08-05T14:00:00.000Z",
  personal: normalizePersonalInfo({
    fullName: "Kennedy Sithole",
    title: "Senior Product Designer",
    email: "kennedy.Sithole@email.com",
    phone: "+1 (415) 555-0182",
    location: "London, UK · Remote",
    linkedin: "linkedin.com/in/kennedySithole",
    portfolio: "kennedy.design",
    socialLinks: ["dribbble.com/kennedy"],
    fieldVisibility: {
      linkedin: true,
      website: true,
    },
  }),
  summary:
    "Product designer with 8 years of experience leading design for consumer apps. Responsible for onboarding flows and design systems work across cross-functional teams.",
  experience: [
    {
      id: "exp_ft",
      experienceType: "full-time",
      company: "Northline",
      position: "Senior Product Designer",
      location: "Remote · London",
      startMonth: "01",
      startYear: "2022",
      endMonth: "",
      endYear: "",
      current: true,
      responsibilities: [
        "Lead end-to-end product design for onboarding and activation.",
        "Partner with research and engineering on weekly delivery cadence.",
      ],
      skillsGained: ["Figma", "Design Systems", "Leadership"],
      achievements: [
        "Lifted mobile activation by 18% in two quarters.",
        "Owned design system tokens used across 6 product squads.",
      ],
    },
    {
      id: "exp_attach",
      experienceType: "industrial-attachment",
      company: "XYZ Bank",
      department: "Information Technology",
      role: "IT Support Attachment",
      location: "Harare",
      dateMode: "range",
      startMonth: "01",
      startYear: "2018",
      endMonth: "08",
      endYear: "2018",
      duration: "8 Months",
      current: false,
      responsibilities: [
        "Assisted in maintaining enterprise applications.",
        "Provided user support for over 150 staff members.",
      ],
      skillsGained: ["Customer Service", "Networking", "Microsoft Excel"],
      achievements: [
        "Developed an internal reporting dashboard used by branch ops.",
        "Improved ticket filing efficiency for the service desk.",
      ],
      supervisor: {
        name: "Tendai Moyo",
        position: "IT Operations Lead",
        email: "tendai.moyo@xyzbank.example",
        phone: "+263 77 000 0000",
      },
      includeSupervisorOnExport: false,
    },
    {
      id: "exp_intern",
      experienceType: "internship",
      company: "Ministry of ICT",
      department: "Digital Services",
      role: "Software Development Intern",
      location: "Harare",
      dateMode: "duration",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      duration: "3 Months",
      current: false,
      responsibilities: [
        "Supported maintenance of citizen-facing service portals.",
        "Documented API usage for internal developer guides.",
      ],
      skillsGained: ["Java", "Communication", "Problem Solving"],
      achievements: [
        "Automated a repetitive reporting task saving ~4 hours weekly.",
      ],
      supervisor: {
        name: "",
        position: "",
        email: "",
        phone: "",
      },
      includeSupervisorOnExport: false,
    },
    {
      id: "exp_grad",
      experienceType: "graduate-trainee",
      programmeName: "Technology Graduate Programme",
      department: "Product & Engineering",
      company: "Econet Wireless",
      rotationDetails:
        "Rotations through support, analytics, and frontend delivery squads.",
      location: "Harare",
      startMonth: "02",
      startYear: "2019",
      endMonth: "01",
      endYear: "2020",
      current: false,
      responsibilities: [
        "Joined sprint ceremonies and contributed UI fixes.",
        "Prepared stakeholder demos for rotation managers.",
      ],
      skillsGained: ["React", "Teamwork", "Leadership"],
      achievements: [
        "Shipped two internal tools adopted by customer care teams.",
      ],
    },
    {
      id: "exp_vol",
      experienceType: "volunteer",
      organization: "Code for Community Zimbabwe",
      role: "Workshop Facilitator",
      cause: "Digital literacy for secondary students",
      impact: "Supported weekend coding clubs across three schools.",
      location: "Bulawayo",
      startMonth: "06",
      startYear: "2020",
      endMonth: "12",
      endYear: "2021",
      current: false,
      responsibilities: [
        "Ran intro-to-web sessions for groups of 20–30 learners.",
      ],
      achievements: [
        "Mentored 40+ students through a first portfolio project.",
      ],
    },
    {
      id: "exp_free",
      experienceType: "freelance",
      clientName: "Local Retail Co-op",
      projectName: "Inventory dashboard",
      technologies: ["React", "Python", "Excel"],
      duration: "6 Months",
      dateMode: "duration",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      achievements: [
        "Delivered a stock visibility dashboard used by 12 stores.",
        "Reduced stock-count time by ~30% via clearer workflows.",
      ],
      portfolioLink: "kennedy.design/inventory",
    },
  ],
  education: [
    {
      id: "edu_olevel",
      qualificationType: "o-level",
      examinationBoard: "zimsec",
      examinationBoardOther: "",
      schoolName: "ABC High School",
      yearCompleted: "2014",
      candidateNumber: "ZIM2014-88421",
      subjects: [
        { id: "subj_1", name: "English Language", grade: "A" },
        { id: "subj_2", name: "Mathematics", grade: "B" },
        { id: "subj_3", name: "Combined Science", grade: "A" },
        { id: "subj_4", name: "History", grade: "C" },
        { id: "subj_5", name: "Geography", grade: "B" },
        { id: "subj_6", name: "Commerce", grade: "A" },
        { id: "subj_7", name: "Shona", grade: "B" },
        { id: "subj_8", name: "Integrated Science", grade: "A" },
      ],
    },
    {
      id: "edu_alevel",
      qualificationType: "a-level",
      examinationBoard: "zimsec",
      examinationBoardOther: "",
      schoolName: "XYZ High School",
      yearCompleted: "2016",
      candidateNumber: "",
      subjects: [
        { id: "subj_a1", name: "Mathematics", grade: "A" },
        { id: "subj_a2", name: "Computer Science", grade: "B" },
        { id: "subj_a3", name: "Physics", grade: "A" },
        { id: "subj_a4", name: "Business Studies", grade: "C" },
      ],
    },
    {
      id: "edu_cert",
      qualificationType: "certificate",
      certificateName: "National Certificate in IT Support",
      institution: "Harare Polytechnic",
      year: "2017",
      credentialNumber: "NC-IT-7721",
      description: "Foundations in hardware, networking, and desktop support.",
    },
    normalizeTertiaryEntry({
      id: "edu_diploma",
      qualificationType: "diploma",
      institution: "Harare Polytechnic",
      city: "Harare",
      qualification: "National Diploma",
      field: "Information Technology",
      startDate: "2017-01-01",
      endDate: "2019-01-01",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      current: false,
      grade: "Merit",
      achievements: "Final year project distinction",
      description: "Systems analysis, databases, and software development.",
    }),
    normalizeTertiaryEntry({
      id: "edu_degree",
      qualificationType: "masters",
      institution: "Royal College of Art",
      city: "London",
      qualification: "MA",
      field: "Service Design",
      startDate: "2017-09-01",
      endDate: "2019-06-01",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      current: false,
      grade: "Distinction",
      achievements: "Thesis on activation loops",
      description: "Focus on service ecosystems and participatory research.",
    }),
    {
      id: "edu_pro",
      qualificationType: "professional",
      certificationName: "AWS Certified Cloud Practitioner",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023-04",
      expiryDate: "2026-04",
      credentialId: "AWS-CCP-99102",
      verificationUrl: "https://aws.amazon.com/verification",
    },
    {
      id: "edu_voc",
      qualificationType: "vocational",
      trainingProvider: "Industrial Training Centre, Harare",
      programmeName: "Software Support Technician",
      duration: "6 months",
      completionDate: "2016",
      skillsAcquired: "Helpdesk workflows, hardware diagnostics, ticketing systems",
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
    targetPath: "experience.0.responsibilities.0",
  },
  skills_gap: {
    id: "sug_skills",
    sectionId: "sec_skills",
    sectionType: "skills",
    action: "Recommend",
    original: "",
    suggestion: "Add “Stakeholder workshops” and “A/B testing” — both appear in target fintech roles.",
    explanation:
      "These skills appear often in senior product design postings for your target companies.",
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
