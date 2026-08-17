"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HelpCircle, LogOut, Menu, Search, Settings, UserRound } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn, getInitials } from "@/lib/utils";
import { useState } from "react";

function displayName(
  first?: string | null,
  last?: string | null,
  email?: string | null,
) {
  const name = [first, last].filter(Boolean).join(" ").trim();
  return name || email?.toLowerCase() || "Account";
}

function accountInitials(
  first?: string | null,
  last?: string | null,
  email?: string | null,
) {
  const name = [first, last].filter(Boolean).join(" ").trim();
  if (name) return getInitials(name);
  const letter = email?.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

const MENU_ITEM_CLASS = "min-h-11 gap-2.5 px-3 py-2.5 text-sm sm:min-h-9 sm:py-2";

export function TopBar({ className }: { className?: string }) {
  const router = useRouter();
  const { setMobileOpen } = useSidebar();
  const { user, profile, signOut } = useAuth();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const name = displayName(
    profile?.first_name,
    profile?.last_name,
    user?.email,
  );
  const email = (profile?.email ?? user?.email ?? "").toLowerCase();
  const initials = accountInitials(
    profile?.first_name,
    profile?.last_name,
    user?.email,
  );

  async function handleSignOut() {
    try {
      setSigningOut(true);
      await signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/cvs?q=${encodeURIComponent(q)}`);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md",
        "safe-pt",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          shape="soft"
          className="shrink-0 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>

        <div className="min-w-0 lg:hidden">
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

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            shape="soft"
            className="md:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
          </Button>

          <ThemeToggle />

          {/* modal={false} avoids Radix locking body pointer-events during soft navigations */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                shape="soft"
                className="rounded-full p-0"
                aria-label="Account menu"
              >
                <Avatar className="size-9 sm:size-8">
                  <AvatarFallback className="text-[0.72rem] font-semibold tracking-normal uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 max-w-[calc(100vw-1.5rem)]"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel className="px-3 py-2.5 font-normal normal-case tracking-normal text-ink">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold text-ink">
                    {name}
                  </span>
                  {email ? (
                    <span className="truncate text-xs font-normal lowercase text-ink-faint">
                      {email}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className={MENU_ITEM_CLASS}>
                <Link href="/settings/profile">
                  <UserRound className="size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={MENU_ITEM_CLASS}>
                <Link href="/help">
                  <HelpCircle className="size-4" />
                  Help
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={MENU_ITEM_CLASS}>
                <Link href="/settings">
                  <Settings className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={MENU_ITEM_CLASS}
                onClick={() => setSignOutOpen(true)}
              >
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="gap-0 p-0 sm:max-w-none">
          <SheetHeader className="border-b border-line px-4 py-4 text-left">
            <SheetTitle className="font-serif text-lg">Search</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSearchSubmit} className="space-y-3 p-4">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
                aria-hidden
              />
              <Input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CVs, letters, templates…"
                className="h-12 border-line bg-surface pl-10"
                aria-label="Search"
              />
            </div>
            <Button type="submit" shape="soft" className="h-12 w-full rounded-[8px]">
              Search
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title="Sign out of VitatePro?"
        description="You can sign back in anytime. Unsaved mock editor drafts stay in this browser only."
        confirmLabel={signingOut ? "Signing out…" : "Sign out"}
        destructive
        onConfirm={handleSignOut}
      />
    </header>
  );
}
