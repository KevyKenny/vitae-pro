export type DocumentLinkKind = "auto" | "email" | "phone" | "web";

export type DocumentLinkPlatform =
  | "linkedin"
  | "github"
  | "portfolio"
  | "website"
  | string;

export type ResolvedDocumentLink = {
  raw: string;
  href: string | null;
  label: string;
  kind: "email" | "phone" | "web" | "text";
  platform?: DocumentLinkPlatform;
};

export type DocumentLinkOptions = {
  kind?: DocumentLinkKind;
  platformHint?: DocumentLinkPlatform;
  /** When true, prefer short platform names (LinkedIn, GitHub) over domain paths. */
  preferPlatformLabel?: boolean;
  /** When true, show the profile handle for GitHub and LinkedIn URLs. */
  preferProfileLabel?: boolean;
};

const ALLOWED_WEB_SCHEMES = /^https?:$/i;

function trim(value: string) {
  return value.trim();
}

function stripTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function detectPlatform(hostname: string): DocumentLinkPlatform | undefined {
  const host = hostname.toLowerCase();
  if (host.includes("linkedin.com")) return "linkedin";
  if (host.includes("github.com")) return "github";
  if (host.includes("gitlab.com")) return "gitlab";
  if (host.includes("dribbble.com")) return "dribbble";
  if (host.includes("behance.net")) return "behance";
  return undefined;
}

function platformDisplayLabel(
  platform: DocumentLinkPlatform | undefined,
  preferPlatformLabel: boolean,
): string | null {
  if (!platform || !preferPlatformLabel) return null;
  switch (platform) {
    case "linkedin":
      return "LinkedIn";
    case "github":
      return "GitHub";
    case "portfolio":
    case "website":
      return "Portfolio";
    default:
      return null;
  }
}

function parseWebUrl(raw: string): URL | null {
  const value = trim(raw);
  if (!value) return null;

  const candidates = [
    value,
    value.startsWith("//") ? `https:${value}` : null,
    /^www\./i.test(value) ? `https://${value}` : null,
    /^[a-z0-9.-]+\.[a-z]{2,}/i.test(value) ? `https://${value}` : null,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (!ALLOWED_WEB_SCHEMES.test(url.protocol)) continue;
      return url;
    } catch {
      continue;
    }
  }

  return null;
}

function formatWebLabel(
  url: URL,
  platform?: DocumentLinkPlatform,
  preferPlatformLabel = false,
  preferProfileLabel = false,
): string {
  if (preferProfileLabel) {
    const segments = url.pathname.split("/").filter(Boolean);
    if (platform === "linkedin") {
      const profileIndex = segments.findIndex(
        (segment) => segment.toLowerCase() === "in",
      );
      const profile = profileIndex >= 0 ? segments[profileIndex + 1] : undefined;
      if (profile) return profile;
    }
    if (platform === "github" && segments[0]) return segments[0];
  }

  const hinted = platformDisplayLabel(platform, preferPlatformLabel);
  if (hinted) return hinted;

  const host = url.hostname.replace(/^www\./i, "");
  const path = stripTrailingSlash(url.pathname);
  const pathPart = path && path !== "/" ? path : "";
  return `${host}${pathPart}${url.search}${url.hash}`;
}

function parseMailto(raw: string): { address: string; href: string } | null {
  const value = trim(raw);
  if (!value) return null;

  if (/^mailto:/i.test(value)) {
    const href = value;
    const address = value.replace(/^mailto:/i, "").split("?")[0]?.trim();
    return address ? { address, href } : null;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+/.test(value)) {
    return { address: value, href: `mailto:${value}` };
  }

  return null;
}

function parseTel(raw: string): { display: string; href: string } | null {
  const value = trim(raw);
  if (!value) return null;

  if (/^tel:/i.test(value)) {
    const display = value.replace(/^tel:/i, "").trim();
    return display ? { display, href: value } : null;
  }

  const digits = value.replace(/[^\d+]/g, "");
  if (digits.length >= 7) {
    return { display: value, href: `tel:${digits}` };
  }

  return null;
}

export function normalizeDocumentHref(
  raw: string,
  kind: DocumentLinkKind = "auto",
): string | null {
  const value = trim(raw);
  if (!value) return null;

  if (kind === "email" || kind === "auto") {
    const mail = parseMailto(value);
    if (mail) return mail.href;
  }

  if (kind === "phone" || kind === "auto") {
    const tel = parseTel(value);
    if (tel) return tel.href;
  }

  if (kind === "web" || kind === "auto") {
    const url = parseWebUrl(value);
    if (url) return url.href;
  }

  return null;
}

export function formatDocumentLinkLabel(
  raw: string,
  options: DocumentLinkOptions = {},
): string {
  const value = trim(raw);
  if (!value) return "";

  const kind = options.kind ?? "auto";
  const preferPlatformLabel = options.preferPlatformLabel ?? false;
  const preferProfileLabel = options.preferProfileLabel ?? false;

  const mail = kind === "phone" ? null : parseMailto(value);
  if (mail) return mail.address;

  const tel = kind === "email" ? null : parseTel(value);
  if (tel) return tel.display;

  const url = parseWebUrl(value);
  if (url) {
    const platform =
      options.platformHint ?? detectPlatform(url.hostname) ?? undefined;
    return formatWebLabel(
      url,
      platform,
      preferPlatformLabel,
      preferProfileLabel,
    );
  }

  return value;
}

export function resolveDocumentLink(
  raw: string,
  options: DocumentLinkOptions = {},
): ResolvedDocumentLink {
  const value = trim(raw);
  if (!value) {
    return { raw: value, href: null, label: "", kind: "text" };
  }

  const kind = options.kind ?? "auto";
  const preferPlatformLabel = options.preferPlatformLabel ?? false;
  const preferProfileLabel = options.preferProfileLabel ?? false;

  const mail = kind === "phone" ? null : parseMailto(value);
  if (mail) {
    return {
      raw: value,
      href: mail.href,
      label: mail.address,
      kind: "email",
    };
  }

  const tel = kind === "email" ? null : parseTel(value);
  if (tel) {
    return {
      raw: value,
      href: tel.href,
      label: tel.display,
      kind: "phone",
    };
  }

  const url = parseWebUrl(value);
  if (url) {
    const platform =
      options.platformHint ?? detectPlatform(url.hostname) ?? undefined;
    return {
      raw: value,
      href: url.href,
      label: formatWebLabel(
        url,
        platform,
        preferPlatformLabel,
        preferProfileLabel,
      ),
      kind: "web",
      platform,
    };
  }

  return {
    raw: value,
    href: null,
    label: value,
    kind: "text",
  };
}

export function looksLikeLinkValue(value: string): boolean {
  return resolveDocumentLink(value).kind !== "text";
}
