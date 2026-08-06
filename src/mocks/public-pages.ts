export type LegalTocItem = {
  id: string;
  title: string;
};

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; body: string; tone?: "emerald" | "gold" | "info" }
  | { type: "note"; text: string };

export type LegalSectionData = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export const PRIVACY_UPDATED = "August 5, 2026";
export const TERMS_UPDATED = "August 5, 2026";

export const privacyToc: LegalTocItem[] = [
  { id: "introduction", title: "Introduction" },
  { id: "collect", title: "Information We Collect" },
  { id: "use", title: "How We Use Information" },
  { id: "ai", title: "AI Processing" },
  { id: "storage", title: "Data Storage" },
  { id: "cookies", title: "Cookies" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "rights", title: "User Rights" },
  { id: "contact", title: "Contact" },
];

export const privacySections: LegalSectionData[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    blocks: [
      {
        type: "paragraph",
        text: "VitatePro (“we”, “us”, or “our”) builds an AI-powered CV and cover letter assistant. This Privacy Policy explains what we collect, how we use it, and the choices you have. We value transparency and responsible handling of career data — your documents are personal, and we treat them that way.",
      },
      {
        type: "callout",
        title: "Privacy Commitment",
        body: "We design VitatePro so you can create with confidence. We do not sell your CV content.",
        tone: "emerald",
      },
    ],
  },
  {
    id: "collect",
    title: "2. Information We Collect",
    blocks: [
      {
        type: "paragraph",
        text: "Depending on how you use VitatePro, we may collect:",
      },
      {
        type: "list",
        items: [
          "Account information — name, email, password (hashed), and profile details",
          "CV content — experience, education, skills, and other resume data you enter",
          "Cover letters — drafts and job context you provide for generation",
          "Usage analytics — feature usage, performance metrics, and product diagnostics",
          "Device information — browser type, OS, and approximate location derived from IP",
          "Support requests — messages and attachments you send to our team",
        ],
      },
    ],
  },
  {
    id: "use",
    title: "3. How We Use Information",
    blocks: [
      {
        type: "paragraph",
        text: "We use information to operate and improve VitatePro, including to:",
      },
      {
        type: "list",
        items: [
          "Create, store, and export CVs",
          "Generate AI suggestions and cover letters",
          "Improve platform performance and reliability",
          "Provide customer support",
          "Protect security and prevent abuse",
          "Communicate product updates you opt into",
        ],
      },
      {
        type: "callout",
        title: "Security First",
        body: "Access to production data is restricted. Security monitoring is part of how we ship.",
        tone: "gold",
      },
    ],
  },
  {
    id: "ai",
    title: "4. AI Processing",
    blocks: [
      {
        type: "paragraph",
        text: "When you use AI features, relevant content may be processed by AI models to generate professional summaries, CV improvements, cover letters, grammar edits, and achievement suggestions.",
      },
      {
        type: "paragraph",
        text: "You remain in control: review, edit, accept, or reject suggestions before using them in applications. Do not submit confidential information you are not authorized to process.",
      },
      {
        type: "callout",
        title: "AI Transparency",
        body: "AI output can be imperfect. Always review generated text before applying to jobs.",
        tone: "info",
      },
      {
        type: "callout",
        title: "User Control",
        body: "Your drafts stay editable. Preferences in Settings let you tune how assertive coaching feels.",
        tone: "emerald",
      },
    ],
  },
  {
    id: "storage",
    title: "5. Data Storage",
    blocks: [
      {
        type: "paragraph",
        text: "As VitatePro moves beyond frontend prototypes, we intend to store data using secure cloud infrastructure with encryption in transit, access controls, and routine backups. Exact providers and regions will be confirmed when the backend ships.",
      },
      {
        type: "list",
        items: [
          "Secure cloud storage for account and document data",
          "Encryption for data in transit (and at rest where applicable)",
          "Role-based access control for internal tools",
          "Backups for durability and recovery",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies",
    blocks: [
      {
        type: "paragraph",
        text: "We may use cookies and similar technologies to keep you signed in, remember preferences (such as theme), and understand product usage. You can control cookies through your browser settings; disabling some cookies may limit functionality.",
      },
    ],
  },
  {
    id: "third-party",
    title: "7. Third-Party Services",
    blocks: [
      {
        type: "paragraph",
        text: "VitatePro may integrate with third-party services as the product matures. Examples include:",
      },
      {
        type: "list",
        items: [
          "OpenAI (or similar) — AI generation features",
          "Supabase — authentication and database",
          "Stripe — subscriptions and payments",
          "Analytics providers — product insights",
          "Email providers — transactional and support mail",
        ],
      },
      {
        type: "note",
        text: "Service details may evolve as vendors are finalized. This policy will be updated accordingly.",
      },
    ],
  },
  {
    id: "rights",
    title: "8. User Rights",
    blocks: [
      {
        type: "paragraph",
        text: "Subject to applicable law, you may request to:",
      },
      {
        type: "list",
        items: [
          "Access the personal data we hold about you",
          "Update inaccurate information",
          "Delete your account and associated data",
          "Export your CV and cover letter content",
          "Withdraw consent where processing is consent-based",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "9. Contact",
    blocks: [
      {
        type: "paragraph",
        text: "Questions about privacy? Reach us via the Contact page — we aim to respond within two business days.",
      },
    ],
  },
];

export const termsToc: LegalTocItem[] = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "accounts", title: "Account Responsibilities" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "ai-content", title: "AI Generated Content" },
  { id: "user-responsibilities", title: "User Responsibilities" },
  { id: "ip", title: "Intellectual Property" },
  { id: "subscriptions", title: "Subscriptions" },
  { id: "payments", title: "Payments" },
  { id: "termination", title: "Termination" },
  { id: "disclaimer", title: "Disclaimer" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Information" },
];

export const termsSections: LegalSectionData[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    blocks: [
      {
        type: "paragraph",
        text: "By accessing or using VitatePro, you agree to these Terms of Service. If you do not agree, do not use the product. These terms help keep VitatePro reliable and fair for everyone.",
      },
    ],
  },
  {
    id: "accounts",
    title: "2. Account Responsibilities",
    blocks: [
      {
        type: "list",
        items: [
          "Provide accurate registration information",
          "Keep login credentials confidential",
          "Notify us of unauthorized access",
          "You are responsible for activity under your account",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "3. Acceptable Use",
    blocks: [
      {
        type: "paragraph",
        text: "You agree not to misuse VitatePro, including by attempting to disrupt the service, reverse engineer unprotected aspects, scrape at scale without permission, or use the product for unlawful, deceptive, or harassing purposes.",
      },
    ],
  },
  {
    id: "ai-content",
    title: "4. AI Generated Content",
    blocks: [
      {
        type: "note",
        text: "AI-generated content should always be reviewed before submitting job applications.",
      },
      {
        type: "paragraph",
        text: "Suggestions and drafts may be incomplete or inaccurate. You are responsible for verifying facts, dates, and claims about your experience.",
      },
    ],
  },
  {
    id: "user-responsibilities",
    title: "5. User Responsibilities",
    blocks: [
      {
        type: "list",
        items: [
          "Only upload content you have the right to use",
          "Do not impersonate others in application materials",
          "Comply with employer and jurisdiction rules when applying",
          "Use exports and downloads lawfully",
        ],
      },
    ],
  },
  {
    id: "ip",
    title: "6. Intellectual Property",
    blocks: [
      {
        type: "paragraph",
        text: "VitatePro branding, product UI, and software remain our intellectual property. You retain rights to the career content you create. By uploading content, you grant us a limited license to process it solely to provide the service.",
      },
    ],
  },
  {
    id: "subscriptions",
    title: "7. Subscriptions (placeholder)",
    blocks: [
      {
        type: "paragraph",
        text: "Paid plans may be introduced with different feature limits. Plan names and entitlements shown in the product are previews until billing is live.",
      },
    ],
  },
  {
    id: "payments",
    title: "8. Payments (placeholder)",
    blocks: [
      {
        type: "paragraph",
        text: "When payments launch, charges will be processed by a payment provider (e.g. Stripe). Refund and billing policies will be published before the first charge.",
      },
    ],
  },
  {
    id: "termination",
    title: "9. Termination",
    blocks: [
      {
        type: "paragraph",
        text: "You may stop using VitatePro at any time. We may suspend or terminate accounts that violate these terms or pose risk to the service or other users.",
      },
    ],
  },
  {
    id: "disclaimer",
    title: "10. Disclaimer",
    blocks: [
      {
        type: "paragraph",
        text: "VitatePro is provided “as is.” We do not guarantee interviews or offers. Career results depend on many factors outside our control.",
      },
    ],
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    blocks: [
      {
        type: "paragraph",
        text: "To the fullest extent permitted by law, VitatePro will not be liable for indirect, incidental, or consequential damages arising from your use of the service.",
      },
    ],
  },
  {
    id: "changes",
    title: "12. Changes to Terms",
    blocks: [
      {
        type: "paragraph",
        text: "We may update these Terms as the product evolves. Material changes will be reflected by an updated “Last updated” date on this page.",
      },
    ],
  },
  {
    id: "contact",
    title: "13. Contact Information",
    blocks: [
      {
        type: "paragraph",
        text: "Questions about these Terms? Visit our Contact page or email the address listed there when support mail is available.",
      },
    ],
  },
];

export const contactTopics = [
  {
    id: "general",
    title: "General Support",
    description: "Account questions and getting started.",
    email: "hello@vitatepro.app",
  },
  {
    id: "technical",
    title: "Technical Support",
    description: "Bugs, exports, and product issues.",
    email: "support@vitatepro.app",
  },
  {
    id: "business",
    title: "Business Partnerships",
    description: "Integrations and collaboration ideas.",
    email: "partners@vitatepro.app",
  },
  {
    id: "sales",
    title: "Sales",
    description: "Teams and premium plan questions.",
    email: "sales@vitatepro.app",
  },
  {
    id: "media",
    title: "Media",
    description: "Press and brand inquiries.",
    email: "press@vitatepro.app",
  },
  {
    id: "features",
    title: "Feature Requests",
    description: "Tell us what to build next.",
    email: "product@vitatepro.app",
  },
  {
    id: "bugs",
    title: "Bug Reports",
    description: "Help us reproduce and fix issues.",
    email: "support@vitatepro.app",
  },
];

export const contactFaqs = [
  {
    id: "cv",
    question: "How do I create a CV?",
    answer:
      "Sign up, choose a template, and fill sections in the CV editor. Use AI actions to improve summaries and bullets.",
  },
  {
    id: "ai",
    question: "How do AI suggestions work?",
    answer:
      "Select an AI action on a section. You’ll see original vs suggested text, confidence, and accept/reject controls.",
  },
  {
    id: "export",
    question: "Can I export my CV?",
    answer:
      "Download and print actions are available in the editor UI today as frontend placeholders; file export ships with backend.",
  },
  {
    id: "upgrade",
    question: "How do I upgrade?",
    answer:
      "Open Settings → Billing to preview plans. Live payments arrive in a later phase.",
  },
  {
    id: "delete",
    question: "How do I delete my account?",
    answer:
      "Account deletion will be available in Settings once authentication is connected. Contact us if you need help in the meantime.",
  },
];

export function estimateReadingMinutes(sections: LegalSectionData[]): number {
  const text = sections
    .flatMap((s) =>
      s.blocks.flatMap((b) => {
        if (b.type === "paragraph" || b.type === "note") return [b.text];
        if (b.type === "list") return b.items;
        if (b.type === "callout") return [b.title, b.body];
        return [];
      }),
    )
    .join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}
