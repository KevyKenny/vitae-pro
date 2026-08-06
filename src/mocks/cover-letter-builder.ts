import type {
  CoverLetterDocument,
  CoverLetterSuggestion,
  GenerationStep,
  JobAnalysis,
  JobInfo,
  LetterAiSuggestion,
  LetterTemplate,
  SavedCoverLetterSummary,
} from "@/features/cover-letter/types";

export const letterTemplates: LetterTemplate[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Classic serif header with balanced whitespace for senior roles.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean Inter body and emerald accent rules for product roles.",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold hierarchy suited to leadership and director applications.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Single-column layout with crisp density.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Editorial accents for design and brand storytelling.",
  },
];

export const toneOptions = [
  {
    id: "professional" as const,
    label: "Professional",
    description: "Polished and respectful for corporate teams.",
    example: "I am writing to express my interest in…",
    icon: "Briefcase",
  },
  {
    id: "confident" as const,
    label: "Confident",
    description: "Assertive ownership of measurable impact.",
    example: "I led the redesign that lifted activation by 18%.",
    icon: "Zap",
  },
  {
    id: "friendly" as const,
    label: "Friendly",
    description: "Warm without losing credibility.",
    example: "I'd love to bring that energy to your product team.",
    icon: "Heart",
  },
  {
    id: "executive" as const,
    label: "Executive",
    description: "Strategic framing for senior stakeholders.",
    example: "I partner with leadership to turn ambiguous bets into roadmaps.",
    icon: "Crown",
  },
  {
    id: "creative" as const,
    label: "Creative",
    description: "Distinct voice for design-forward brands.",
    example: "I craft systems that make complex journeys feel inevitable.",
    icon: "Palette",
  },
  {
    id: "technical" as const,
    label: "Technical",
    description: "Precise language for engineering-adjacent roles.",
    example: "I ship design systems with documented tokens and accessibility.",
    icon: "Code2",
  },
];

export const lengthOptions = [
  {
    id: "short" as const,
    label: "Short",
    words: "~180 words",
    description: "Tight opener and one proof point.",
  },
  {
    id: "medium" as const,
    label: "Medium",
    words: "~280 words",
    description: "Balanced narrative most recruiters expect.",
  },
  {
    id: "detailed" as const,
    label: "Detailed",
    words: "~380 words",
    description: "Deeper achievements and role mapping.",
  },
];

export const generationSteps: GenerationStep[] = [
  { id: "analyze", label: "Analyzing job description" },
  { id: "match", label: "Matching your experience" },
  { id: "select", label: "Selecting achievements" },
  { id: "write", label: "Writing cover letter" },
  { id: "optimize", label: "Optimizing language" },
];

export const mockJobDescription = `We're looking for a Senior Product Designer to lead onboarding and growth surfaces, partnering closely with PM and engineering to ship end-to-end experiences for 2M+ users.

You'll own discovery through delivery, facilitate cross-functional workshops, strengthen our design system, and mentor designers. Experience with SaaS activation metrics, Figma systems, and accessibility is required. We value clarity, craft, and collaboration.`;

export const mockJobAnalysis: JobAnalysis = {
  skills: [
    "Product design",
    "Design systems",
    "Facilitation",
    "Accessibility",
    "SaaS metrics",
  ],
  keywords: [
    "onboarding",
    "activation",
    "growth",
    "Figma",
    "cross-functional",
    "mentorship",
  ],
  experienceRequirements: [
    "5+ years product design",
    "Shipped end-to-end journeys",
    "Led workshops with PM/eng",
  ],
  companyValues: ["Clarity", "Craft", "Collaboration"],
  roleExpectations: [
    "Own discovery through delivery",
    "Strengthen design system",
    "Mentor designers",
  ],
  analyzedAt: "2026-08-05T15:30:00.000Z",
};

export const defaultJobInfo: JobInfo = {
  companyName: "Northwind",
  jobTitle: "Senior Product Designer",
  hiringManager: "Jordan Ruiz",
  companyWebsite: "northwind.design",
  companyLocation: "Remote · San Francisco",
  jobDescription: mockJobDescription,
};

