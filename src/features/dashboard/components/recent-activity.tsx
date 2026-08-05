"use client";

import {
  Download,
  FilePlus2,
  Mail,
  PencilLine,
  Sparkles,
  History,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import type { ActivityItem } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

const iconMap = {
  "cover-letter": Mail,
  summary: PencilLine,
  download: Download,
  create: FilePlus2,
  experience: PencilLine,
  "ai-rewrite": Sparkles,
} as const;

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No activity yet"
        description="Your edits, exports, and AI assists will appear in this timeline."
      />
    );
  }

  return (
    <SectionCard title="Recent Activity">
      <ol className="relative space-y-0 pb-3">
        {items.map((item, index) => {
          const Icon = iconMap[item.type];
          return (
            <li key={item.id} className="flex gap-3 py-3">
              <div className="flex flex-col items-center">
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-wash text-emerald">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                {index < items.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-line" aria-hidden />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-ink-soft">{item.description}</p>
                <p className="mt-1 text-[0.7rem] text-ink-faint">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}
