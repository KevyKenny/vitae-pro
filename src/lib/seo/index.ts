export {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  PUBLIC_MARKETING_ROUTES,
  ROBOTS_DISALLOW,
  absoluteUrl,
} from "@/lib/seo/config";
export { createPageMetadata } from "@/lib/seo/create-metadata";
export { JsonLd } from "@/lib/seo/json-ld-script";
export {
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
  webPageJsonLd,
  faqPageJsonLd,
  contactPageJsonLd,
  landingJsonLd,
  jsonLdScript,
} from "@/lib/seo/json-ld";
