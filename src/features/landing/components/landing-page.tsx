"use client";

import dynamic from "next/dynamic";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { CTASection } from "@/features/landing/components/cta-section";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

const TemplateShowcase = dynamic(
  () =>
    import("@/features/landing/components/template-showcase").then(
      (m) => m.TemplateShowcase,
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
const FaqSection = dynamic(
  () =>
    import("@/features/landing/components/faq-section").then((m) => m.FaqSection),
  { loading: () => <SectionFallback /> },
);

function SectionFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
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
        <TemplateShowcase />
        <HowItWorksSection />
        <AiFeaturesSection />
        <EditorShowcaseSection />
        <FaqSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
