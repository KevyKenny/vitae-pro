"use client";

import { useEffect, useState } from "react";

type DocumentReadyMarkerProps = {
  ready: boolean;
};

/** Signals print/PDF capture that layout, fonts, and pagination are settled. */
export function DocumentReadyMarker({ ready }: DocumentReadyMarkerProps) {
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function markReady() {
      try {
        await document.fonts.ready;
      } catch {
        // ignore font load errors — proceed with fallback metrics
      }
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      if (!cancelled) setMarked(true);
    }

    void markReady();
    return () => {
      cancelled = true;
    };
  }, [ready]);

  if (!ready || !marked) return null;

  return (
    <span
      data-document-ready="true"
      aria-hidden
      className="sr-only"
    />
  );
}
