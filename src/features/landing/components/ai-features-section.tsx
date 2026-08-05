"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ListChecks,
  Mail,
  Sparkles,
  Target,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { landingAiFeatures } from "@/mocks/landing";

const ICONS: Record<string, LucideIcon> = {
  summary: Sparkles,
  experience: Wand2,
  ats: Target,
  letter: Mail,
  grammar: FileText,
  achievements: ListChecks,
};

export function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof landingAiFeatures)[number];
  index: number;
}) {
  const Icon = ICONS[feature.id] ?? Sparkles;
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="rounded-[16px] border border-line bg-surface p-5 shadow-s"
    >
      <span className="flex size-10 items-center justify-center rounded-[10px] bg-emerald-wash text-emerald">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-semibold text-ink">{feature.title}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{feature.description}</p>
      <p className="mt-4 rounded-[10px] bg-paper-dim/80 p-3 font-serif text-[0.82rem] leading-relaxed text-ink italic">
        “{feature.example}”
      </p>
    </motion.article>
  );
}

export function AiFeaturesSection() {
  return (
    <section
      id="ai-tools"
      className="border-y border-line bg-paper-dim/50"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            AI that coaches your career story
          </h2>
          <p className="mt-3 text-ink-soft">
            Not generic copy — suggestions grounded in impact, keywords, and
            how recruiters actually read.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingAiFeatures.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
