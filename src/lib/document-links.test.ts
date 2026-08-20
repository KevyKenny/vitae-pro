import { describe, expect, it } from "vitest";
import {
  formatDocumentLinkLabel,
  looksLikeLinkValue,
  normalizeDocumentHref,
  resolveDocumentLink,
} from "@/lib/document-links";

describe("document-links", () => {
  it("normalizes email links without mutating raw input", () => {
    const raw = " person@example.com ";
    const resolved = resolveDocumentLink(raw, { kind: "email" });
    expect(resolved.href).toBe("mailto:person@example.com");
    expect(resolved.label).toBe("person@example.com");
    expect(raw).toBe(" person@example.com ");
  });

  it("cleans mailto labels while preserving query href", () => {
    const resolved = resolveDocumentLink("mailto:person@example.com?subject=CV");
    expect(resolved.href).toBe("mailto:person@example.com?subject=CV");
    expect(resolved.label).toBe("person@example.com");
  });

  it("normalizes phone links", () => {
    const resolved = resolveDocumentLink("+263 77 123 4567", { kind: "phone" });
    expect(resolved.href).toBe("tel:+263771234567");
    expect(resolved.label).toBe("+263 77 123 4567");
  });

  it("cleans tel: labels", () => {
    const resolved = resolveDocumentLink("tel:+263771234567");
    expect(resolved.href).toBe("tel:+263771234567");
    expect(resolved.label).toBe("+263771234567");
  });

  it("strips protocol and www from web labels", () => {
    expect(formatDocumentLinkLabel("https://www.example.com/")).toBe("example.com");
    expect(normalizeDocumentHref("www.example.com")).toBe("https://www.example.com/");
    expect(formatDocumentLinkLabel("example.com")).toBe("example.com");
  });

  it("preserves linkedin and github paths in labels", () => {
    expect(
      formatDocumentLinkLabel("https://www.linkedin.com/in/person/"),
    ).toBe("linkedin.com/in/person");
    expect(formatDocumentLinkLabel("linkedin.com/in/person")).toBe(
      "linkedin.com/in/person",
    );
    expect(formatDocumentLinkLabel("https://github.com/person/repo")).toBe(
      "github.com/person/repo",
    );
  });

  it("supports platform short labels when requested", () => {
    expect(
      formatDocumentLinkLabel("https://www.linkedin.com/in/person", {
        platformHint: "linkedin",
        preferPlatformLabel: true,
      }),
    ).toBe("LinkedIn");
    expect(
      formatDocumentLinkLabel("https://github.com/person", {
        platformHint: "github",
        preferPlatformLabel: true,
      }),
    ).toBe("GitHub");
    expect(
      formatDocumentLinkLabel("https://example.com", {
        platformHint: "portfolio",
        preferPlatformLabel: true,
      }),
    ).toBe("Portfolio");
  });

  it("uses profile handles for GitHub and LinkedIn links", () => {
    expect(
      formatDocumentLinkLabel("https://github.com/KevyKenny", {
        preferProfileLabel: true,
      }),
    ).toBe("KevyKenny");
    expect(
      formatDocumentLinkLabel(
        "https://www.linkedin.com/in/kennedysithole15",
        { preferProfileLabel: true },
      ),
    ).toBe("kennedysithole15");
  });

  it("handles mixed-case schemes", () => {
    expect(normalizeDocumentHref("HTTPS://Example.com")).toBe("https://example.com/");
  });

  it("rejects unsafe schemes", () => {
    const resolved = resolveDocumentLink("javascript:alert(1)");
    expect(resolved.href).toBeNull();
    expect(resolved.kind).toBe("text");
  });

  it("detects link-like custom field values", () => {
    expect(looksLikeLinkValue("github.com/person")).toBe(true);
    expect(looksLikeLinkValue("Class B licence")).toBe(false);
    expect(looksLikeLinkValue("@handle")).toBe(false);
  });

  it("retains paths query strings and fragments in labels", () => {
    expect(formatDocumentLinkLabel("https://example.com/path?q=1#section")).toBe(
      "example.com/path?q=1#section",
    );
  });
});
