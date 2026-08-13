"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { SaveStatus } from "@/features/settings/types";

type SaveFn = () => Promise<void> | void;

export function useSettingsSave() {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const timer = useRef<number | null>(null);
  const pendingSave = useRef<SaveFn | null>(null);

  const scheduleSave = useCallback((fn?: SaveFn) => {
    if (fn) pendingSave.current = fn;
    setSaveStatus("unsaved");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      void (async () => {
        const save = pendingSave.current;
        if (!save) {
          setSaveStatus("saved");
          return;
        }
        setSaveStatus("saving");
        try {
          await save();
          setSaveStatus("saved");
          toast.success("Saved", {
            description: "Your preferences are up to date.",
          });
        } catch {
          setSaveStatus("failed");
          toast.error("Save failed", {
            description: "Something went wrong. Try again.",
          });
        }
      })();
    }, 700);
  }, []);

  const saveNow = useCallback(async (fn?: SaveFn) => {
    setSaveStatus("saving");
    try {
      await fn?.();
      setSaveStatus("saved");
      toast.success("Saved");
    } catch (error) {
      setSaveStatus("failed");
      toast.error("Save failed", {
        description: "Something went wrong. Try again.",
      });
      throw error;
    }
  }, []);

  const failSave = useCallback(() => {
    setSaveStatus("failed");
    toast.error("Save failed", {
      description: "Check your connection and retry.",
    });
  }, []);

  const retry = useCallback(() => {
    scheduleSave();
  }, [scheduleSave]);

  return { saveStatus, setSaveStatus, scheduleSave, saveNow, failSave, retry };
}
