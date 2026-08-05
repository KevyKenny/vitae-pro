"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants/navigation";
import { ProductMockup } from "@/features/landing/components/product-mockup";

const TRUST = [
  "No credit card required",
  "Create your first CV in minutes",
  "ATS-friendly templates",
  "AI-powered improvements",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31,77,61,0.16), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 20%, rgba(176,141,62,0.12), transparent 50%), radial-gradient(ellipse 40% 30% at 0% 60%, rgba(47,122,92,0.08), transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231F4D3D' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-serif text-3xl font-semibold tracking-[-0.02em] text-emerald sm:text-4xl">
            {APP_NAME}
          </p>
          <h1 className="mt-4 font-serif text-[2.35rem] leading-[1.08] font-semibold tracking-[-0.025em] text-ink sm:text-5xl md:text-[3.25rem]">
            Build a CV that gets noticed.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
            Create professional, ATS-friendly CVs and personalized cover letters
            with AI assistance.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" shape="soft" className="min-w-[180px]">
              <Link href="/auth/sign-up">Create My CV</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              shape="soft"
              className="min-w-[180px]"
            >
              <Link href="/templates">View Templates</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.78rem] text-ink-faint">
            {TRUST.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-14 sm:mt-16">
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}
