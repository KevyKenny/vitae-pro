import { sanitizeCvHtml } from "@/lib/cvs/sanitize-html";

/** Convert responsibility bullet strings into Quill-friendly HTML. */
export function bulletsToHtml(items: string[]): string {
  const lines = items.map((item) => item.trim()).filter(Boolean);
  if (lines.length === 0) return "";
  return `<ul>${lines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("")}</ul>`;
}

/** Parse Quill/HTML description back into plain bullet strings. */
export function htmlToBullets(html: string): string[] {
  const cleaned = sanitizeCvHtml(html ?? "").trim();
  if (!cleaned) return [];

  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(cleaned, "text/html");
    const listItems = Array.from(doc.querySelectorAll("li"))
      .map((li) => li.textContent?.trim() ?? "")
      .filter(Boolean);
    if (listItems.length > 0) return listItems;

    const paragraphs = Array.from(doc.querySelectorAll("p"))
      .map((p) => p.textContent?.trim() ?? "")
      .filter(Boolean);
    if (paragraphs.length > 0) return paragraphs;

    const text = doc.body.textContent?.trim() ?? "";
    return text ? [text] : [];
  }

  return cleaned
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split(/\n+/)
    .map((line) => line.replace(/^[\u2022\-*]\s*/, "").trim())
    .filter(Boolean);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
