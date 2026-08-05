"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-ink group-[.toaster]:border-line group-[.toaster]:shadow-m",
          description: "group-[.toast]:text-ink-soft",
          actionButton:
            "group-[.toast]:bg-emerald group-[.toast]:text-paper",
          cancelButton:
            "group-[.toast]:bg-paper-dim group-[.toast]:text-ink-soft",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
