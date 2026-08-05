import type { Metadata } from "next";
import { AuthBrandPanel } from "@/features/auth/components";

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s — VitatePro",
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-2">
      <AuthBrandPanel />
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        {children}
      </section>
    </div>
  );
}
