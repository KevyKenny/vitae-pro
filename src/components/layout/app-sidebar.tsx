"use client";

import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn, getInitials } from "@/lib/utils";

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  const { collapsed, toggleCollapsed } = useSidebar();
  const { user, profile } = useAuth();
  const name =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    user?.email ||
    "Account";
  const planLabel = "Free plan";

  return (
    <motion.aside
      aria-label="Primary"
      initial={false}
      animate={{ width: collapsed ? 72 : 252 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex h-full flex-col border-r border-line bg-surface px-4 py-[22px]",
        className,
      )}
    >
      <div
        className={cn(
          "mb-1 flex items-center px-2.5 pb-5",
          collapsed ? "flex-col gap-3 px-0" : "justify-between gap-2",
        )}
      >
        <Logo compact={collapsed} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              shape="soft"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              className="text-ink-faint"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? "Expand" : "Collapse"}
          </TooltipContent>
        </Tooltip>
      </div>

      <SidebarNav collapsed={collapsed} />

      <div className="flex-1" />

      <div
        className={cn(
          "mt-2 flex items-center gap-2.5 border-t border-line pt-3",
          collapsed ? "justify-center px-0" : "px-3",
        )}
      >
        <Avatar>
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-[0.85rem] font-semibold text-ink">
              {name}
            </p>
            <p className="text-[0.72rem] text-ink-faint">{planLabel}</p>
          </div>
        ) : null}
      </div>
    </motion.aside>
  );
}
