import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "Career coaching suggestions for your CVs and cover letters.",
};

export default function AiAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
