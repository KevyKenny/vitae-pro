import type { CSSProperties, ReactNode } from "react";

type DocLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function normalizeHref(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return value;
  if (value.includes("@") && !value.includes(" ")) {
    return `mailto:${value}`;
  }
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("www.")) return `https://${value}`;
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(value)) return `https://${value}`;
  return null;
}

export function DocLink({ href, children, className }: DocLinkProps) {
  const normalized = normalizeHref(href);
  if (!normalized) {
    return <span className={className}>{children}</span>;
  }
  return (
    <a href={normalized} className={className} rel="noopener noreferrer">
      {children}
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
