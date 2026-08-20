"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CreateCvLink } from "@/features/landing/components/create-cv-link";
import { ProductMockup } from "@/features/landing/components/product-mockup";

export function EditorShowcaseSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A workspace built like a career coach
          </h2>
          <p className="mt-4 text-ink-soft">
            Section navigator, inline AI actions, and a live A4 preview —
            so you write with clarity and design with confidence.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink">
            {[
              "AI assistant on every section",
              "Preview that updates as you type",
              "Templates and suggestion cards in one flow",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald" />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild shape="soft" className="mt-8 h-11">
            <CreateCvLink>Try the editor</CreateCvLink>
          </Button>
        </motion.div>
        <ProductMockup className="lg:max-w-none" />
      </div>
    </section>
  );
}
