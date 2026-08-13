export type ProductEventName =
  | "cv_created"
  | "cv_started"
  | "cv_completed"
  | "cv_template_selected"
  | "cv_guided_started"
  | "cv_guided_completed"
  | "cv_tailored"
  | "cv_import_requested"
  | "ai_used"
  | "cv_analysis_started"
  | "cv_exported"
  | "cover_letter_created";

export type ProductEventPayload = {
  documentType?: "cv" | "cover-letter";
  templateId?: string;
  method?: "scratch" | "guided" | "import" | "duplicate" | "tailored";
  completionPercent?: number;
};

/** Lightweight analytics hook — no PII or document content. */
export function trackProductEvent(
  name: ProductEventName,
  payload?: ProductEventPayload,
): void {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", name, payload ?? {});
  }
}
