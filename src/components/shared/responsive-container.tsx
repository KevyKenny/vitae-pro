import { cn } from "@/lib/utils";

export function ResponsiveContainer({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "narrow" | "default" | "wide" | "full";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        width === "narrow" && "max-w-3xl",
        width === "default" && "max-w-6xl",
        width === "wide" && "max-w-7xl",
        width === "full" && "max-w-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function KeyboardShortcut({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key) => (
        <kbd
          key={key}
          className="rounded-[6px] border border-line-strong bg-paper-dim px-1.5 py-0.5 font-mono text-[0.68rem] font-medium text-ink-soft"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}
