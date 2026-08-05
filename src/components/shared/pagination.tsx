"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-3", className)}
    >
      <p className="text-sm text-ink-faint">
        Page <span className="font-medium text-ink">{page}</span> of{" "}
        <span className="font-medium text-ink">{pageCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          shape="soft"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          shape="soft"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
