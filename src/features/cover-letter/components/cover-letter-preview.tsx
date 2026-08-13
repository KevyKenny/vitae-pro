"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoverLetterDocumentView } from "@/components/document";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { useCoverLetterExport } from "@/features/export/hooks/use-cover-letter-export";
import { letterTemplates } from "@/mocks/cover-letter-builder";
import { cn } from "@/lib/utils";

export function CoverLetterPreview({ className }: { className?: string }) {
  const { document, zoom, setZoom, setTemplate, setTemplatesOpen } =
    useCoverLetter();
  const { printCoverLetter } = useCoverLetterExport();
  const template = letterTemplates.find((t) => t.id === document.templateId);
  const scale = zoom / 100;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-paper-dim",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink">Preview</h2>
          <p className="truncate text-[0.72rem] text-ink-faint">
            {template?.name ?? "Template"} · A4 · Page 1 of 1
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            aria-label="Zoom out"
            onClick={() => setZoom(Math.max(70, zoom - 10))}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-10 text-center font-mono text-[0.72rem] text-ink-soft">
            {zoom}%
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            aria-label="Zoom in"
            onClick={() => setZoom(Math.min(130, zoom + 10))}
          >
            <Plus className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="soft"
            className="hidden rounded-[8px] sm:inline-flex"
            onClick={() => setTemplatesOpen(true)}
          >
            Template
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            aria-label="Print"
            onClick={() => printCoverLetter(document.id, document)}
          >
            <Printer className="size-3.5" />
          </Button>
        </div>
      </div>

      <div
        className="flex shrink-0 touch-pan-x gap-1.5 overflow-x-auto overscroll-x-contain border-b border-line bg-surface px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {letterTemplates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            style={{ touchAction: "pan-x" }}
            className={cn(
              "h-9 shrink-0 whitespace-nowrap rounded-full border px-3 text-[0.72rem] font-semibold transition-colors",
              document.templateId === t.id
                ? "border-emerald bg-emerald text-paper"
                : "border-line-strong text-ink-soft hover:border-emerald/40",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 justify-center overflow-auto p-3 sm:p-5 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={document.templateId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="origin-top shadow-m"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <CoverLetterDocumentView document={document} mode="preview" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
