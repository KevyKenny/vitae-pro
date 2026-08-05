"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { clearMockSession } from "@/features/auth/lib/mock-auth";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { mockCurrentUser, mockNotifications } from "@/mocks";
import { useState } from "react";

export function TopBar({ className }: { className?: string }) {
  const router = useRouter();
  const { setMobileOpen } = useSidebar();
  const unread = mockNotifications.filter((n) => !n.read);
  const notifications = mockNotifications;
  const [signOutOpen, setSignOutOpen] = useState(false);

  function handleSignOut() {
    clearMockSession();
    router.push("/");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          shape="soft"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>

        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search CVs, letters, templates…"
            className="h-10 border-line bg-surface pl-10"
            aria-label="Search"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            shape="soft"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                shape="soft"
                className="relative"
                aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ""}`}
              >
                <Bell className="size-4" />
                {unread.length > 0 ? (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-paper">
                    {unread.length}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-0">
              <div className="flex items-center justify-between px-3 py-3">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                <Badge variant="outline">{unread.length} new</Badge>
              </div>
              <DropdownMenuSeparator className="m-0" />
              {notifications.length === 0 ? (
                <div className="p-3">
                  <EmptyState
                    title="No notifications"
                    description="You’re all caught up. Career tips will show up here."
                    className="border-0 bg-transparent py-8"
                  />
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start gap-1 rounded-none px-3 py-3"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="font-semibold text-ink">
                          {notification.title}
                        </span>
                        {!notification.read ? (
                          <Badge variant="gold">New</Badge>
                        ) : null}
                      </div>
                      <span className="text-xs text-ink-soft">
                        {notification.body}
                      </span>
                      <span className="text-[0.7rem] text-ink-faint">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          <Button asChild variant="outline" size="icon" shape="soft">
            <Link href="/help" aria-label="Help">
              <HelpCircle className="size-4" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                shape="soft"
                className="h-10 gap-2 px-1.5 sm:px-2"
                aria-label="User menu"
              >
                <Avatar className="size-8">
                  <AvatarFallback>
                    {mockCurrentUser.avatarInitials ??
                      getInitials(mockCurrentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate text-sm font-semibold text-ink sm:inline">
                  {mockCurrentUser.name.split(" ")[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span>{mockCurrentUser.name}</span>
                  <span className="text-xs font-normal text-ink-faint">
                    {mockCurrentUser.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">
                  <UserRound className="size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSignOutOpen(true)}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title="Sign out of VitatePro?"
        description="You can sign back in anytime. Unsaved mock editor drafts stay in this browser only."
        confirmLabel="Sign out"
        destructive
        onConfirm={handleSignOut}
      />
    </header>
  );
}
