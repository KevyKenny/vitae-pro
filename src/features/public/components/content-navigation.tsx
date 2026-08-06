"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LegalTocItem } from "@/mocks/public-pages";

export function ContentNavigation({
  items,
  className,
}: {
  items: LegalTocItem[];
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(item.id);
        },
        { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className={cn("space-y-1", className)}
    >
      <p className="mb-3 text-[0.72rem] font-bold tracking-[0.05em] text-ink-faint uppercase">
        On this page
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block rounded-[8px] px-2.5 py-1.5 text-sm transition-colors",
                active === item.id
                  ? "bg-emerald-wash font-semibold text-emerald"
                  : "text-ink-soft hover:bg-paper-dim hover:text-ink",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
