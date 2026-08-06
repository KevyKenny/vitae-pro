"use client";

import dynamic from "next/dynamic";
import { WelcomeHero } from "@/features/dashboard/components/welcome-hero";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { mockActivity, mockQuickActions, mockTips } from "@/mocks";

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
      <QuickActions actions={mockQuickActions} />
      <RecentActivity items={mockActivity} />
      <TipsCarousel tips={mockTips} />
    </div>
  );
}
