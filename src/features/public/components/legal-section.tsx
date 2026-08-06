"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LegalBlock, LegalSectionData } from "@/mocks/public-pages";

export function InfoCard({
  title,
  body,
  tone = "emerald",
}: {
  title: string;
  body: string;
  tone?: "emerald" | "gold" | "info";
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border p-4 shadow-s",
        tone === "emerald" && "border-emerald/20 bg-emerald-wash/60",
        tone === "gold" && "border-gold/25 bg-gold-wash/70",
        tone === "info" && "border-info/20 bg-info-wash/80",
      )}
    >
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function BlockView({ block }: { block: LegalBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-[0.95rem] leading-relaxed text-ink-soft">{block.text}</p>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="space-y-2">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[0.95rem] leading-relaxed text-ink-soft"
          >
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "callout") {
    return (
      <InfoCard title={block.title} body={block.body} tone={block.tone} />
    );
  }
  return (
    <aside
      role="note"
      className="rounded-[12px] border border-gold/30 bg-gold-wash px-4 py-3 text-sm font-medium text-ink"
    >
      {block.text}
    </aside>
  );
}

export function LegalSection({ section }: { section: LegalSectionData }) {
  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="scroll-mt-28 space-y-4"
    >
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink">
        {section.title}
      </h2>
      <div className="space-y-4">
        {section.blocks.map((block, i) => (
          <BlockView key={`${section.id}-${i}`} block={block} />
        ))}
      </div>
      {section.id === "contact" ? (
        <p className="pt-1">
          <Link
            href="/contact"
            className="text-sm font-semibold text-emerald underline-offset-2 hover:underline"
          >
            Go to Contact Us →
          </Link>
        </p>
      ) : null}
    </motion.section>
  );
}
