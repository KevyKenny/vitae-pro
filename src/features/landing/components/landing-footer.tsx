"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { APP_NAME } from "@/lib/constants/navigation";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Templates", href: "/#templates" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "AI tools", href: "/#ai-tools" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Help", href: "/help" },
      { label: "Sign in", href: "/auth/sign-in" },
      { label: "Create My CV", href: "/auth/sign-up" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_2fr] lg:px-8">
        <div>
          <Logo href="/" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Create a professional CV for free. Download for $1.99 — good for
            14 days. Then $6/month.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[0.72rem] font-bold tracking-[0.05em] text-ink-faint uppercase">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2.5">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p>Free to create · $1.99 for 14 days · then $6/month</p>
        </div>
      </div>
    </footer>
  );
}
