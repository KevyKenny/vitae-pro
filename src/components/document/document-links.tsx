import type { ReactNode } from "react";
import {
  normalizeDocumentHref,
  resolveDocumentLink,
  type DocumentLinkKind,
  type DocumentLinkOptions,
  type DocumentLinkPlatform,
} from "@/lib/document-links";

function isExternalWebHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

type DocLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function DocLink({ href, children, className }: DocLinkProps) {
  const normalized = normalizeDocumentHref(href);
  if (!normalized) {
    return <span className={className}>{children}</span>;
  }
  const external = isExternalWebHref(normalized);
  return (
    <a
      href={normalized}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

type DocResolvedLinkProps = {
  raw: string;
  className?: string;
  kind?: DocumentLinkKind;
  platformHint?: DocumentLinkPlatform;
  preferPlatformLabel?: boolean;
  preferProfileLabel?: boolean;
  children?: ReactNode;
};

export function DocResolvedLink({
  raw,
  className,
  kind,
  platformHint,
  preferPlatformLabel,
  preferProfileLabel,
  children,
}: DocResolvedLinkProps) {
  const options: DocumentLinkOptions = {
    kind,
    platformHint,
    preferPlatformLabel,
    preferProfileLabel,
  };
  const resolved = resolveDocumentLink(raw, options);
  const label = children ?? resolved.label;
  if (!resolved.href) {
    return <span className={className}>{label}</span>;
  }
  return (
    <a
      href={resolved.href}
      className={className}
      target={resolved.kind === "web" ? "_blank" : undefined}
      rel={resolved.kind === "web" ? "noopener noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

export function DocContactLine({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  const visible = items.filter((i) => i.label.trim());
  if (!visible.length) return null;
  return (
    <p className={className}>
      {visible.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 ? " · " : null}
          {item.href ? (
            <DocLink href={item.href}>{item.label}</DocLink>
          ) : (
            item.label
          )}
        </span>
      ))}
    </p>
  );
}
