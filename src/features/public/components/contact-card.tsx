"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ContactCard({
  title,
  description,
  meta,
  icon: Icon,
  className,
}: {
  title: string;
  description: string;
  meta?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-[14px] border border-line bg-surface p-5 shadow-s",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-3 flex size-9 items-center justify-center rounded-[10px] bg-emerald-wash text-emerald">
          <Icon className="size-4" aria-hidden />
        </span>
      ) : null}
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
      {meta ? (
        <p className="mt-3 font-mono text-[0.78rem] text-emerald">{meta}</p>
      ) : null}
    </motion.article>
  );
}
