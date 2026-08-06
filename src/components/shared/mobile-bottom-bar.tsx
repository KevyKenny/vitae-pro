import { cn } from "@/lib/utils";

type MobileBottomBarProps = {
  children: React.ReactNode;
  className?: string;
  /** Breakpoint at which the bar hides. Default matches app editors (`lg`). */
  hideFrom?: "md" | "lg";
};

/**
 * Fixed mobile action tray — thumb-reachable, safe-area aware.
 * Pair scrolled content with `pb-mobile-bar` so nothing sits under it.
 */
export function MobileBottomBar({
  children,
  className,
  hideFrom = "lg",
}: MobileBottomBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-surface/95 p-3 backdrop-blur-md",
        "safe-pb",
        hideFrom === "md" ? "md:hidden" : "lg:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
