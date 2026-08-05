"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  FileText,
  LayoutTemplate,
  Mail,
  Percent,
  Sparkles,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { AnimatedNumber } from "@/components/shared/animated-number";
import type { DashboardStat } from "@/types";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  stat_cvs: FileText,
  stat_letters: Mail,
  stat_ai: Sparkles,
  stat_templates: LayoutTemplate,
  stat_apps: Target,
  stat_resume: Percent,
  stat_ats: Target,
  stat_profile: UserRound,
};

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = icons[stat.id] ?? FileText;
  const numeric =
    typeof stat.value === "number" ? stat.value : Number(stat.value) || 0;
  const TrendIcon =
    stat.trendDirection === "up"
      ? ArrowUpRight
      : stat.trendDirection === "down"
        ? ArrowDownRight
        : ArrowRight;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className="rounded-[14px] border border-line bg-surface p-5 shadow-s"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[0.78rem] font-semibold text-ink-soft">{stat.label}</p>
        <span className="flex size-8 items-center justify-center rounded-[8px] bg-emerald-wash text-emerald">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p
        className={cn(
          "font-mono text-[1.7rem] font-medium leading-none",
          stat.tone === "emerald" && "text-emerald",
          stat.tone === "gold" && "text-gold",
          (!stat.tone || stat.tone === "default") && "text-ink",
        )}
      >
        {typeof stat.value === "number" ? (
          <AnimatedNumber
            value={numeric}
            suffix={
              stat.suffix ? (
                <span className="text-base text-ink-faint">{stat.suffix}</span>
              ) : null
            }
          />
        ) : (
          <>
            {stat.value}
            {stat.suffix ? (
              <span className="text-base text-ink-faint">{stat.suffix}</span>
            ) : null}
          </>
        )}
      </p>
      {typeof stat.progress === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-dim">
          <motion.div
            className={cn(
              "h-full rounded-full",
              stat.tone === "gold" ? "bg-gold" : "bg-emerald-bright",
            )}
            initial={{ width: 0 }}
            whileInView={{ width: `${stat.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      ) : null}
      <p className="mt-2.5 flex items-center gap-1 text-[0.75rem] text-ink-faint">
        <TrendIcon className="size-3.5" aria-hidden />
        {stat.trend}
      </p>
    </motion.article>
  );
}

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  return (
    <section aria-label="Quick statistics">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold text-ink">Overview</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  );
}
