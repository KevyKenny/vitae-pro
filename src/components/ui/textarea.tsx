import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-[8px] border border-line bg-paper px-3 py-2.5 text-[0.88rem] text-ink leading-relaxed transition-[border-color,background] placeholder:text-ink-faint",
        "focus-visible:border-emerald-bright focus-visible:bg-surface focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
