"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedNumber } from "@/components/shared/animated-number";

export function AtsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setShowAfter(true), 400);
    return () => window.clearTimeout(t);
  }, [inView]);

  return (
    <section className="border-y border-line bg-emerald text-paper">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center"
      >
        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Beat applicant tracking systems with AI-powered optimization.
          </h2>
          <p className="mt-4 text-paper/80">
            VitatePro checks structure, keywords, and clarity so your CV
            reaches the human on the other side.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ScoreCard label="Before" value={62} muted />
          <ScoreCard label="After" value={showAfter ? 92 : 62} highlight />
        </div>
      </div>
    </section>
  );
}

function ScoreCard({
  label,
  value,
  muted,
  highlight,
}: {
  label: string;
  value: number;
  muted?: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.div
      layout
      className={
        highlight
          ? "rounded-[16px] bg-paper p-6 text-ink shadow-l"
          : "rounded-[16px] border border-paper/20 bg-emerald-bright/30 p-6"
      }
    >
      <p
        className={
          muted
            ? "text-sm font-semibold text-paper/70"
            : "text-sm font-semibold text-ink-soft"
        }
      >
        {label}
      </p>
      <p className="mt-2 font-serif text-5xl font-semibold">
        <AnimatedNumber value={value} />
        <span className="text-2xl opacity-70">%</span>
      </p>
      <p className={`mt-2 text-sm ${highlight ? "text-ink-soft" : "text-paper/70"}`}>
        ATS match score
      </p>
    </motion.div>
  );
}
