"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CV_MONTHLY_PRICE_LABEL,
  CV_STARTER_DURATION_DAYS,
  CV_STARTER_PRICE_LABEL,
} from "@/lib/constants/pricing";
import type { ExportStatus } from "@/features/export/hooks/use-cv-export";

export function DownloadPaymentDialog({
  open,
  onOpenChange,
  onConfirm,
  status,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  status: ExportStatus;
}) {
  const busy = status === "preparing" || status === "generating";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-[16px] p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>Download your CV</DialogTitle>
          <DialogDescription className="text-[0.95rem] leading-relaxed">
            Pay {CV_STARTER_PRICE_LABEL} to download. This lasts{" "}
            {CV_STARTER_DURATION_DAYS} days. After that, upgrade to{" "}
            {CV_MONTHLY_PRICE_LABEL}/month.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 rounded-[12px] border border-line bg-paper-dim/50 p-4">
          {[
            "No charge to create or edit",
            `${CV_STARTER_PRICE_LABEL} unlocks downloads for ${CV_STARTER_DURATION_DAYS} days`,
            `Then ${CV_MONTHLY_PRICE_LABEL}/month to keep downloading`,
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-ink-soft">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-[0.75rem] leading-relaxed text-ink-faint">
          Checkout is being connected. Continue to download your CV now — you
          won&apos;t be charged until payments go live.
        </p>

        <DialogFooter className="gap-2 sm:flex-col">
          <Button
            type="button"
            shape="soft"
            className="h-12 w-full"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy
              ? "Preparing download…"
              : `Pay ${CV_STARTER_PRICE_LABEL} & download`}
          </Button>
          <Button
            type="button"
            variant="ghost"
            shape="soft"
            className="h-11 w-full"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Keep editing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
