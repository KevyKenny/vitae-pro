import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "span",
];

const ALLOWED_ATTR = ["href", "rel", "target", "class"];

/** Sanitize rich-text HTML before preview/PDF render. */
export function sanitizeCvHtml(html: string): string {
  if (!html?.trim()) return "";
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ALLOWED_ATTR,
      span: ["class"],
      p: ["class"],
      ul: ["class"],
      ol: ["class"],
      li: ["class"],
      strong: ["class"],
      b: ["class"],
      em: ["class"],
      i: ["class"],
      u: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
  });
}

export function isBlankHtml(html: string): boolean {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length === 0;
}
