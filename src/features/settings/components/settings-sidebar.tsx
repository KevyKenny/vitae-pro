"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Brain,
  CreditCard,
  FileText,
  Palette,
  Shield,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const SETTINGS_NAV: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/settings/profile",
    label: "Profile",
    description: "Identity & career",
    icon: UserRound,
  },
  {
    href: "/settings/ai",
    label: "AI Preferences",
    description: "How the coach writes",
    icon: Brain,
  },
  {
    href: "/settings/cv",
    label: "CV Preferences",
    description: "Defaults for new CVs",
    icon: FileText,
  },
  {
    href: "/settings/appearance",
    label: "Appearance",
    description: "Theme & density",
    icon: Palette,
  },
  {
    href: "/settings/notifications",
    label: "Notifications",
    description: "Email & reminders",
    icon: Bell,
  },
  {
    href: "/settings/security",
    label: "Security",
    description: "Password & sessions",
    icon: Shield,
  },
  {
    href: "/settings/billing",
    label: "Billing",
    description: "Plan & usage",
    icon: CreditCard,
  },
];

export function SettingsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings"
      className={cn("flex flex-col gap-1", className)}
    >
      <Link
        href="/settings"
        className={cn(
          "mb-2 rounded-[10px] px-3 py-2 text-sm font-semibold transition-colors",
          pathname === "/settings"
            ? "bg-emerald-wash text-emerald"
            : "text-ink-soft hover:bg-paper-dim hover:text-ink",
        )}
      >
        Overview
      </Link>
      {SETTINGS_NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-start gap-3 rounded-[10px] px-3 py-2.5 transition-colors",
              active
                ? "bg-emerald-wash text-emerald"
                : "text-ink-soft hover:bg-paper-dim hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                layoutId="settings-nav-active"
                className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-emerald"
              />
            ) : null}
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span
                className={cn(
                  "block text-[0.72rem]",
                  active ? "text-emerald/80" : "text-ink-faint",
                )}
              >
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
