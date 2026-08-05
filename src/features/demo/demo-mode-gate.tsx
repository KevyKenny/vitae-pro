"use client";

import { Suspense } from "react";
import { DemoModeProvider, useDemoMode } from "@/features/demo/demo-mode-context";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

function DemoBanner() {
  const { isDemo, disableDemo } = useDemoMode();
  if (!isDemo) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 border-b border-gold/30 bg-gold-wash px-4 py-2 text-sm text-ink"
    >
      <p className="flex items-center gap-2 font-medium">
        <Sparkles className="size-4 text-gold" aria-hidden />
        Demo mode — showcasing example profile, CV, and templates.
      </p>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        shape="soft"
        className="h-7 shrink-0 rounded-[8px]"
        onClick={disableDemo}
      >
        Exit demo
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

export function DemoModeGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <DemoModeProvider>
        <DemoBanner />
        {children}
      </DemoModeProvider>
    </Suspense>
  );
}
