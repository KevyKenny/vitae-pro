"use client";

import dynamic from "next/dynamic";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { SocialProofSection } from "@/features/landing/components/social-proof-section";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

const HowItWorksSection = dynamic(
  () =>
    import("@/features/landing/components/how-it-works-section").then(
      (m) => m.HowItWorksSection,
    ),
  { loading: () => <SectionFallback /> },
);
const AiFeaturesSection = dynamic(
  () =>
    import("@/features/landing/components/ai-features-section").then(
      (m) => m.AiFeaturesSection,
    ),
  { loading: () => <SectionFallback /> },
);
const EditorShowcaseSection = dynamic(
  () =>
    import("@/features/landing/components/editor-showcase-section").then(
      (m) => m.EditorShowcaseSection,
    ),
  { loading: () => <SectionFallback /> },
);
const TemplateShowcase = dynamic(
  () =>
    import("@/features/landing/components/template-showcase").then(
      (m) => m.TemplateShowcase,
    ),
  { loading: () => <SectionFallback /> },
);
const CoverLetterSection = dynamic(
  () =>
    import("@/features/landing/components/cover-letter-section").then(
      (m) => m.CoverLetterSection,
    ),
  { loading: () => <SectionFallback /> },
);
const TestimonialsSection = dynamic(
  () =>
    import("@/features/landing/components/testimonials-section").then(
      (m) => m.TestimonialsSection,
    ),
  { loading: () => <SectionFallback /> },
);
const PricingPreviewSection = dynamic(
  () =>
    import("@/features/landing/components/pricing-preview-section").then(
      (m) => m.PricingPreviewSection,
    ),
  { loading: () => <SectionFallback /> },
);
const FaqSection = dynamic(
  () =>
    import("@/features/landing/components/faq-section").then((m) => m.FaqSection),
  { loading: () => <SectionFallback /> },
);
const CTASection = dynamic(
  () =>
    import("@/features/landing/components/cta-section").then((m) => m.CTASection),
  { loading: () => <SectionFallback /> },
);

function SectionFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <LoadingSkeleton variant="cards" />
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LandingNavbar />
      <main>
        <HeroSection />
        <SocialProofSection />
        <HowItWorksSection />
        <AiFeaturesSection />
        <EditorShowcaseSection />
        <TemplateShowcase />
        <CoverLetterSection />
        <TestimonialsSection />
        <PricingPreviewSection />
        <FaqSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
