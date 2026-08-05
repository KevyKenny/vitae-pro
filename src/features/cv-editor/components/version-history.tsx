"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { formatRelativeTime } from "@/lib/utils";

export function VersionHistory() {
  const { versionsOpen, setVersionsOpen, versions } = useEditor();

  return (
    <Dialog open={versionsOpen} onOpenChange={setVersionsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Version history</DialogTitle>
          <DialogDescription>
            UI-only timeline. Restore and compare are mocked.
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-0">
          {versions.map((version, index) => (
            <li key={version.id} className="flex gap-3 py-3">
              <div className="flex flex-col items-center">
                <span className="size-2.5 rounded-full bg-emerald" />
                {index < versions.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-line" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{version.label}</p>
                <p className="text-xs text-ink-soft">{version.note}</p>
                <p className="mt-1 text-[0.7rem] text-ink-faint">
                  {formatRelativeTime(version.createdAt)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    shape="soft"
                    onClick={() => toast.message("Preview version (mock)")}
                  >
                    Preview
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    shape="soft"
                    onClick={() => toast.message("Compare versions (mock)")}
                  >
                    Compare
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    shape="soft"
                    onClick={() => toast.success("Restored version (mock)")}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
