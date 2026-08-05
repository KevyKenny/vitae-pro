"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { PlanCard, UsageMeter } from "@/features/settings/components/plan-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockBillingState,
  subscriptionPlans,
} from "@/mocks/settings";
import type { PlanId } from "@/features/settings/types";
import { formatRelativeTime } from "@/lib/utils";

export function BillingSettingsView() {
  const [planId, setPlanId] = useState<PlanId>(mockBillingState.currentPlanId);
  const current = subscriptionPlans.find((p) => p.id === planId);
  const usage = mockBillingState.usage;

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Billing"
        description="Manage your plan, compare tiers, and track AI usage — UI only for now."
      />

      <SectionCard>
        <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
              Current plan
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-ink">
              {current?.name}
            </p>
            <p className="text-sm text-ink-soft">
              Renews {formatRelativeTime(mockBillingState.renewsAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="gold">Professional</Badge>
            <Button
              type="button"
              variant="outline"
              shape="soft"
              className="rounded-[8px]"
              onClick={() => toast.message("Manage subscription (UI only)")}
            >
              Manage Subscription
            </Button>
            <Button
              type="button"
              shape="soft"
              className="rounded-[8px]"
              onClick={() => {
                setPlanId("premium");
                toast.success("Upgrade queued (UI only)");
              }}
            >
              Upgrade Plan
            </Button>
          </div>
        </div>
      </SectionCard>

      <div>
        <h2 className="mb-3 font-serif text-lg font-semibold text-ink">Usage</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <UsageMeter
            label="AI generations"
            used={usage.aiGenerations.used}
            limit={usage.aiGenerations.limit}
          />
          <UsageMeter
            label="CV exports"
            used={usage.cvExports.used}
            limit={usage.cvExports.limit}
          />
          <UsageMeter
            label="Templates unlocked"
            used={usage.templatesUnlocked.used}
            limit={usage.templatesUnlocked.limit}
          />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Compare plans
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            shape="soft"
            onClick={() => toast.message("Full comparison (UI only)")}
          >
            Compare Plans
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              current={plan.id === planId}
              onSelect={(id) => {
                setPlanId(id);
                toast.success(
                  id === planId
                    ? "Already on this plan"
                    : `Switched to ${id} (UI only)`,
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
