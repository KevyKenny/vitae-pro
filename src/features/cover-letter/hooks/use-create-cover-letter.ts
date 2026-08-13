"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  coverLetterErrorMessage,
  createCoverLetter,
} from "@/lib/cover-letters";
import type { LetterTemplateId } from "@/features/cover-letter/types";

export function useCreateCoverLetter() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const createAndOpen = useCallback(
    async (options?: {
      cvId?: string | null;
      templateKey?: LetterTemplateId;
      title?: string;
    }) => {
      if (creating) return;
      setCreating(true);
      try {
        const { id } = await createCoverLetter({
          ...options,
          cvId: options?.cvId ?? undefined,
        });
        router.push(`/cover-letter/${id}`);
        router.refresh();
      } catch (error) {
        toast.error(
          coverLetterErrorMessage(error, "Could not create cover letter."),
        );
      } finally {
        setCreating(false);
      }
    },
    [creating, router],
  );

  return { creating, createAndOpen };
}
