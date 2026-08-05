"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/shared/section-card";
import type { TipItem } from "@/types";

export function TipsCarousel({ tips }: { tips: TipItem[] }) {
  const [index, setIndex] = useState(0);
  const tip = tips[index];

  if (!tip) return null;

  function prev() {
    setIndex((i) => (i - 1 + tips.length) % tips.length);
  }

  function next() {
    setIndex((i) => (i + 1) % tips.length);
  }

  return (
    <SectionCard
      title="Tips & Recommendations"
      action={
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            onClick={prev}
            aria-label="Previous tip"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            onClick={next}
            aria-label="Next tip"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      }
    >
      <div className="relative min-h-[140px] overflow-hidden pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="rounded-[14px] border border-line bg-paper-dim/50 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-gold-wash text-gold">
                <Lightbulb className="size-4" aria-hidden />
              </span>
              <Badge variant="outline">{tip.category}</Badge>
            </div>
            <h3 className="font-serif text-lg font-semibold text-ink">
              {tip.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {tip.body}
            </p>
            <p className="mt-4 text-xs text-ink-faint">
              Tip {index + 1} of {tips.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}
