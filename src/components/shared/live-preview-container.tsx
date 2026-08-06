import { cn } from "@/lib/utils";

type LivePreviewContainerProps = {
  title?: string;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
};

export function LivePreviewContainer({
  title = "preview",
  children,
  toolbar,
  className,
}: LivePreviewContainerProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[280px] flex-col overflow-hidden bg-paper-dim sm:min-h-[320px]",
        "rounded-none border-0 sm:rounded-[14px] sm:border sm:border-line",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
        <p className="text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">
          {title}
        </p>
        {toolbar ? (
          <div className="flex flex-wrap items-center gap-1.5">{toolbar}</div>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}
