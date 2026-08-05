import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  variant?:
    | "page"
    | "cards"
    | "list"
    | "form"
    | "dashboard"
    | "preview"
    | "settings"
    | "templates"
    | "editor";
  className?: string;
};

export function LoadingSkeleton({
  variant = "page",
  className,
}: LoadingSkeletonProps) {
  if (variant === "cards" || variant === "templates") {
    return (
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className,
        )}
        aria-busy
        aria-label="Loading"
      >
        {Array.from({ length: variant === "templates" ? 8 : 4 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[14px] border border-line bg-surface"
          >
            <Skeleton className="aspect-[3/4] w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div
        className={cn(
          "space-y-4 rounded-[14px] border border-line bg-surface p-6",
          className,
        )}
        aria-busy
        aria-label="Loading"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3.5">
            <Skeleton className="h-[50px] w-[38px] rounded-[5px]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-7 w-10 rounded-[6px]" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "form" || variant === "settings") {
    return (
      <div className={cn("space-y-4", className)} aria-busy aria-label="Loading">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "preview" || variant === "editor") {
    return (
      <div
        className={cn(
          "flex min-h-[420px] items-start justify-center bg-paper-dim p-6",
          className,
        )}
        aria-busy
        aria-label="Loading preview"
      >
        <div className="w-full max-w-[420px] space-y-3 rounded-[8px] border border-line bg-surface p-8 shadow-m">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="mt-6 h-3 w-full" />
          <Skeleton className="h-3 w-[90%]" />
          <Skeleton className="h-3 w-[80%]" />
          <Skeleton className="mt-6 h-3 w-full" />
          <Skeleton className="h-3 w-[75%]" />        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={cn("space-y-8", className)} aria-busy aria-label="Loading dashboard">
        <Skeleton className="h-36 w-full rounded-[18px]" />
        <LoadingSkeleton variant="cards" />
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <LoadingSkeleton variant="list" />
          <LoadingSkeleton variant="list" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)} aria-busy aria-label="Loading">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <LoadingSkeleton variant="cards" />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <LoadingSkeleton variant="list" />
        <LoadingSkeleton variant="list" />
      </div>
    </div>
  );
}
