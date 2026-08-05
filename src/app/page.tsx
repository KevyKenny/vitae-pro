import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants/navigation";

export const metadata: Metadata = {
  title: {
    absolute: `${APP_NAME} - AI CV Builder & Cover Letter Generator`,
  },
  description:
    "Create professional, ATS-friendly CVs and personalized cover letters with AI assistance. Build a CV that gets noticed.",
  openGraph: {
    title: `${APP_NAME} - AI CV Builder & Cover Letter Generator`,
    description: APP_TAGLINE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - AI CV Builder & Cover Letter Generator`,
    description: APP_TAGLINE,
  },
};

export default function HomePage() {
  return <LandingPage />;
}
