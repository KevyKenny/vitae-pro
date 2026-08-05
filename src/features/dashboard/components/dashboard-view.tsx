"use client";

import dynamic from "next/dynamic";
import { WelcomeHero } from "@/features/dashboard/components/welcome-hero";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  mockActivity,
  mockAISuggestions,
  mockCVs,
  mockDashboardStats,
  mockQuickActions,
  mockResumeHealth,
  mockScoreBreakdown,
  mockTips,
} from "@/mocks";

const RecentCvs = dynamic(
  () =>
    import("@/features/dashboard/components/recent-cvs").then(
      (m) => m.RecentCvs,
    ),
  { loading: () => <LoadingSkeleton variant="list" />, ssr: false },
);

const AiInsights = dynamic(
  () =>
    import("@/features/dashboard/components/ai-insights").then(
      (m) => m.AiInsights,
    ),
  { loading: () => <LoadingSkeleton variant="list" /> },
);

const ResumeHealth = dynamic(
  () =>
    import("@/features/dashboard/components/resume-health").then(
      (m) => m.ResumeHealth,
    ),
  { loading: () => <LoadingSkeleton variant="cards" /> },
);

const ResumeScoreWidget = dynamic(
  () =>
    import("@/features/dashboard/components/resume-score-widget").then(
      (m) => m.ResumeScoreWidget,
    ),
  { loading: () => <LoadingSkeleton variant="list" /> },
);

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
    <div className="space-y-8 pb-4">
      <WelcomeHero />
      <DashboardStats stats={mockDashboardStats} />
      <QuickActions actions={mockQuickActions} />

      <div className="grid items-start gap-6 xl:grid-cols-[1.45fr_1fr]">
        <RecentCvs cvs={mockCVs} />
        <AiInsights suggestions={mockAISuggestions} />
      </div>

      <ResumeHealth items={mockResumeHealth} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ResumeScoreWidget total={88} breakdown={mockScoreBreakdown} />
        <RecentActivity items={mockActivity} />
      </div>

      <TipsCarousel tips={mockTips} />
    </div>
  );
}
