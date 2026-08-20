"use client";

import { Button } from "@/components/ui/button";
import { CreateCvLink } from "@/features/landing/components/create-cv-link";

export function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
      <div className="rounded-[18px] border border-emerald/20 bg-emerald px-5 py-10 text-center text-paper shadow-m sm:px-10 sm:py-12">
        <h2 className="font-serif text-[1.65rem] font-semibold tracking-tight sm:text-3xl">
          Ready to create your CV?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-paper/80 sm:text-base">
          Free to build. $1.99 to download for 14 days. Then $6/month.
        </p>
        <Button
          asChild
          size="lg"
          shape="soft"
          className="mt-6 h-12 w-full bg-paper text-emerald hover:bg-paper/90 sm:w-auto sm:min-w-[200px]"
        >
          <CreateCvLink>Create My CV</CreateCvLink>
        </Button>
      </div>
    </section>
  );
}
