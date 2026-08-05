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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {actions.map((action) => {
          const Icon = iconMap[action.icon];
          return (
            <motion.article
              key={action.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col rounded-[14px] border border-line bg-surface p-5 shadow-s"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-[12px] bg-paper-dim text-emerald">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-ink">{action.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-soft">
                {action.description}
              </p>
              <Button asChild shape="soft" className="mt-4 w-full rounded-[8px]">
                <Link href={action.href}>{action.cta}</Link>
              </Button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
