"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import {
  CV_MONTHLY_PRICE_LABEL,
  CV_STARTER_DURATION_DAYS,
  CV_STARTER_PRICE_LABEL,
  PRICING_HEADLINE,
} from "@/lib/constants/pricing";

const INCLUDED = [
  "Create and edit CVs for free",
  `Pay ${CV_STARTER_PRICE_LABEL} when you download — lasts ${CV_STARTER_DURATION_DAYS} days`,
  `Then upgrade to ${CV_MONTHLY_PRICE_LABEL}/month to keep downloading`,
  "AI assistance and templates included",
];

export function BillingSettingsView() {
  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Billing"
        description="Create for free. Pay when you download."
      />

      <SectionCard>
        <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
          How pricing works
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
          {PRICING_HEADLINE}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
          Build your CV first. {CV_STARTER_PRICE_LABEL} unlocks downloads for{" "}
          {CV_STARTER_DURATION_DAYS} days. After that, upgrade to{" "}
          {CV_MONTHLY_PRICE_LABEL}/month.
        </p>
        <ul className="mt-5 space-y-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-ink-soft">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild shape="soft" className="h-11 rounded-[8px]">
            <Link href="/cvs/new">Create My CV</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="h-11 rounded-[8px]"
            onClick={() =>
              toast.message("Payment checkout is coming soon", {
                description: `${CV_STARTER_PRICE_LABEL} for ${CV_STARTER_DURATION_DAYS} days, then ${CV_MONTHLY_PRICE_LABEL}/month.`,
              })
            }
          >
            Manage payment method
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
