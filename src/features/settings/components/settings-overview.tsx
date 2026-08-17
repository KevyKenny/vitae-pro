"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SETTINGS_NAV } from "@/features/settings/components/settings-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { UserRound } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/use-auth";

export function SettingsOverview() {
  const router = useRouter();
  const { profile, completion, loading } = useProfile();
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const title = profile?.professional_title ?? "Add your professional title";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[1.75rem] font-semibold tracking-tight text-ink">
          Account settings
        </h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Personalize how VitatePro coaches your career — profile, AI, CV
          defaults, and billing in one place.
        </p>
      </div>

      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-xl font-semibold text-ink">
              {loading
                ? "Loading…"
                : `${firstName} ${lastName}`.trim() || "Your profile"}
            </p>
            <p className="text-sm text-ink-soft">{title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="default">Profile {completion}%</Badge>
              <Badge variant="gold">
                Free to create · $1.99 for 14 days
              </Badge>
            </div>
          </div>
          <Button asChild shape="soft" className="rounded-[8px]">
            <Link href="/settings/profile">Complete profile</Link>
          </Button>
        </div>
        {completion < 100 ? (
          <div className="mt-4">
            <EmptyState
              icon={UserRound}
              title="Incomplete profile"
              description="Add links and career details so AI can personalize suggestions. Photo storage comes in a later phase."
              actionLabel="Edit profile"
              onAction={() => {
                router.push("/settings/profile");
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
