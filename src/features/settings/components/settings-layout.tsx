"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SETTINGS_NAV } from "@/features/settings/components/settings-sidebar";

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current =
    SETTINGS_NAV.find((n) => pathname.startsWith(n.href))?.label ??
    (pathname === "/settings" ? "Overview" : "Settings");

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
        <div>
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Settings
          </p>
          <p className="font-serif text-xl font-semibold text-ink">{current}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="rounded-[8px]"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-4" />
          Sections
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[16px] border border-line bg-surface p-3 shadow-s">
            <p className="mb-3 px-3 pt-2 font-serif text-lg font-semibold text-ink">
              Settings
            </p>
            <SettingsSidebar />
          </div>
        </aside>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="min-w-0"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[min(100%,320px)] p-4">
          <SheetHeader>
            <SheetTitle className="font-serif text-left">Settings</SheetTitle>
          </SheetHeader>
          <div className="mt-4" onClick={() => setOpen(false)}>
            <SettingsSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
