const TEMPLATE_TITLES: Record<string, string> = {
  tpl_default: "Default",
  tpl_0: "Contrast",
  tpl_1: "Compact",
  tpl_2: "Classic",
  tpl_3: "Formal",
  tpl_4: "Split",
  tpl_5: "Timeline",
};

export function resolveTemplateTitle(id: string): string {
  return TEMPLATE_TITLES[id] ?? "Template";
}
