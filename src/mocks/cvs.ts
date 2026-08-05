import type { CV, Skill, WorkExperience, Education } from "@/types";

export const mockSkills: Skill[] = [
  { id: "sk_1", name: "Product Design", level: "expert" },
  { id: "sk_2", name: "Design Systems", level: "advanced" },
  { id: "sk_3", name: "User Research", level: "advanced" },
  { id: "sk_4", name: "Figma", level: "expert" },
  { id: "sk_5", name: "Prototyping", level: "advanced" },
  { id: "sk_6", name: "Workshop Facilitation", level: "intermediate" },
];

export const mockExperience: WorkExperience[] = [
  {
    id: "exp_1",
    company: "Northline",
    role: "Senior Product Designer",
    location: "Remote · London",
    startDate: "2022-03",
    current: true,
    endDate: null,
    bullets: [
      "Led redesign of onboarding, lifting activation by 18% in two quarters.",
      "Owned design system tokens used across 6 product squads.",
      "Partnered with research to run 24 interviews informing roadmap bets.",
    ],
  },
  {
    id: "exp_2",
    company: "Ledger Labs",
    role: "Product Designer",
    location: "Berlin",
    startDate: "2019-06",
    endDate: "2022-02",
    bullets: [
      "Designed mobile trading flows used by 140k monthly active users.",
      "Reduced support tickets related to KYC by 22% via clearer states.",
    ],
  },
];

export const mockEducation: Education[] = [
  {
    id: "edu_1",
    institution: "Royal College of Art",
    degree: "MA",
    field: "Service Design",
    startDate: "2017",
    endDate: "2019",
  },
  {
    id: "edu_2",
    institution: "University of Lagos",
    degree: "BSc",
    field: "Computer Science",
    startDate: "2012",
    endDate: "2016",
  },
];

export const mockCVs: CV[] = [
  {
    id: "cv_1",
    title: "Senior Product Designer",
    templateId: "tpl_meridian",
    templateName: "Meridian",
    score: 92,
    atsScore: 94,
    completion: 96,
    updatedAt: "2026-08-05T14:00:00.000Z",
    status: "complete",
  },
  {
    id: "cv_2",
    title: "Product Designer — Fintech",
    templateId: "tpl_ledger",
    templateName: "Ledger",
    score: 88,
    atsScore: 91,
    completion: 84,
    updatedAt: "2026-08-04T10:30:00.000Z",
    status: "draft",
  },
  {
    id: "cv_3",
    title: "Design Systems Lead",
    templateId: "tpl_atelier",
    templateName: "Atelier",
    score: 81,
    atsScore: 86,
    completion: 72,
    updatedAt: "2026-07-28T16:45:00.000Z",
    status: "draft",
  },
  {
    id: "cv_4",
    title: "UX Lead — Healthtech",
    templateId: "tpl_folio",
    templateName: "Folio",
    score: 79,
    atsScore: 83,
    completion: 68,
    updatedAt: "2026-07-22T09:15:00.000Z",
    status: "draft",
  },
  {
    id: "cv_5",
    title: "Product Designer — B2B SaaS",
    templateId: "tpl_signal",
    templateName: "Signal",
    score: 86,
    atsScore: 89,
    completion: 90,
    updatedAt: "2026-07-18T19:40:00.000Z",
    status: "complete",
  },
  {
    id: "cv_6",
    title: "Career Pivot — Consulting",
    templateId: "tpl_meridian",
    templateName: "Meridian",
    score: 74,
    atsScore: 78,
    completion: 55,
    updatedAt: "2026-07-10T11:05:00.000Z",
    status: "draft",
  },
];
