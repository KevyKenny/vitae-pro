"use client";

import { PublicPageLayout } from "@/features/public/components/public-page-layout";
import { LegalSection } from "@/features/public/components/legal-section";
import { SectionDivider } from "@/features/public/components/public-hero";
import {
  estimateReadingMinutes,
  termsSections,
  termsToc,
  TERMS_UPDATED,
} from "@/mocks/public-pages";

export function TermsPage() {
  return (
    <PublicPageLayout
      title="Terms of Service"
      subtitle="The terms that help keep VitatePro reliable and fair for everyone."
      description="These terms outline how to use VitatePro responsibly — including accounts, AI-generated content, and upcoming subscription policies."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Terms of Service" },
      ]}
      lastUpdated={TERMS_UPDATED}
      readingMinutes={estimateReadingMinutes(termsSections)}
      toc={termsToc}
    >
      {termsSections.map((section, index) => (
        <div key={section.id}>
          {index > 0 ? <SectionDivider /> : null}
          <LegalSection section={section} />
        </div>
      ))}
    </PublicPageLayout>
  );
}
