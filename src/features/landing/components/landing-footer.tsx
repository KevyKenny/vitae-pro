"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { APP_NAME } from "@/lib/constants/navigation";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Templates", href: "/templates" },
      { label: "Cover letters", href: "/cover-letter" },
      { label: "AI tools", href: "#ai-tools" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help", href: "/help" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Sign in", href: "/auth/sign-in" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Logo href="/" />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            AI CV and cover letter coaching for people who want their next role
            to notice them.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[0.72rem] font-bold tracking-[0.05em] text-ink-faint uppercase">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p>Built for candidates who mean business.</p>
        </div>
      </div>
    </footer>
  );
}
