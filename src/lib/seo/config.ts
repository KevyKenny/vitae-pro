import { APP_NAME, APP_TAGLINE } from "@/lib/constants/navigation";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://vitatepro.app"
).replace(/\/$/, "");

export const SITE_NAME = APP_NAME;
export const SITE_TAGLINE = APP_TAGLINE;

export const DEFAULT_TITLE = `${SITE_NAME} — AI CV & Cover Letter Builder`;
export const DEFAULT_DESCRIPTION =
  "Create professional CVs and personalized cover letters with AI assistance. Templates, coaching, and exports in one career workspace.";

export const DEFAULT_KEYWORDS = [
  "CV builder",
  "resume builder",
  "cover letter generator",
  "AI resume",
  "AI cover letter",
  "career tools",
  "VitatePro",
  "professional CV templates",
] as const;

/** Indexed public marketing routes (sitemap + SEO helpers). */
export const PUBLIC_MARKETING_ROUTES = [
  {
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    path: "/contact",
    title: "Contact",
    description:
      "Get in touch with the VitatePro team for support, partnerships, sales, media, feature requests, and bug reports.",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "How VitatePro collects, uses, and protects your CV content and personal information — with transparency around AI processing.",
    changeFrequency: "yearly" as const,
    priority: 0.4,
  },
  {
    path: "/terms",
    title: "Terms of Service",
    description:
      "The terms that keep VitatePro reliable and fair — accounts, acceptable use, AI content, and upcoming subscriptions.",
    changeFrequency: "yearly" as const,
    priority: 0.4,
  },
] as const;

/** Private / app routes crawlers should not spend budget on. */
export const ROBOTS_DISALLOW = [
  "/dashboard",
  "/cvs",
  "/cover-letters",
  "/cover-letter",
  "/templates",
  "/customize",
  "/ai-assistant",
  "/settings",
  "/help",
  "/onboarding",
  "/auth/",
] as const;

export function absoluteUrl(path = "/") {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
