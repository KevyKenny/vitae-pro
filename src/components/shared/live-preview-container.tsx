import { cn } from "@/lib/utils";

type LivePreviewContainerProps = {
  title?: string;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
};

export function LivePreviewContainer({
  title = "Live preview",
  children,
  toolbar,
  className,
}: LivePreviewContainerProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[320px] flex-col overflow-hidden rounded-[14px] border border-line bg-paper-dim",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-faint">
          {title}
        </p>
        {toolbar}
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
    </div>
  );
}
