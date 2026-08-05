"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ACCOUNT_NAV,
  PRIMARY_NAV,
  type NavItem,
} from "@/lib/constants/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-[11px] rounded-[8px] px-3 py-[9px] text-[0.88rem] font-medium text-ink-soft transition-all duration-150",
        "hover:bg-paper-dim hover:text-ink",
        active && "bg-emerald-wash font-semibold text-emerald",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className="size-[18px] shrink-0 opacity-85" aria-hidden />
      {!collapsed ? <span>{item.label}</span> : null}
      {collapsed ? <span className="sr-only">{item.label}</span> : null}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

type SidebarNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  return (
    <>
      <nav className="flex flex-col gap-0.5" aria-label="Main">
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {!collapsed ? (
        <p className="mt-2 px-3 pt-3.5 pb-2 text-[0.68rem] font-medium uppercase tracking-[0.07em] text-ink-faint">
          Account
        </p>
      ) : (
        <div className="my-3 h-px bg-line" role="separator" />
      )}

      <nav className="flex flex-col gap-0.5" aria-label="Account">
        {ACCOUNT_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </>
  );
}
