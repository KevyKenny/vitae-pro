"use client";

import Link from "next/link";
import { SETTINGS_NAV } from "@/features/settings/components/settings-sidebar";
import { mockSettingsProfile, mockBillingState, subscriptionPlans } from "@/mocks/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { UserRound } from "lucide-react";

export function SettingsOverview() {
  const profile = mockSettingsProfile;
  const plan = subscriptionPlans.find((p) => p.id === mockBillingState.currentPlanId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[1.75rem] font-semibold tracking-tight text-ink">
          Account settings
        </h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Personalize how VitatePro coaches your career — profile, AI, CV defaults,
          and billing in one place.
        </p>
      </div>

      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-xl font-semibold text-ink">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-sm text-ink-soft">{profile.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="default">
                Profile {profile.profileCompletion}%
              </Badge>
              <Badge variant="gold">{plan?.name ?? "Free"} plan</Badge>
            </div>
          </div>
          <Button asChild shape="soft" className="rounded-[8px]">
            <Link href="/settings/profile">Complete profile</Link>
          </Button>
        </div>
        {profile.profileCompletion < 100 ? (
          <div className="mt-4">
            <EmptyState
              icon={UserRound}
              title="Incomplete profile"
              description="Add photo, links, and career goals so AI can personalize suggestions."
              actionLabel="Edit profile"
              onAction={() => {
                window.location.href = "/settings/profile";
              }}
              className="py-10"
            />
          </div>
        ) : null}
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-2">
        {SETTINGS_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-4 transition-colors hover:border-emerald/40 hover:shadow-s"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-emerald-wash text-emerald">
                <Icon className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {item.label}
                </span>
                <span className="text-[0.78rem] text-ink-soft">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
