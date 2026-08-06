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
        "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="font-serif text-[1.45rem] font-semibold tracking-[-0.01em] text-ink sm:text-[1.7rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[0.9rem] text-ink-soft sm:text-[0.94rem]">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-stretch gap-2 sm:items-center sm:justify-end [&_a]:flex-1 sm:[&_a]:flex-none [&_button]:flex-1 sm:[&_button]:flex-none">
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
