import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Mail,
  Sparkles,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My CVs", href: "/cvs", icon: FileText },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Cover Letters", href: "/cover-letters", icon: Mail },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
];

export const ACCOUNT_NAV: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

export const APP_NAME = "VitatePro";
export const APP_TAGLINE = "Your career, drafted with a coach at your shoulder";

export const LOGO_MARK = "/logo/vitaepro-mark.svg";
export const LOGO_MARK_REVERSED = "/logo/vitaepro-mark-reversed.svg";
export const LOGO_MARK_MONO = "/logo/vitaepro-mark-mono.svg";
export const LOGO_HORIZONTAL = "/logo/vitaepro-logo-horizontal.svg";
export const LOGO_STACKED = "/logo/vitaepro-logo-stacked.svg";
export const LOGO_FAVICON = "/logo/vitaepro-favicon.svg";
