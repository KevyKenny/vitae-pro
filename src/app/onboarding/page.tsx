import type { Metadata } from "next";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Personalize your VitatePro experience.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <OnboardingWizard />
    </div>
  );
}
