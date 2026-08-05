import { toast } from "sonner";

/** Standardized toast helpers for consistent product copy. */
export const notify = {
  success: (title: string, description?: string) =>
    toast.success(title, { description }),
  error: (title: string, description?: string) =>
    toast.error(title, { description }),
  warning: (title: string, description?: string) =>
    toast.warning(title, { description }),
  info: (title: string, description?: string) =>
    toast.message(title, { description }),
  cvSaved: () =>
    toast.success("CV saved successfully.", {
      description: "All changes are up to date.",
    }),
  templateApplied: (name?: string) =>
    toast.success("Template applied.", {
      description: name ? `${name} is now active.` : undefined,
    }),
  changesRestored: () =>
    toast.success("Changes restored.", {
      description: "Your previous version is back.",
    }),
  networkIssue: (onRetry?: () => void) =>
    toast.error("Network issue", {
      description: "Check your connection and try again.",
      action: onRetry
        ? { label: "Retry", onClick: onRetry }
        : undefined,
    }),
};
