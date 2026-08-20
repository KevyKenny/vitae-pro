import type { TemplateDefinition, TemplateRendererKey } from "@/lib/templates/definitions/types";
import { tplDefaultDefinition } from "@/lib/templates/definitions/tpl-default";
import { tpl0Definition } from "@/lib/templates/definitions/tpl-0";
import { tpl1Definition } from "@/lib/templates/definitions/tpl-1";
import { tpl2Definition } from "@/lib/templates/definitions/tpl-2";
import { tpl3Definition } from "@/lib/templates/definitions/tpl-3";
import { tpl4Definition } from "@/lib/templates/definitions/tpl-4";
import { tpl5Definition } from "@/lib/templates/definitions/tpl-5";

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  tplDefaultDefinition,
  tpl0Definition,
  tpl1Definition,
  tpl2Definition,
  tpl3Definition,
  tpl4Definition,
  tpl5Definition,
];

const REGISTRY = new Map<TemplateRendererKey, TemplateDefinition>(
  TEMPLATE_DEFINITIONS.map((d) => [d.id, d]),
);

export function getTemplateDefinition(
  key: TemplateRendererKey | string | undefined | null,
): TemplateDefinition {
  if (key && REGISTRY.has(key as TemplateRendererKey)) {
    return REGISTRY.get(key as TemplateRendererKey)!;
  }
  return tplDefaultDefinition;
}

export function getTemplateDefinitionBySlug(slug: string): TemplateDefinition {
  const match = TEMPLATE_DEFINITIONS.find((d) => d.slug === slug);
  return match ?? tplDefaultDefinition;
}

export function resolveRendererKey(input: {
  rendererKey?: string | null;
  templateSlug?: string | null;
  legacyTemplateId?: string | null;
}): TemplateRendererKey {
  if (input.rendererKey && REGISTRY.has(input.rendererKey as TemplateRendererKey)) {
    return input.rendererKey as TemplateRendererKey;
  }
  if (input.templateSlug) {
    const bySlug = getTemplateDefinitionBySlug(input.templateSlug);
    if (bySlug.id !== "tpl_default" || input.templateSlug === "tpl_default") {
      return bySlug.id;
    }
  }
  return "tpl_default";
}

export {
  tplDefaultDefinition,
  tpl0Definition,
  tpl1Definition,
  tpl2Definition,
  tpl3Definition,
  tpl4Definition,
  tpl5Definition,
};
export {
  DEFAULT_RENDERER_KEY,
  isTemplateRendererKey,
} from "@/lib/templates/definitions/types";
export type {
  TemplateDefinition,
  TemplateRendererKey,
  TemplateLayoutFamily,
  TemplateRegionId,
  TemplateRenderContext,
  RegionPageModel,
} from "@/lib/templates/definitions/types";
