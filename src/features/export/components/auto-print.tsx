"use client";

import { useEffect } from "react";

export function AutoPrint({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return (
    <div className="no-print fixed top-3 right-3 z-50 flex gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-[8px] border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-s"
      >
        Print
      </button>
    </div>
  );
}
