"use client";

import dynamic from "next/dynamic";
import { WelcomeHero } from "@/features/dashboard/components/welcome-hero";
import { DashboardQuickActions } from "@/features/dashboard/components/dashboard-quick-actions";
import { RecentCvs } from "@/features/dashboard/components/recent-cvs";
import { DashboardCvHealth } from "@/features/dashboard/components/dashboard-cv-health";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { mockActivity, mockTips } from "@/mocks";

const RecentActivity = dynamic(
  () =>
    import("@/features/dashboard/components/recent-activity").then(
      (m) => m.RecentActivity,
    ),
  { loading: () => <LoadingSkeleton variant="list" /> },
);

const TipsCarousel = dynamic(
  () =>
    import("@/features/dashboard/components/tips-carousel").then(
      (m) => m.TipsCarousel,
    ),
  { loading: () => <LoadingSkeleton variant="list" /> },
);

export function DashboardView() {
  return (
    <div className="space-y-6 pb-4 sm:space-y-8">
      <WelcomeHero />
      <DashboardCvHealth />
      <DashboardQuickActions />
      <RecentCvs />
      <RecentActivity items={mockActivity} />
      <TipsCarousel tips={mockTips} />
    </div>
  );
}
