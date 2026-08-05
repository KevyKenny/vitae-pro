"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { SaveStatus } from "@/features/settings/types";

export function useSettingsSave() {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const timer = useRef<number | null>(null);

  const scheduleSave = useCallback(() => {
    setSaveStatus("unsaved");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setSaveStatus("saving");
      window.setTimeout(() => {
        setSaveStatus("saved");
        toast.success("Saved", { description: "Your preferences are up to date." });
      }, 650);
    }, 700);
  }, []);

  const saveNow = useCallback(async (fn?: () => Promise<void> | void) => {
    setSaveStatus("saving");
    try {
      await fn?.();
      await new Promise((r) => setTimeout(r, 500));
      setSaveStatus("saved");
      toast.success("Saved");
    } catch {
      setSaveStatus("failed");
      toast.error("Save failed", {
        description: "Something went wrong. Try again.",
      });
    }
  }, []);

  const failSave = useCallback(() => {
    setSaveStatus("failed");
    toast.error("Save failed", { description: "Check your connection and retry." });
  }, []);

  const retry = useCallback(() => {
    scheduleSave();
  }, [scheduleSave]);

  return { saveStatus, setSaveStatus, scheduleSave, saveNow, failSave, retry };
}
