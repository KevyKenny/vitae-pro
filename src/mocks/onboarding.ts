export type CountryOption = {
  code: string;
  name: string;
};

export const mockCountries: CountryOption[] = [
  { code: "NG", name: "Nigeria" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IE", name: "Ireland" },
  { code: "NL", name: "Netherlands" },
  { code: "ZA", name: "South Africa" },
  { code: "KE", name: "Kenya" },
  { code: "IN", name: "India" },
  { code: "SG", name: "Singapore" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "AE", name: "United Arab Emirates" },
];

export const mockLanguages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
];

export const mockCareerLevels = [
  { value: "student", label: "Student" },
  { value: "graduate", label: "Graduate" },
  { value: "junior", label: "Junior (0–2 years)" },
  { value: "mid", label: "Mid-level (3–5 years)" },
  { value: "senior", label: "Senior (6–10 years)" },
  { value: "executive", label: "Executive / Leadership" },
];

export const mockCareerGoals = [
  {
    id: "new-job" as const,
    title: "Get a new job",
    description: "Tailored CVs for roles you’re targeting now.",
  },
  {
    id: "first-cv" as const,
    title: "Create my first CV",
    description: "Guided structure from a blank page.",
  },
  {
    id: "improve-cv" as const,
    title: "Improve existing CV",
    description: "Polish tone, clarity, and impact.",
  },
  {
    id: "international" as const,
    title: "Apply internationally",
    description: "Formats that work across markets.",
  },
  {
    id: "cover-letters" as const,
    title: "Generate cover letters",
    description: "Role-specific letters in your voice.",
  },
  {
    id: "interview-prep" as const,
    title: "Interview preparation",
    description: "Turn achievements into talking points.",
  },
  {
    id: "freelancing" as const,
    title: "Freelancing",
    description: "Pitch-ready profiles for clients.",
  },
];

export const mockExperienceLevels = [
  {
    id: "student" as const,
    title: "Student",
    description: "Internships, coursework, and early projects.",
  },
  {
    id: "graduate" as const,
    title: "Graduate",
    description: "First roles and transferable skills.",
  },
  {
    id: "junior" as const,
    title: "Junior",
    description: "0–2 years in your field.",
  },
  {
    id: "mid" as const,
    title: "Mid-Level",
    description: "Ownership of projects and outcomes.",
  },
  {
    id: "senior" as const,
    title: "Senior",
    description: "Mentorship and strategic delivery.",
  },
  {
    id: "executive" as const,
    title: "Executive",
    description: "Leadership, org impact, and vision.",
  },
];

export const mockAiPreferences = [
  {
    key: "improveGrammar" as const,
    title: "Improve grammar",
    description: "Fix phrasing and polish wording.",
  },
  {
    key: "suggestAchievements" as const,
    title: "Suggest achievements",
    description: "Prompt quantified impact bullets.",
  },
  {
    key: "generateSummaries" as const,
    title: "Generate summaries",
    description: "Draft professional profile intros.",
  },
  {
    key: "rewriteProfessionally" as const,
    title: "Rewrite professionally",
    description: "Elevate tone without sounding generic.",
  },
  {
    key: "improveReadability" as const,
    title: "Improve readability",
    description: "Tighten long sentences and clutter.",
  },
  {
    key: "createCoverLetters" as const,
    title: "Create cover letters",
    description: "Assist with letter drafts by role.",
  },
];

export const mockEmploymentStatuses = [
  { value: "employed", label: "Currently employed" },
  { value: "seeking", label: "Actively seeking" },
  { value: "student", label: "Student" },
  { value: "freelance", label: "Freelancing" },
  { value: "career-break", label: "Career break" },
];
