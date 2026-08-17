import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DocResolvedLink } from "@/components/document/document-links";
import {
  DocCertificateRow,
  DocNumberedProject,
  DocTechBadges,
} from "@/components/document/templates/entries";

describe("document link rendering", () => {
  it("opens web links in a new tab while retaining the resolved href", () => {
    const markup = renderToStaticMarkup(
      createElement(DocResolvedLink, {
        raw: "https://github.com/KevyKenny",
        preferProfileLabel: true,
      }),
    );

    expect(markup).toContain('href="https://github.com/KevyKenny"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain(">KevyKenny</a>");
  });

  it("renders a credential icon and date without exposing the URL text", () => {
    const markup = renderToStaticMarkup(
      createElement(DocCertificateRow, {
        name: "AWS Certified Solutions Architect",
        provider: "Amazon Web Services",
        date: "Jan 2026",
        credentialUrl: "https://example.com/credentials/aws",
      }),
    );

    expect(markup).toContain("AWS Certified Solutions Architect");
    expect(markup).toContain("Amazon Web Services");
    expect(markup).toContain("Jan 2026");
    expect(markup).toContain('href="https://example.com/credentials/aws"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain("tpl-link-icon");
    expect(markup).not.toContain(">example.com/credentials/aws<");
  });

  it("renders each technology as its own badge and skips blank values", () => {
    const markup = renderToStaticMarkup(
      createElement(DocTechBadges, {
        items: ["Next.js", "  ", "Supabase"],
      }),
    );

    expect(markup).toContain('class="tpl-tech-badges"');
    expect(markup).toContain('class="tpl-tech-badge">Next.js<');
    expect(markup).toContain('class="tpl-tech-badge">Supabase<');
  });

  it("renders nothing when a project has no technologies", () => {
    expect(renderToStaticMarkup(createElement(DocTechBadges, {}))).toBe("");
    expect(
      renderToStaticMarkup(createElement(DocTechBadges, { items: [] })),
    ).toBe("");
  });

  it("keeps project technology badges on the heading line", () => {
    const markup = renderToStaticMarkup(
      createElement(DocNumberedProject, {
        index: 1,
        name: "VitatePro",
        description: "CV builder",
        technologies: ["Next.js", "Supabase"],
        link: "https://example.com/vitatepro",
      }),
    );

    const headingEnd = markup.indexOf("</strong>");
    const badgesStart = markup.indexOf("tpl-tech-badges");
    const descriptionStart = markup.indexOf("CV builder");

    expect(headingEnd).toBeGreaterThan(-1);
    expect(badgesStart).toBeGreaterThan(headingEnd);
    expect(descriptionStart).toBeGreaterThan(badgesStart);
    expect(markup).toContain('href="https://example.com/vitatepro"');
  });
});
