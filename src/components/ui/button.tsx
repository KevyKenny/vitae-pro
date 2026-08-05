import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-emerald-bright focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald text-paper shadow-s hover:bg-emerald-bright hover:-translate-y-px hover:shadow-m",
        secondary:
          "bg-paper-dim text-ink hover:bg-emerald-wash hover:text-emerald",
        outline:
          "border border-line-strong bg-surface text-ink hover:border-emerald hover:bg-emerald-wash",
        ghost: "text-ink-soft hover:text-ink hover:bg-paper-dim",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-s",
        danger:
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-s",
        link: "text-emerald underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-8 min-h-8 px-3 text-xs rounded-full",
        md: "h-10 min-h-10 px-5 text-sm rounded-full",
        lg: "h-12 min-h-11 px-7 text-base rounded-full",
        icon: "size-10 min-h-10 min-w-10 rounded-[8px] sm:size-8 sm:min-h-8 sm:min-w-8",
        "icon-sm":
          "size-9 min-h-9 min-w-9 rounded-[7px] sm:size-7 sm:min-h-7 sm:min-w-7",
      },
      shape: {
        pill: "rounded-full",
        soft: "rounded-[8px]",
      },
    },
    compoundVariants: [
      { size: "icon", shape: "soft", class: "rounded-[8px]" },
      {
        variant: "primary",
        shape: "soft",
        class: "rounded-[8px]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "pill",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  shape,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, shape, className }));

  if (asChild) {
    return (
      <Slot data-slot="button" className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      data-slot="button"
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

export { Button, buttonVariants };