const baseSuggestions: CoverLetterSuggestion[] = [
  {
    id: "sug_1",
    title: "Mention React / frontend collaboration",
    body: "The posting emphasizes end-to-end product surfaces — call out partnership with engineering on shipped UI.",
    sectionKey: "skills",
    impact: "+4 personalization",
  },
  {
    id: "sug_2",
    title: "Add a measurable achievement",
    body: "Your experience paragraph needs a metric. Lead with the +18% activation lift.",
    sectionKey: "experience",
    impact: "+6 keywords",
  },
  {
    id: "sug_3",
    title: "Strengthen the opening",
    body: "Open with the company's growth mandate, then connect your onboarding ownership.",
    sectionKey: "opening",
    impact: "+5 tone",
  },
];

export const mockLetterAiSuggestions: Record<string, LetterAiSuggestion> = {
  improve_opening: {
    id: "ai_open_1",
    sectionKey: "opening",
    action: "Improve",
    original:
      "I am writing to apply for the Senior Product Designer role at Northwind.",
    suggestion:
      "Northwind's focus on activation for 2M+ users is exactly the problem space I've owned — leading onboarding systems that turn first sessions into lasting habits.",
    explanation:
      "Leads with company context and positions you as the owner of a matching outcome.",
    confidence: 0.91,
  },
  rewrite_experience: {
    id: "ai_exp_1",
    sectionKey: "experience",
    action: "Rewrite",
    original:
      "At Northline I worked on onboarding and collaborated with product teams.",
    suggestion:
      "At Northline I led the mobile onboarding redesign that improved day-7 activation by 18%, partnering with PM and engineering across discovery, prototyping, and shipping.",
    explanation:
      "Converts vague ownership into a quantified, cross-functional story recruiters can scan.",
    confidence: 0.94,
  },
  persuasive_closing: {
    id: "ai_close_1",
    sectionKey: "closing",
    action: "Make More Persuasive",
    original: "I hope to hear from you soon.",
    suggestion:
      "I'd welcome a conversation about how my activation and systems work can help Northwind ship clearer first-run experiences this quarter.",
    explanation:
      "Closes with a concrete offer and timeline instead of a passive hope.",
    confidence: 0.88,
  },
  match_jd: {
    id: "ai_match_1",
    sectionKey: "skills",
    action: "Match Job Description",
    original:
      "I am skilled in Figma, workshops, and mentoring junior designers.",
    suggestion:
      "I bring Figma design systems, accessibility-first critique, and workshop facilitation — plus mentorship that lifts craft across growing design orgs.",
    explanation:
      "Mirrors keywords from the posting while keeping a human, confident tone.",
    confidence: 0.9,
  },
};

export const mockCoverLetterDocument: CoverLetterDocument = {
  id: "cl_1",
  title: "Northwind — Senior Product Designer",
  templateId: "modern",
  tone: "confident",
  length: "medium",
  applicationStatus: "draft",
  job: defaultJobInfo,
  analysis: mockJobAnalysis,
  candidate: {
    name: "Kennedy Sithole",
    currentRole: "Senior Product Designer",
    yearsExperience: 8,
    topSkills: [
      "Product Design",
      "Design Systems",
      "Facilitation",
      "User Research",
      "Figma",
    ],
    keyAchievements: [
      "Improved day-7 activation by 18% through onboarding redesign",
      "Scaled design tokens across 6 product squads",
      "Cut KYC-related support tickets by 22%",
    ],
    highlightedExperienceIds: ["exp_1", "exp_2"],
  },
  body: {
    headerName: "Kennedy Sithole",
    headerMeta:
      "Senior Product Designer · London, UK · kennedy.Sithole@email.com · kennedy.design",
    date: "August 5, 2026",
    greeting: "Dear Jordan Ruiz,",
    opening:
      "Northwind's focus on activation for 2M+ users is exactly the problem space I've owned — leading onboarding systems that turn first sessions into lasting habits.",
    experience:
      "At Northline I led the mobile onboarding redesign that improved day-7 activation by 18%, partnering with PM and engineering across discovery, prototyping, and shipping. Earlier at Ledger Labs I designed trading flows for 140k MAU and reduced KYC support tickets by 22% through clearer states.",
    skills:
      "I bring Figma design systems, accessibility-first critique, and workshop facilitation — plus mentorship that lifts craft across growing design orgs.",
    closing:
      "I'd welcome a conversation about how my activation and systems work can help Northwind ship clearer first-run experiences this quarter.",
    signature: "Yours Sincerely,\n\nKennedy Sithole",
  },
  score: {
    total: 92,
    breakdown: {
      personalization: 94,
      keywords: 90,
      tone: 93,
      structure: 91,
      grammar: 96,
    },
    recommendations: [
      "Keep the hiring manager name — it lifts personalization.",
      "One more keyword from the posting (mentorship) is already covered.",
      "Review the experience paragraph for one more metric.",
    ],
  },
  suggestions: baseSuggestions,
  createdAt: "2026-08-01T10:00:00.000Z",
  updatedAt: "2026-08-05T15:40:00.000Z",
};

