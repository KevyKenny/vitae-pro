"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AIActionButtonProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function AIActionButton({
  label = "Improve",
  onClick,
  className,
  disabled,
}: AIActionButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-7 gap-1 rounded-full bg-emerald-wash px-2.5 text-[0.74rem] font-semibold text-emerald hover:bg-emerald hover:text-paper",
        className,
      )}
    >
      <Sparkles className="size-3.5" aria-hidden />
      {label}
    </Button>
  );
}
