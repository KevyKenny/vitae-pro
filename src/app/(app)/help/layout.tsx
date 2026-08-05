import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help",
  description: "Guides, shortcuts, and support for VitatePro.",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
