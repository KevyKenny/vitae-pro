"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  showNewCv?: boolean;
};

/** Page-level title row. Chrome actions live in TopBar. */
export function AppHeader({
  title,
  description,
  actions,
  className,
  showNewCv = true,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="font-serif text-[1.7rem] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-[0.94rem] text-ink-soft">{description}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {actions}
        {showNewCv ? (
          <Button asChild>
            <Link href="/cvs">
              <Plus className="size-4" />
              New CV
            </Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
}
