"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createCv, cvErrorMessage } from "@/lib/cvs";
import type { EditorTemplateId } from "@/features/cv-editor/types";

export function useCreateCv() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const createAndOpen = useCallback(
    async (options?: {
      templateKey?: EditorTemplateId;
      guided?: boolean;
      useChooser?: boolean;
    }) => {
      if (creating) return;
      if (options?.useChooser !== false) {
        router.push("/cvs/new");
        return;
      }
      setCreating(true);
      try {
        const { id } = await createCv(options);
        const query = options?.guided ? "?guided=1" : "";
        router.push(`/cvs/${id}/edit${query}`);
        router.refresh();
      } catch (error) {
        toast.error(cvErrorMessage(error, "Could not create your CV."));
      } finally {
        setCreating(false);
      }
    },
    [creating, router],
  );

  return { creating, createAndOpen };
}

