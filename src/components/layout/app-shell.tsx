"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TopBar } from "@/components/layout/top-bar";
import { pageTransition } from "@/lib/animations/variants";

export function AppShell({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <SidebarProvider>
      <div className="flex min-h-dvh bg-paper">
        <div className="sticky top-0 hidden h-dvh shrink-0 lg:block">
          <AppSidebar />
        </div>
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <motion.main
            initial={reduceMotion ? false : "initial"}
            animate="animate"
            variants={pageTransition}
            className="min-h-0 flex-1"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
}
