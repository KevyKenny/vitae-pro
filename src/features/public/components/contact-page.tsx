"use client";

import type { LucideIcon } from "lucide-react";
import { Clock, Mail, MessagesSquare, Phone } from "lucide-react";
import { PublicPageLayout } from "@/features/public/components/public-page-layout";
import { ContactCard } from "@/features/public/components/contact-card";
import { ContactForm } from "@/features/public/components/contact-form";
import { FAQCard } from "@/features/public/components/faq-card";
import { contactFaqs } from "@/mocks/public-pages";

const INFO_CARDS: Array<{
  title: string;
  description: string;
  href?: string;
  icon: LucideIcon;
}> = [
  {
    title: "Email",
    description: "kennedysithole50@gmail.com",
    href: "mailto:kennedysithole50@gmail.com",
    icon: Mail,
  },
  {
    title: "Phone",
    description: "0782186683",
    href: "tel:+263782186683",
    icon: Phone,
  },
  {
    title: "Business Hours",
    description: "Monday–Friday, 9:00–18:00 CET (excluding holidays).",
    icon: Clock,
  },
  {
    title: "Response Time",
    description: "We aim to reply within two business days.",
    icon: MessagesSquare,
  },
];

export function ContactPage() {
  return (
    <PublicPageLayout
      title="Contact Us"
      subtitle="We'd love to hear from you."
      description="Whether you need support, want to partner, or have an idea for VitatePro — send us a note and we’ll get back to you."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact" },
      ]}
      centered
    >
      <section aria-labelledby="contact-form-heading" className="space-y-5">
        <h2 id="contact-form-heading" className="sr-only">
          Contact form
        </h2>
        <ContactForm />
      </section>

      <section aria-labelledby="contact-info-heading" className="space-y-5">
        <div className="text-center">
          <h2
            id="contact-info-heading"
            className="font-serif text-2xl font-semibold text-ink"
          >
            More ways to connect
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Helpful context while we grow the support stack.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {INFO_CARDS.map((card) => (
            <ContactCard
              key={card.title}
              title={card.title}
              description={card.description}
              href={card.href}
              icon={card.icon}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="contact-faq-heading" className="space-y-5">
        <div className="text-center">
          <h2
            id="contact-faq-heading"
            className="font-serif text-2xl font-semibold text-ink"
          >
            Frequently asked questions
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Quick answers while you wait for a reply.
          </p>
        </div>
        <div className="space-y-2 text-left">
          {contactFaqs.map((faq, i) => (
            <FAQCard
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </section>
    </PublicPageLayout>
  );
}
