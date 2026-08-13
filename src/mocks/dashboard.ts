import type {
  ActivityItem,
  DashboardStat,
  QuickAction,
  ResumeHealthItem,
  ScoreBreakdown,
  TipItem,
} from "@/types";

export const mockDashboardStats: DashboardStat[] = [
  {
    id: "stat_cvs",
    label: "Total CVs",
    value: 6,
    trend: "+2 this month",
    trendDirection: "up",
    progress: 75,
    tone: "emerald",
  },
  {
    id: "stat_letters",
    label: "Cover Letters",
    value: 3,
    trend: "+1 this week",
    trendDirection: "up",
    progress: 45,
  },
  {
    id: "stat_ai",
    label: "AI Improvements",
    value: 47,
    trend: "+12 vs last week",
    trendDirection: "up",
    progress: 82,
    tone: "gold",
  },
  {
    id: "stat_templates",
    label: "Templates Used",
    value: 4,
    trend: "of 5 available",
    trendDirection: "flat",
    progress: 80,
  },
  {
    id: "stat_apps",
    label: "Applications Sent",
    value: 14,
    trend: "3 in interview",
    trendDirection: "up",
    progress: 60,
  },
  {
    id: "stat_resume",
    label: "Resume Score",
    value: 88,
    suffix: "/100",
    trend: "+6 pts",
    trendDirection: "up",
    progress: 88,
    tone: "emerald",
  },
  {
    id: "stat_profile",
    label: "Profile Completion",
    value: 78,
    suffix: "%",
    trend: "2 items left",
    trendDirection: "up",
    progress: 78,
  },
];

export const mockQuickActions: QuickAction[] = [
  {
    id: "qa_cv",
    title: "Create New CV",
    description: "Start from a template with AI coaching on every section.",
    href: "/cvs",
    cta: "Create CV",
    icon: "cv",
  },
  {
    id: "qa_letter",
    title: "Generate Cover Letter",
    description: "Match tone to a target role in a few guided prompts.",
    href: "/cover-letter",
    cta: "Generate",
    icon: "letter",
  },
  {
    id: "qa_import",
    title: "Import Existing CV",
    description: "Bring a PDF or Word draft into VitatePro for a polish pass.",
    href: "/cvs",
    cta: "Import",
    icon: "import",
  },
  {
    id: "qa_templates",
    title: "Browse Templates",
    description: "Explore Meridian, Ledger, Atelier, and more layouts.",
    href: "/templates",
    cta: "Browse",
    icon: "templates",
  },
];

export const mockResumeHealth: ResumeHealthItem[] = [
  {
    id: "rh_summary",
    label: "Professional Summary",
    score: 82,
    recommendation: "Trim to three lines and lead with domain focus.",
    status: "good",
  },
  {
    id: "rh_experience",
    label: "Work Experience",
    score: 76,
    recommendation: "Add one quantified outcome per recent role.",
    status: "needs-work",
  },
  {
    id: "rh_skills",
    label: "Skills",
    score: 88,
    recommendation: "Cluster tools under Design and Research.",
    status: "strong",
  },
  {
    id: "rh_education",
    label: "Education",
    score: 94,
    recommendation: "Looks complete — no changes needed.",
    status: "strong",
  },
  {
    id: "rh_grammar",
    label: "Grammar",
    score: 90,
    recommendation: "Two minor tense consistency fixes remain.",
    status: "good",
  },
  {
    id: "rh_keywords",
    label: "Keywords",
    score: 71,
    recommendation: "Mirror three keywords from your target posting.",
    status: "needs-work",
  },
  {
    id: "rh_achievements",
    label: "Achievements",
    score: 68,
    recommendation: "Convert soft claims into measurable wins.",
    status: "needs-work",
  },
];

export const mockScoreBreakdown: ScoreBreakdown[] = [
  { id: "sb_format", label: "Formatting", score: 94 },
  { id: "sb_content", label: "Content", score: 86 },
  { id: "sb_grammar", label: "Grammar", score: 90 },
  { id: "sb_clarity", label: "Clarity", score: 92 },
  { id: "sb_skills", label: "Skills", score: 88 },
  { id: "sb_experience", label: "Experience", score: 76 },
  { id: "sb_education", label: "Education", score: 94 },
];

export const mockActivity: ActivityItem[] = [
  {
    id: "act_1",
    title: "Generated Cover Letter",
    description: "Northline — Senior Product Designer",
    createdAt: "2026-08-05T15:20:00.000Z",
    type: "cover-letter",
  },
  {
    id: "act_2",
    title: "Improved Professional Summary",
    description: "AI rewrite accepted on Meridian CV",
    createdAt: "2026-08-05T14:05:00.000Z",
    type: "summary",
  },
  {
    id: "act_3",
    title: "Downloaded Resume",
    description: "Senior Product Designer.pdf",
    createdAt: "2026-08-05T13:50:00.000Z",
    type: "download",
  },
  {
    id: "act_4",
    title: "Created CV",
    description: "UX Lead — Healthtech from Folio",
    createdAt: "2026-08-04T11:10:00.000Z",
    type: "create",
  },
  {
    id: "act_5",
    title: "Updated Experience",
    description: "Added Northline activation metric",
    createdAt: "2026-08-03T17:35:00.000Z",
    type: "experience",
  },
  {
    id: "act_6",
    title: "Used AI Rewrite",
    description: "Skills section keyword pass",
    createdAt: "2026-08-02T09:25:00.000Z",
    type: "ai-rewrite",
  },
];

export const mockTips: TipItem[] = [
  {
    id: "tip_1",
    title: "First impressions are brief",
    body: "Recruiters spend only a few seconds on an initial CV review — lead with outcomes.",
    category: "Recruiting",
  },
  {
    id: "tip_2",
    title: "Tailor every application",
    body: "Tailor your CV to every application so keywords and achievements mirror the role.",
    category: "Strategy",
  },
  {
    id: "tip_3",
    title: "Measure what you claim",
    body: "Use measurable achievements — percentages, time saved, revenue, or users reached.",
    category: "Writing",
  },
  {
    id: "tip_4",
    title: "Keep summaries concise",
    body: "Keep your summary concise: three lines that prove seniority and domain.",
    category: "Structure",
  },
];

export const mockMotivationalMessages = [
  "Continue building your professional future.",
  "Small edits today compound into stronger offers.",
  "Your next version is one quantified bullet away.",
];
