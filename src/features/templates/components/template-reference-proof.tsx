"use client";

import { CvDocumentView } from "@/components/document";
import { getTemplateDefinition } from "@/lib/templates/definitions";
import type { TemplateRendererKey } from "@/lib/templates/definitions/types";
import { kennedySitholeReferenceFixture } from "@/lib/templates/reference/kennedy-sithole.fixture";

export function TemplateReferenceProof({
  rendererKey,
}: {
  rendererKey: TemplateRendererKey;
}) {
  const definition = getTemplateDefinition(rendererKey);

  return (
    <CvDocumentView
      document={{
        ...kennedySitholeReferenceFixture,
        rendererKey,
        templateSlug: rendererKey,
      }}
      customization={definition.defaultCustomization}
      pageSize="a4"
      mode="preview"
    />
  );
}
