import { cn } from "@/lib/utils";

type AuthDividerProps = {
  label?: string;
  className?: string;
};

export function AuthDivider({
  label = "or continue with email",
  className,
}: AuthDividerProps) {
  return (
    <div
      className={cn(
        "mb-6 flex items-center gap-3.5 text-[0.78rem] text-ink-faint",
        className,
      )}
      role="separator"
      aria-label={label}
    >
      <span className="h-px flex-1 bg-line" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
