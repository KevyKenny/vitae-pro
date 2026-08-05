"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/animations/variants";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn("w-full max-w-[400px]", className)}
    >
      <h1 className="font-serif text-[1.7rem] font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 mb-7 text-[0.92rem] text-ink-soft">{subtitle}</p>
      ) : (
        <div className="mb-7" />
      )}
      {children}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </motion.div>
  );
}
