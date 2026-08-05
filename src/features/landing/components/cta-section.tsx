"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[24px] border border-emerald/20 bg-emerald px-6 py-14 text-center text-paper shadow-l sm:px-12"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(176,141,62,0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgba(250,248,243,0.12), transparent 35%)",
          }}
        />
        <div className="relative">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Your next opportunity starts with a better CV.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/80">
            Draft with AI, design with intention, and apply with confidence.
          </p>
          <Button
            asChild
            size="lg"
            shape="soft"
            className="mt-8 bg-paper text-emerald hover:bg-paper/90"
          >
            <Link href="/auth/sign-up">Create Your CV Today</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
