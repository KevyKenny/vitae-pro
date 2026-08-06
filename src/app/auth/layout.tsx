import type { Metadata } from "next";
import { AuthBrandPanel } from "@/features/auth/components";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s — VitatePro",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
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
      <section className="relative flex flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        <div className="mx-auto mb-8 w-full max-w-[420px] lg:hidden">
          <Logo href="/" />
          <p className="mt-3 text-sm text-ink-soft">
            Build sharper CVs and cover letters with AI guidance.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[420px]">{children}</div>
      </section>
    </div>
  );
}
