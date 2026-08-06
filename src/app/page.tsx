import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  createPageMetadata,
  JsonLd,
  landingJsonLd,
} from "@/lib/seo";
import { LandingPage } from "@/features/landing/components/landing-page";
import { landingFaqs } from "@/mocks/landing";

export const metadata = createPageMetadata({
  title: DEFAULT_TITLE,
  absoluteTitle: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: [
    ...DEFAULT_KEYWORDS,
    "online resume builder",
    "job application tools",
    "ATS friendly CV",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={landingJsonLd(landingFaqs)} />
      <LandingPage />
    </>
  );
}
