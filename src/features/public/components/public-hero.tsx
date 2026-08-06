"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PublicHero({
  title,
  subtitle,
  description,
  breadcrumbs,
  readingMinutes,
  lastUpdated,
  centered = false,
}: {
  title: string;
  subtitle: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  readingMinutes?: number;
  lastUpdated?: string;
  centered?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 80% at 10% 0%, rgba(31,77,61,0.12), transparent 50%), radial-gradient(ellipse 50% 50% at 90% 20%, rgba(176,141,62,0.10), transparent 45%)",
        }}
      />
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 lg:px-8 lg:pt-14 lg:pb-16",
          centered && "text-center",
        )}
      >
        <nav
          aria-label="Breadcrumb"
          className={cn("mb-6", centered && "flex justify-center")}
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-faint">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.label} className="inline-flex items-center gap-1.5">
                {i > 0 ? (
                  <ChevronRight className="size-3.5 opacity-60" aria-hidden />
                ) : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-ink" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={cn(centered && "mx-auto")}
        >
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p
            className={cn(
              "mt-3 max-w-2xl text-lg text-ink-soft",
              centered && "mx-auto",
            )}
          >
            {subtitle}
          </p>
          {description ? (
            <p
              className={cn(
                "mt-3 max-w-2xl text-sm leading-relaxed text-ink-faint",
                centered && "mx-auto",
              )}
            >
              {description}
            </p>
          ) : null}
          <div
            className={cn(
              "mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.78rem] font-medium text-ink-faint",
              centered && "justify-center",
            )}
          >
            {lastUpdated ? <span>Last updated {lastUpdated}</span> : null}
            {readingMinutes ? (
              <span>{readingMinutes} min read</span>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function SectionDivider() {
  return <div className="my-10 h-px w-full bg-line" role="separator" />;
}
