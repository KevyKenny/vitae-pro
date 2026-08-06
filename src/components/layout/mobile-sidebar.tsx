"use client";

import { Logo } from "@/components/layout/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getInitials } from "@/lib/utils";
import { mockCurrentUser } from "@/mocks";

export function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const planLabel =
    mockCurrentUser.plan === "free"
      ? "Free plan"
      : mockCurrentUser.plan === "pro"
        ? "Pro plan"
        : "Team plan";

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        className="w-[min(100%,300px)] gap-0 p-0 safe-pt safe-pb"
      >
        <SheetHeader className="border-b border-line px-4 py-5 text-left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Logo onNavigate={() => setMobileOpen(false)} />
        </SheetHeader>
        <div className="flex h-full flex-col px-4 py-5">
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
          <div className="flex-1" />
          <div className="mt-2 flex items-center gap-2.5 border-t border-line px-3 pt-3">
            <Avatar>
              <AvatarFallback>
                {mockCurrentUser.avatarInitials ??
                  getInitials(mockCurrentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[0.85rem] font-semibold text-ink">
                {mockCurrentUser.name}
              </p>
              <p className="text-[0.72rem] text-ink-faint">{planLabel}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
