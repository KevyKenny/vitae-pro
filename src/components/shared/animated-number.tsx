"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view-fallback";
import { cn } from "@/lib/utils";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  className?: string;
  suffix?: React.ReactNode;
};

/** Counts up when scrolled into view. */
export function AnimatedNumber({
  value,
  duration = 900,
  className,
  suffix,
}: AnimatedNumberProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, inView, value]);

  return (
    <span ref={ref} className={cn(className)}>
      {display}
      {suffix}
    </span>
  );
}
