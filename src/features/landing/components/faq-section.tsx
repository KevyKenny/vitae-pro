"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { landingFaqs } from "@/mocks/landing";

export function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {landingFaqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left text-base font-semibold text-ink hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-ink-soft">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-ink-soft">
          Straight answers before you create your first document.
        </p>
      </div>
      <div className="mt-10">
        <FAQAccordion />
      </div>
    </section>
  );
}
