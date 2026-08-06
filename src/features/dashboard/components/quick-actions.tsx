"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileUp,
  LayoutTemplate,
  Mail,
  FilePlus2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuickAction } from "@/types";

const iconMap = {
  cv: FilePlus2,
  letter: Mail,
  import: FileUp,
  templates: LayoutTemplate,
  ai: Sparkles,
} as const;

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section aria-label="Quick actions">
      <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
        Quick actions
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = iconMap[action.icon];
          return (
            <motion.article
              key={action.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="flex min-w-0 flex-col rounded-[14px] border border-line bg-surface p-4 shadow-s sm:p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-paper-dim text-emerald">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="min-w-0 pt-2 text-base font-semibold leading-snug text-ink">
                  {action.title}
                </h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {action.description}
              </p>
              <Button
                asChild
                shape="soft"
                className="mt-4 h-11 w-full rounded-[8px] sm:h-10"
              >
                <Link href={action.href}>{action.cta}</Link>
              </Button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
