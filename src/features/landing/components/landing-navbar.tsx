"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { CreateCvLink } from "@/features/landing/components/create-cv-link";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const SECTION_NAV = [
  { label: "Templates", href: "/#templates" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "AI tools", href: "/#ai-tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background,box-shadow,border-color] duration-200",
        scrolled
          ? "border-line bg-paper/85 shadow-s backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Logo href="/" />

        <nav
          className="mx-auto hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {SECTION_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href="/auth/sign-in">Login</Link>
          </Button>
          <Button asChild shape="soft" className="hidden md:inline-flex">
            <CreateCvLink>Create My CV</CreateCvLink>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            shape="soft"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-paper/95 backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4 safe-pb" aria-label="Mobile">
              {SECTION_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[8px] px-3 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-dim"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 grid gap-2">
                <Button asChild variant="outline" shape="soft" className="h-12">
                  <Link href="/auth/sign-in">Login</Link>
                </Button>
                <Button asChild shape="soft" className="h-12">
                  <CreateCvLink onNavigate={() => setOpen(false)}>
                    Create My CV
                  </CreateCvLink>
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
