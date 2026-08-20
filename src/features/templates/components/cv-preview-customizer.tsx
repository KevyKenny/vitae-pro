"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CvDocumentView } from "@/components/document";
import { PAGE_DIMENSIONS } from "@/components/document/page-geometry";
import { useCustomize } from "@/features/templates/context/customize-context";
import { mockCvDocument } from "@/mocks/cv-editor";
import { cn } from "@/lib/utils";

export function CVPreviewCustomizer({ className }: { className?: string }) {
  const { customization, zoom, setZoom, template } = useCustomize();
  const scale = zoom / 100;

  return (
    <div className={cn("flex h-full flex-col bg-paper-dim", className)}>
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Preview</h2>
          <p className="text-[0.72rem] text-ink-faint">
            {template.name} · {customization.pageSize.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
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
          <span className="w-10 text-center font-mono text-[0.72rem]">{zoom}%</span>
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
            size="icon-sm"
            shape="soft"
            aria-label="Print preview"
            onClick={() => toast.message("Use Apply to CV, then export from the editor.")}
          >
            <Printer className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 justify-center overflow-auto p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0.7, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            width: PAGE_DIMENSIONS.a4.width,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <CvDocumentView
            document={{ ...mockCvDocument, templateId: template.editorStyle }}
            customization={customization}
            pageSize={customization.pageSize}
            mode="preview"
            shell
          />
        </motion.div>
      </div>
    </div>
  );
}
