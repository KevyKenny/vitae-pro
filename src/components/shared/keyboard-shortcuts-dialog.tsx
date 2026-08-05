"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { KeyboardShortcut } from "@/components/shared/responsive-container";

const SHORTCUTS = [
  { keys: ["Ctrl", "S"], action: "Save document" },
  { keys: ["Ctrl", "Z"], action: "Undo" },
  { keys: ["Ctrl", "Shift", "Z"], action: "Redo" },
  { keys: ["?"], action: "Show keyboard shortcuts" },
  { keys: ["/"], action: "Focus search" },
];

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing) return;
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Speed up common actions across VitatePro. Frontend mock — not all
            bindings are wired yet.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-3">
          {SHORTCUTS.map((row) => (
            <li
              key={row.action}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-ink-soft">{row.action}</span>
              <KeyboardShortcut keys={row.keys} />
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
