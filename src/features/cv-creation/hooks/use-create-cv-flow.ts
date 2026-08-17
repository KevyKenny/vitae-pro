"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createCv, cvErrorMessage } from "@/lib/cvs";
import { trackProductEvent } from "@/lib/analytics/events";
import type { CreateCvMethod } from "@/features/cv-creation/types";
import type { EditorTemplateId } from "@/features/cv-editor/types";

type StartCreationOptions = {
  method: CreateCvMethod;
  targetRole?: string;
  targetIndustry?: string;
  templateKey?: EditorTemplateId;
};

export function useCreateCvFlow() {
  const [creating, setCreating] = useState(false);

  const startCreation = useCallback(
    async (options: StartCreationOptions): Promise<{ id: string | null }> => {
      if (options.method === "import") {
        trackProductEvent("cv_import_requested");
        return { id: null };
      }

      if (creating) return { id: null };
      setCreating(true);

      try {
        const { id } = await createCv({
          templateKey: options.templateKey,
          targetRole: options.targetRole ?? null,
          targetIndustry: options.targetIndustry ?? null,
        });

        trackProductEvent(
          options.method === "guided" ? "cv_guided_started" : "cv_started",
          {
            documentType: "cv",
            method: options.method,
          },
        );
        trackProductEvent("cv_created", {
          documentType: "cv",
          method: options.method,
        });

        return { id };
      } catch (error) {
        toast.error(cvErrorMessage(error, "Could not create your CV."));
        return { id: null };
      } finally {
        setCreating(false);
      }
    },
    [creating],
  );

  return { creating, startCreation };
}
