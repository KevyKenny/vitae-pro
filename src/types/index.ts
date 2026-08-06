export type PlanTier = "free" | "pro" | "team";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarInitials?: string;
  plan: PlanTier;
  createdAt: string;
  streakDays?: number;
  profileCompletion?: number;
};

export type Skill = {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
};

export type WorkExperience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  bullets: string[];
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  details?: string;
};

export type CV = {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  score: number;
  completion: number;
  updatedAt: string;
  status: "draft" | "complete" | "archived";
};

export type CoverLetter = {
  id: string;
  title: string;
  company: string;
  role: string;
  updatedAt: string;
  status: "draft" | "sent" | "archived";
};

export type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  isPremium: boolean;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: "info" | "success" | "suggestion" | "system" | "tip";
};

export type AISuggestion = {
  id: string;
  section: string;
  title: string;
  body: string;
  ctaLabel: string;
  severity: "info" | "improve" | "critical";
  category?: string;
  impact?: string;
  priority?: "low" | "medium" | "high";
};

export type DashboardStat = {
  id: string;
  label: string;
  value: number | string;
  suffix?: string;
  trend: string;
  trendDirection: "up" | "down" | "flat";
  progress?: number;
  tone?: "default" | "emerald" | "gold";
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: "cv" | "letter" | "import" | "templates" | "ai";
};

export type ResumeHealthItem = {
  id: string;
  label: string;
  score: number;
  recommendation: string;
  status: "strong" | "good" | "needs-work";
};

export type ScoreBreakdown = {
  id: string;
  label: string;
  score: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type:
    | "cover-letter"
    | "summary"
    | "download"
    | "create"
    | "experience"
    | "ai-rewrite";
};

export type TipItem = {
  id: string;
  title: string;
  body: string;
  category: string;
};
