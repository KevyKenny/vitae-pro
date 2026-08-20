"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useUser } from "@/features/auth/hooks/use-auth";
import type { EditorTemplateId } from "@/features/cv-editor/types";
import { SELECTED_TEMPLATE_STORAGE_KEY } from "@/lib/constants/pricing";

function rememberTemplate(templateId: EditorTemplateId) {
  try {
    sessionStorage.setItem(SELECTED_TEMPLATE_STORAGE_KEY, templateId);
  } catch {
    // Ignore private-mode / blocked storage.
  }
}

export function getCreateCvHref(
  options: {
    templateId?: EditorTemplateId;
    signedIn?: boolean;
  } = {},
) {
  if (options.templateId) {
    return `/cvs/new?template=${options.templateId}`;
  }
  return options.signedIn ? "/cvs/new" : "/auth/sign-up";
}

export function CreateCvLink({
  templateId,
  onNavigate,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  templateId?: EditorTemplateId;
  onNavigate?: () => void;
}) {
  const { user, loading } = useUser();
  const href = getCreateCvHref({
    templateId,
    signedIn: Boolean(user) && !loading,
  });

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        if (templateId) rememberTemplate(templateId);
        onNavigate?.();
        props.onClick?.(event);
      }}
    />
  );
}
