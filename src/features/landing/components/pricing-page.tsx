"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCvLink } from "@/features/landing/components/create-cv-link";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import {
  CV_MONTHLY_PRICE_LABEL,
  CV_STARTER_DURATION_DAYS,
  CV_STARTER_PRICE_LABEL,
  PRICING_HEADLINE,
} from "@/lib/constants/pricing";
import { landingFaqs } from "@/mocks/landing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const STARTER_INCLUDED = [
  "Create and edit your CV for free",
  "Pay only when you download",
  `${CV_STARTER_PRICE_LABEL} unlocks downloads for ${CV_STARTER_DURATION_DAYS} days`,
  "AI assistance and templates included",
];

const MONTHLY_INCLUDED = [
  "Unlimited downloads while subscribed",
  "AI assistance and templates",
  "Best if you apply often",
  `After ${CV_STARTER_DURATION_DAYS} days, upgrade to keep downloading`,
];

export function PricingPageView() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <LandingNavbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-[0.72rem] font-bold tracking-[0.08em] text-emerald uppercase">
          Pricing
        </p>
        <h1 className="mt-3 font-serif text-[1.85rem] leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
          {PRICING_HEADLINE}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
          You&apos;re not paying to start. Build the CV first. Payment appears
          only when you download.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col rounded-[16px] border border-emerald/25 bg-surface p-5 shadow-s sm:p-6">
            <h2 className="font-serif text-xl font-semibold text-ink">
              Starter download
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {CV_STARTER_DURATION_DAYS} days of downloads
            </p>
            <p className="mt-4 font-serif text-3xl font-semibold text-ink">
              {CV_STARTER_PRICE_LABEL}
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {STARTER_INCLUDED.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-soft">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild shape="soft" className="mt-6 h-12 w-full">
              <CreateCvLink>Create My CV</CreateCvLink>
            </Button>
          </article>

          <article className="flex flex-col rounded-[16px] border border-line bg-surface p-5 shadow-s sm:p-6">
            <h2 className="font-serif text-xl font-semibold text-ink">
              Monthly
            </h2>
            <p className="mt-1 text-sm text-ink-soft">After the 14-day starter</p>
            <p className="mt-4 font-serif text-3xl font-semibold text-ink">
              {CV_MONTHLY_PRICE_LABEL}
              <span className="text-base font-sans font-medium text-ink-faint">
                /month
              </span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {MONTHLY_INCLUDED.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-soft">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="outline"
              shape="soft"
              className="mt-6 h-12 w-full"
            >
              <CreateCvLink>Create My CV</CreateCvLink>
            </Button>
          </article>
        </div>

        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Common questions
          </h2>
          <Accordion type="single" collapsible className="mt-3 w-full">
            {landingFaqs.slice(0, 3).map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="py-3.5 text-left text-sm font-semibold text-ink hover:no-underline sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-ink-soft">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