export const mockSavedCoverLetters: SavedCoverLetterSummary[] = [
  {
    id: "cl_1",
    title: "Northwind — Senior Product Designer",
    company: "Northwind",
    role: "Senior Product Designer",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-05T15:40:00.000Z",
    applicationStatus: "draft",
  },
  {
    id: "cl_2",
    title: "Orbit Pay — Product Designer",
    company: "Orbit Pay",
    role: "Product Designer",
    createdAt: "2026-07-28T14:00:00.000Z",
    updatedAt: "2026-08-01T18:05:00.000Z",
    applicationStatus: "applied",
  },
  {
    id: "cl_3",
    title: "Helix Health — UX Lead",
    company: "Helix Health",
    role: "UX Lead",
    createdAt: "2026-07-20T09:00:00.000Z",
    updatedAt: "2026-07-29T12:10:00.000Z",
    applicationStatus: "interview",
  },
  {
    id: "cl_4",
    title: "Atlas Bank — Design Manager",
    company: "Atlas Bank",
    role: "Design Manager",
    createdAt: "2026-07-10T11:00:00.000Z",
    updatedAt: "2026-07-18T16:20:00.000Z",
    applicationStatus: "offer",
  },
  {
    id: "cl_5",
    title: "Plainfield — Senior Designer",
    company: "Plainfield",
    role: "Senior Designer",
    createdAt: "2026-06-22T08:00:00.000Z",
    updatedAt: "2026-07-02T10:00:00.000Z",
    applicationStatus: "rejected",
  },
];

export const emptyCoverLetterDocument = (): CoverLetterDocument => ({
  ...mockCoverLetterDocument,
  id: `cl_${Date.now()}`,
  title: "Untitled cover letter",
  applicationStatus: "draft",
  job: {
    companyName: "",
    jobTitle: "",
    hiringManager: "",
    companyWebsite: "",
    companyLocation: "",
    jobDescription: "",
  },
  analysis: null,
  body: {
    headerName: mockCoverLetterDocument.candidate.name,
    headerMeta: `${mockCoverLetterDocument.candidate.currentRole} · kennedy.Sithole@email.com`,
    date: "August 5, 2026",
    greeting: "Dear Hiring Manager,",
    opening: "",
    experience: "",
    skills: "",
    closing: "",
    signature: `Yours Sincerely,\n\n${mockCoverLetterDocument.candidate.name}`,
  },
  score: {
    total: 0,
    breakdown: {
      personalization: 0,
      keywords: 0,
      tone: 0,
      structure: 0,
      grammar: 0,
    },
    recommendations: ["Paste a job description and generate your first draft."],
  },
  suggestions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function getMockLetterById(id: string): CoverLetterDocument {
  if (id === "new") return emptyCoverLetterDocument();
  const saved = mockSavedCoverLetters.find((l) => l.id === id);
  if (!saved) return { ...mockCoverLetterDocument, id };
  if (id === "cl_1") return mockCoverLetterDocument;
  return {
    ...mockCoverLetterDocument,
    id: saved.id,
    title: saved.title,
    job: {
      ...mockCoverLetterDocument.job,
      companyName: saved.company,
      jobTitle: saved.role,
    },
    applicationStatus: saved.applicationStatus,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
    body: {
      ...mockCoverLetterDocument.body,
      opening: `I'm excited to apply for the ${saved.role} role at ${saved.company}.`,
    },
  };
}
