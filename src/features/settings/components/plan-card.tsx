"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlanId, SubscriptionPlan } from "@/features/settings/types";
import { cn } from "@/lib/utils";

export function PlanCard({
  plan,
  current,
  onSelect,
}: {
  plan: SubscriptionPlan;
  current?: boolean;
  onSelect: (id: PlanId) => void;
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={cn(
        "flex h-full flex-col rounded-[16px] border bg-surface p-5 shadow-s",
        current || plan.highlighted
          ? "border-emerald ring-2 ring-emerald/15"
          : "border-line-strong",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif text-xl font-semibold text-ink">{plan.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{plan.description}</p>
        </div>
        {current ? <Badge variant="default">Current</Badge> : null}
        {!current && plan.highlighted ? (
          <Badge variant="gold">Popular</Badge>
        ) : null}
      </div>
      <p className="mt-4 font-serif text-3xl font-semibold text-ink">
        {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`}
        {plan.priceMonthly > 0 ? (
          <span className="text-base font-sans font-medium text-ink-faint">
            /mo
          </span>
        ) : null}
      </p>
      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <Button
        type="button"
        shape="soft"
        variant={current ? "outline" : "primary"}
        className="mt-5 w-full rounded-[8px]"
        disabled={current}
        onClick={() => onSelect(plan.id)}
      >
        {current ? "Current plan" : plan.id === "free" ? "Downgrade" : "Upgrade"}
      </Button>
    </motion.article>
  );
}

export function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="rounded-[12px] border border-line bg-surface p-4">
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="font-mono text-[0.78rem] text-ink-faint">
          {used} / {limit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-dim">
        <motion.div
          className="h-full rounded-full bg-emerald"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
