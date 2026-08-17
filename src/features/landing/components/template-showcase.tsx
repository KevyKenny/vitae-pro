"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CreateCvLink } from "@/features/landing/components/create-cv-link";
import { LAYOUT_TEMPLATES } from "@/features/landing/lib/template-previews";

export function TemplateShowcase() {
  return (
    <section id="templates" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-serif text-[1.55rem] font-semibold tracking-tight text-ink sm:text-3xl">
            Choose your CV template
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
            These are the actual layouts. Pick one and start writing — you can
            switch later.
          </p>
        </div>

        <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">
          {LAYOUT_TEMPLATES.map((template) => (
            <article
              key={template.slug}
              className="w-[min(78vw,280px)] shrink-0 snap-start overflow-hidden rounded-[14px] border border-line bg-paper shadow-s sm:w-auto"
            >
              <div className="relative aspect-[210/297] overflow-hidden bg-white">
                <Image
                  src={template.previewSrc}
                  alt={`${template.name} CV layout`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 25vw"
                />
              </div>
              <div className="space-y-3 border-t border-line p-3.5">
                <div>
                  <h3 className="font-semibold text-ink">{template.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[0.75rem] leading-snug text-ink-faint">
                    {template.description}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  shape="soft"
                  className="h-11 w-full rounded-[8px] text-[0.82rem]"
                >
                  <CreateCvLink templateId={template.id}>
                    Use this template
                  </CreateCvLink>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
