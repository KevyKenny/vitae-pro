import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your VitatePro career overview.",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <DashboardView />
    </PageContainer>
  );
}
