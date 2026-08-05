"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  toggleLabelShow?: string;
  toggleLabelHide?: string;
};

export function PasswordInput({
  className,
  toggleLabelShow = "Show password",
  toggleLabelHide = "Hide password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-[4px] p-1 text-ink-faint transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-emerald-bright"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? toggleLabelHide : toggleLabelShow}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
