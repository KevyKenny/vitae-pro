"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search templates…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 py-2",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-ink-faint" aria-hidden />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search templates"
        className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:border-0 focus-visible:shadow-none"
      />
    </div>
  );
}
