"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscriptionPlans } from "@/mocks/settings";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/features/settings/types";

export function PricingCard({
  plan,
  index,
}: {
  plan: SubscriptionPlan;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex h-full flex-col rounded-[18px] border bg-surface p-6 shadow-s",
        plan.highlighted
          ? "border-emerald ring-2 ring-emerald/15"
          : "border-line",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-xl font-semibold text-ink">{plan.name}</h3>
        {plan.highlighted ? <Badge variant="gold">Popular</Badge> : null}
      </div>
      <p className="mt-2 text-sm text-ink-soft">{plan.description}</p>
      <p className="mt-5 font-serif text-3xl font-semibold text-ink">
        {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`}
        {plan.priceMonthly > 0 ? (
          <span className="text-base font-sans font-medium text-ink-faint">
            /mo
          </span>
        ) : null}
      </p>
      <ul className="mt-5 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-ink-soft">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function PricingPreviewSection() {
  return (
    <section id="pricing" className="border-y border-line bg-paper-dim/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="mt-3 text-ink-soft">
            Preview plans — full billing arrives with backend integration.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {subscriptionPlans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild shape="soft" variant="outline">
            <Link href="/settings/billing">View Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
