import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-[8px] border border-line-strong bg-surface px-3.5 py-2.5 text-[0.92rem] text-ink shadow-none transition-[border-color,box-shadow] placeholder:text-ink-faint",
        "focus-visible:border-emerald-bright focus-visible:shadow-[0_0_0_3px_var(--emerald-wash)] focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_rgba(180,35,24,0.12)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
