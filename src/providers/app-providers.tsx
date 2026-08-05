"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DemoModeGate } from "@/features/demo/demo-mode-gate";
import { KeyboardShortcutsDialog } from "@/components/shared/keyboard-shortcuts-dialog";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider delayDuration={200}>
        <DemoModeGate>
          {children}
          <KeyboardShortcutsDialog />
        </DemoModeGate>
        <Toaster position="top-right" richColors closeButton />
      </TooltipProvider>
    </ThemeProvider>
  );
}
