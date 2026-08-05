"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/animations/variants";

type SectionCardProps = {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
};

export function SectionCard({
  title,
  action,
  children,
  className,
  hoverable = false,
}: SectionCardProps) {
  return (
    <motion.section
      initial="rest"
      whileHover={hoverable ? "hover" : undefined}
      variants={hoverable ? cardHover : undefined}
      className={cn(
        "rounded-[14px] border border-line bg-surface",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4">
          {title ? (
            <h2 className="font-sans text-[1.08rem] font-semibold text-ink">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <div className={cn(!title && !action ? "p-6" : "px-6 pb-2")}>{children}</div>
    </motion.section>
  );
}
