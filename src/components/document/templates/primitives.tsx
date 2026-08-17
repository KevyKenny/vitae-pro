"use client";

import type { ReactNode } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Car,
} from "lucide-react";
import type { CvDocument, PersonalInfo } from "@/features/cv-editor/types";
import {
  formatPersonalContactLine,
  isOptionalFieldVisible,
  visibleOptionalPersonalDetails,
} from "@/lib/cvs/personal-info";
import {
  looksLikeLinkValue,
  resolveDocumentLink,
  type DocumentLinkPlatform,
} from "@/lib/document-links";
import { DocResolvedLink } from "@/components/document/document-links";
import { cn } from "@/lib/utils";

export type ContactIconItem = {
  icon: ReactNode;
  label: string;
  href?: string;
};

export type PersonalContactItem = {
  kind: "email" | "phone" | "location" | "licence" | "web" | "custom";
  label: string;
  href?: string;
  fieldLabel?: string;
  platform?: DocumentLinkPlatform;
};

function GithubContactIcon() {
  return (
    <svg
      className="tpl-sidebar-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.72 5.39-5.31 5.68.42.36.79 1.07.79 2.16v3.25c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

function LinkedinContactIcon() {
  return (
    <svg
      className="tpl-sidebar-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M5.3 7.3A2.3 2.3 0 1 0 5.3 2.7a2.3 2.3 0 0 0 0 4.6ZM3.3 21.3h4V9h-4v12.3ZM9.7 9h3.8v1.7h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6v6.7h-4v-6c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2v6.1h-4V9Z" />
    </svg>
  );
}

export function buildPersonalContactItems(
  personal: PersonalInfo,
): PersonalContactItem[] {
  const items: PersonalContactItem[] = [];
  const includedHrefs = new Set<string>();
  const includedProfilePlatforms = new Set<string>();

  const addLinkedItem = (item: PersonalContactItem) => {
    if (item.href && includedHrefs.has(item.href)) return;
    if (
      item.platform &&
      (item.platform === "github" || item.platform === "linkedin") &&
      includedProfilePlatforms.has(item.platform)
    ) {
      return;
    }
    if (item.href) includedHrefs.add(item.href);
    if (item.platform === "github" || item.platform === "linkedin") {
      includedProfilePlatforms.add(item.platform);
    }
    items.push(item);
  };

  if (personal.email) {
    const link = resolveDocumentLink(personal.email, { kind: "email" });
    addLinkedItem({
      kind: "email",
      label: link.label,
      href: link.href ?? undefined,
    });
  }

  if (personal.phone) {
    const link = resolveDocumentLink(personal.phone, { kind: "phone" });
    addLinkedItem({
      kind: "phone",
      label: link.label,
      href: link.href ?? undefined,
    });
  }

  const licence = personal.driversLicense?.trim();
  for (const line of formatPersonalContactLine(personal)) {
    if (licence && line === licence) continue;
    items.push({ kind: "location", label: line });
  }

  if (isOptionalFieldVisible(personal, "driversLicense") && personal.driversLicense) {
    items.push({ kind: "licence", label: personal.driversLicense });
  }

  if (isOptionalFieldVisible(personal, "website") && personal.portfolio) {
    const link = resolveDocumentLink(personal.portfolio, {
      kind: "web",
    });
    addLinkedItem({
      kind: "web",
      label: link.label,
      href: link.href ?? undefined,
      platform: "website",
    });
  }

  if (isOptionalFieldVisible(personal, "linkedin") && personal.linkedin) {
    const link = resolveDocumentLink(personal.linkedin, {
      kind: "web",
      platformHint: "linkedin",
      preferProfileLabel: true,
    });
    addLinkedItem({
      kind: "web",
      label: link.label,
      href: link.href ?? undefined,
      platform: "linkedin",
    });
  }

  for (const social of personal.socialLinks ?? []) {
    if (!social.trim()) continue;
    const detected = resolveDocumentLink(social);
    const link = resolveDocumentLink(social, {
      platformHint: detected.platform,
      preferProfileLabel:
        detected.platform === "github" || detected.platform === "linkedin",
    });
    addLinkedItem({
      kind: "web",
      label: link.label,
      href: link.href ?? undefined,
      platform: link.platform,
    });
  }

  for (const item of visibleOptionalPersonalDetails(personal)) {
    if (looksLikeLinkValue(item.value)) {
      const link = resolveDocumentLink(item.value);
      addLinkedItem({
        kind: "custom",
        fieldLabel: item.label,
        label: link.label,
        href: link.href ?? undefined,
        platform: link.platform,
      });
    } else {
      items.push({
        kind: "custom",
        label: `${item.label}: ${item.value}`,
      });
    }
  }

  return items;
}

function iconForContactItem(item: PersonalContactItem): ReactNode {
  switch (item.kind) {
    case "email":
      return <Mail className="tpl-sidebar-icon" aria-hidden />;
    case "phone":
      return <Phone className="tpl-sidebar-icon" aria-hidden />;
    case "location":
      return <MapPin className="tpl-sidebar-icon" aria-hidden />;
    case "licence":
      return <Car className="tpl-sidebar-icon" aria-hidden />;
    case "web":
      if (item.platform === "github") {
        return <GithubContactIcon />;
      }
      if (item.platform === "linkedin") {
        return <LinkedinContactIcon />;
      }
      return <Globe className="tpl-sidebar-icon" aria-hidden />;
    default:
      return null;
  }
}

export function buildContactIconItems(personal: PersonalInfo): ContactIconItem[] {
  return buildPersonalContactItems(personal).map((item) => ({
    icon: iconForContactItem(item),
    label: item.fieldLabel ? `${item.fieldLabel}: ${item.label}` : item.label,
    href: item.href,
  }));
}

function socialFieldLabel(raw: string): string {
  const link = resolveDocumentLink(raw);
  if (link.platform === "linkedin") return "LinkedIn";
  if (link.platform === "github") return "GitHub";
  if (link.platform === "gitlab") return "GitLab";
  if (link.platform === "dribbble") return "Dribbble";
  if (link.platform === "behance") return "Behance";
  return "Link";
}

export function buildPersonalLabelValues(document: CvDocument) {
  const { personal } = document;
  const includedProfilePlatforms = new Set<string>();
  const includedHrefs = new Set<string>();
  const items: { label: string; value: string; href?: string }[] = [
    { label: "Name", value: personal.fullName },
  ];

  const addLinkValue = (
    item: { label: string; value: string; href?: string },
    platform?: DocumentLinkPlatform,
  ) => {
    if (item.href && includedHrefs.has(item.href)) return;
    if (
      platform &&
      (platform === "github" || platform === "linkedin") &&
      includedProfilePlatforms.has(platform)
    ) {
      return;
    }
    if (item.href) includedHrefs.add(item.href);
    if (platform === "github" || platform === "linkedin") {
      includedProfilePlatforms.add(platform);
    }
    items.push(item);
  };

  if (personal.email) {
    const link = resolveDocumentLink(personal.email, { kind: "email" });
    addLinkValue({
      label: "Email address",
      value: link.label,
      href: link.href ?? undefined,
    });
  }

  if (personal.phone) {
    const link = resolveDocumentLink(personal.phone, { kind: "phone" });
    addLinkValue({
      label: "Phone number",
      value: link.label,
      href: link.href ?? undefined,
    });
  }

  const address = formatPersonalContactLine(personal).join(", ");
  if (address) items.push({ label: "Address", value: address });

  if (isOptionalFieldVisible(personal, "driversLicense") && personal.driversLicense) {
    items.push({ label: "Driver's license", value: personal.driversLicense });
  }

  if (isOptionalFieldVisible(personal, "website") && personal.portfolio) {
    const link = resolveDocumentLink(personal.portfolio, { kind: "web" });
    addLinkValue({
      label: "Website",
      value: link.label,
      href: link.href ?? undefined,
    });
  }

  if (isOptionalFieldVisible(personal, "linkedin") && personal.linkedin) {
    const link = resolveDocumentLink(personal.linkedin, {
      kind: "web",
      platformHint: "linkedin",
      preferProfileLabel: true,
    });
    addLinkValue({
      label: "LinkedIn",
      value: link.label,
      href: link.href ?? undefined,
    }, "linkedin");
  }

  for (const social of personal.socialLinks ?? []) {
    if (!social.trim()) continue;
    const detected = resolveDocumentLink(social);
    const link = resolveDocumentLink(social, {
      platformHint: detected.platform,
      preferProfileLabel:
        detected.platform === "github" || detected.platform === "linkedin",
    });
    addLinkValue({
      label: socialFieldLabel(social),
      value: link.label,
      href: link.href ?? undefined,
    }, link.platform);
  }

  for (const extra of visibleOptionalPersonalDetails(personal)) {
    if (looksLikeLinkValue(extra.value)) {
      const link = resolveDocumentLink(extra.value);
      items.push({
        label: extra.label,
        value: link.label,
        href: link.href ?? undefined,
      });
    } else {
      items.push({ label: extra.label, value: extra.value });
    }
  }

  return items;
}

export function DocIconContactRow({
  items,
  className,
  inline = false,
}: {
  items: ContactIconItem[];
  className?: string;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        inline ? "tpl-contact-row tpl-contact-row--inline" : "tpl-contact-row",
        className,
      )}
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="tpl-contact-item">
          {item.icon}
          {item.href ? (
            <a
              href={item.href}
              className="tpl-contact-link"
              target={
                item.href.startsWith("http://") ||
                item.href.startsWith("https://")
                  ? "_blank"
                  : undefined
              }
              rel={
                item.href.startsWith("http://") || item.href.startsWith("https://")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function DocSectionHeading({
  title,
  variant = "default",
  className,
}: {
  title: string;
  variant?: "default" | "uppercase" | "form" | "sidebar" | "plain";
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "tpl-section-title",
        variant === "uppercase" && "tpl-section-title--uppercase",
        variant === "form" && "tpl-section-title--form",
        variant === "sidebar" && "tpl-section-title--sidebar",
        variant === "plain" && "tpl-section-title--plain",
        className,
      )}
    >
      {title}
    </h2>
  );
}

export function DocTagGrid({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("tpl-tag-grid", className)}>
      {items.map((item) => (
        <span key={item} className="tpl-tag">
          {item}
        </span>
      ))}
    </div>
  );
}

export function DocLabelValueList({
  items,
  className,
}: {
  items: { label: string; value: string; href?: string }[];
  className?: string;
}) {
  return (
    <dl className={cn("tpl-label-value-list", className)}>
      {items.map((item) => (
        <div key={item.label} className="tpl-label-value-row">
          <dt>{item.label}</dt>
          <dd>
            {item.href ? (
              <a
                href={item.href}
                target={
                  item.href.startsWith("http://") ||
                  item.href.startsWith("https://")
                    ? "_blank"
                    : undefined
                }
                rel={
                  item.href.startsWith("http://") ||
                  item.href.startsWith("https://")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DocGroupedSkills({
  groups,
  className,
}: {
  groups: { label: string; skills: string[] }[];
  className?: string;
}) {
  return (
    <div className={cn("tpl-grouped-skills", className)}>
      {groups.map((group) => (
        <div key={group.label} className="tpl-skill-group">
          <p className="tpl-skill-group-label">{group.label}</p>
          <p className="tpl-skill-group-items">{group.skills.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export function DocQualitiesList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("tpl-qualities-list", className)}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function DocResumeBadge({ className }: { className?: string }) {
  return <div className={cn("tpl-resume-badge", className)}>Resume</div>;
}

export { DocResolvedLink };
