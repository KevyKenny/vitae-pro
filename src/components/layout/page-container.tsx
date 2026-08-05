import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageContainer({
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 py-8 sm:px-8 lg:px-11 lg:py-9",
        narrow ? "max-w-3xl" : "max-w-[1220px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
