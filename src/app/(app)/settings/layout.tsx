import type { Metadata } from "next";
import { SettingsLayout } from "@/features/settings/components/settings-layout";

export const metadata: Metadata = {
  title: "Settings",
  description: "Personalize your VitatePro career assistant.",
};

export default function SettingsRouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
