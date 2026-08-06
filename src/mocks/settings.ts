import type {
  AiPreferences,
  AppearancePreferences,
  BillingState,
  CvPreferences,
  LoginEvent,
  NotificationPreferences,
  SecuritySession,
  SettingsProfile,
  SubscriptionPlan,
} from "@/features/settings/types";

export const mockSettingsProfile: SettingsProfile = {
  firstName: "Kennedy",
  lastName: "Sithole",
  title: "Senior Product Designer",
  email: "kennedy.Sithole@example.com",
  phone: "+44 7700 900182",
  location: "London, UK",
  country: "GB",
  linkedin: "https://linkedin.com/in/kennedySithole",
  portfolio: "https://kennedy.design",
  github: "https://github.com/kennedy",
  website: "https://kennedy.design",
  photoUrl: undefined,
  careerLevel: "senior",
  industry: "design",
  yearsExperience: 8,
  employmentStatus: "employed",
  careerGoals:
    "Lead design systems and activation work at a high-growth product company.",
  profileCompletion: 78,
};

export const mockSettingsAiPreferences: AiPreferences = {
  writingStyle: "confident",
  assistanceLevel: "balanced",
  autoSuggest: true,
  highlightWeak: true,
  recommendKeywords: true,
  improveGrammar: true,
  generateAchievements: false,
  suggestSkills: true,
  careerFocus: ["improve-cv", "hired-faster"],
};

export const mockCvPreferences: CvPreferences = {
  defaultTemplateId: "tpl_meridian",
  defaultFont: "inter",
  defaultColorTheme: "emerald",
  defaultLanguage: "en",
  dateFormat: "dmy",
  pageSize: "a4",
  cvStyle: "modern",
};

export const mockAppearancePreferences: AppearancePreferences = {
  theme: "system",
  accent: "emerald",
  animations: true,
  compactMode: false,
};

export const mockNotificationPreferences: NotificationPreferences = {
  email: true,
  productUpdates: true,
  aiSuggestions: true,
  cvReminders: true,
  templateReleases: false,
  tips: true,
};

export const mockSecuritySessions: SecuritySession[] = [
  {
    id: "sess_1",
    device: "Chrome · Windows",
    location: "London, UK",
    lastActive: "2026-08-05T22:10:00.000Z",
    current: true,
  },
  {
    id: "sess_2",
    device: "Safari · iPhone",
    location: "London, UK",
    lastActive: "2026-08-04T08:22:00.000Z",
    current: false,
  },
  {
    id: "sess_3",
    device: "Edge · Windows",
    location: "Berlin, DE",
    lastActive: "2026-07-28T14:05:00.000Z",
    current: false,
  },
];

export const mockLoginHistory: LoginEvent[] = [
  {
    id: "login_1",
    at: "2026-08-05T21:58:00.000Z",
    device: "Chrome · Windows",
    location: "London, UK",
    status: "success",
  },
  {
    id: "login_2",
    at: "2026-08-04T08:20:00.000Z",
    device: "Safari · iPhone",
    location: "London, UK",
    status: "success",
  },
  {
    id: "login_3",
    at: "2026-08-01T11:12:00.000Z",
    device: "Unknown · Firefox",
    location: "Lagos, NG",
    status: "failed",
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    description: "Core CV tools to get started.",
    features: [
      "2 CVs",
      "20 AI suggestions / month",
      "Basic export",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    priceMonthly: 19,
    description: "For active job seekers who want a coach.",
    features: [
      "Unlimited CVs",
      "500 AI generations / month",
      "Cover letter builder",
      "Premium templates",
      "Priority export",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 39,
    description: "Maximum AI depth for career transitions.",
    features: [
      "Everything in Professional",
      "Unlimited AI generations",
      "Custom branding kits",
      "Team-ready workspaces",
      "Early feature access",
    ],
  },
];

export const mockBillingState: BillingState = {
  currentPlanId: "professional",
  renewsAt: "2026-09-05T00:00:00.000Z",
  usage: {
    aiGenerations: { used: 142, limit: 500 },
    cvExports: { used: 8, limit: 50 },
    templatesUnlocked: { used: 9, limit: 14 },
  },
};

export const writingStyleOptions = [
  {
    id: "professional" as const,
    label: "Professional",
    description: "Polished corporate tone for formal teams.",
  },
  {
    id: "friendly" as const,
    label: "Friendly",
    description: "Warm without losing credibility.",
  },
  {
    id: "confident" as const,
    label: "Confident",
    description: "Assertive ownership of impact.",
  },
  {
    id: "executive" as const,
    label: "Executive",
    description: "Strategic framing for senior stakeholders.",
  },
  {
    id: "technical" as const,
    label: "Technical",
    description: "Precise language for engineering-adjacent roles.",
  },
  {
    id: "creative" as const,
    label: "Creative",
    description: "Distinct voice for design-forward brands.",
  },
];

export const assistanceLevelOptions = [
  {
    id: "minimal" as const,
    label: "Minimal",
    description: "Only suggestions — you stay fully in control.",
  },
  {
    id: "balanced" as const,
    label: "Balanced",
    description: "Suggestions plus targeted improvements.",
  },
  {
    id: "advanced" as const,
    label: "Advanced",
    description: "AI actively improves content as you write.",
  },
];

export const careerFocusOptions = [
  {
    id: "hired-faster" as const,
    label: "Get hired faster",
    description: "Optimize for speed-to-offer and keyword fit.",
  },
  {
    id: "improve-cv" as const,
    label: "Improve CV quality",
    description: "Polish clarity, structure, and impact.",
  },
  {
    id: "change-careers" as const,
    label: "Change careers",
    description: "Reframe transferable achievements.",
  },
  {
    id: "international" as const,
    label: "Apply internationally",
    description: "Formats that travel across markets.",
  },
  {
    id: "senior-roles" as const,
    label: "Prepare for senior roles",
    description: "Leadership language and scope signals.",
  },
  {
    id: "freelancing" as const,
    label: "Freelancing",
    description: "Pitch-ready profiles for clients.",
  },
];
