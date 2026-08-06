"use client";

import { PublicPageLayout } from "@/features/public/components/public-page-layout";
import { LegalSection } from "@/features/public/components/legal-section";
import { SectionDivider } from "@/features/public/components/public-hero";
import {
  estimateReadingMinutes,
  privacySections,
  privacyToc,
  PRIVACY_UPDATED,
} from "@/mocks/public-pages";

export function PrivacyPage() {
  return (
    <PublicPageLayout
      title="Privacy Policy"
      subtitle="Your privacy and personal information matter to us."
      description="VitatePro values transparency and responsible handling of user data. This page explains what we collect, how AI features process content, and the controls available to you."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy" },
      ]}
      lastUpdated={PRIVACY_UPDATED}
      readingMinutes={estimateReadingMinutes(privacySections)}
      toc={privacyToc}
    >
      {privacySections.map((section, index) => (
        <div key={section.id}>
          {index > 0 ? <SectionDivider /> : null}
          <LegalSection section={section} />
        </div>
      ))}
    </PublicPageLayout>
  );
}
