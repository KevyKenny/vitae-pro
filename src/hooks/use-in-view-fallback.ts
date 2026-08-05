"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** Lightweight IntersectionObserver helper (avoids extra dependency). */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options ?? { threshold: 0.35 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, options]);

  return { ref, inView };
}
