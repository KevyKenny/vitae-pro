import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor",
  description: "Build CVs and cover letters with an AI career coach.",
};

export const dynamic = "force-dynamic";

export default function EditorRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
