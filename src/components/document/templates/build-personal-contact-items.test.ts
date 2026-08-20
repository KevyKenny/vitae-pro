import { describe, expect, it } from "vitest";
import { buildPersonalContactItems } from "@/components/document/templates/primitives";
import type { PersonalInfo } from "@/features/cv-editor/types";

function basePersonal(overrides: Partial<PersonalInfo> = {}): PersonalInfo {
  return {
    givenName: "Test",
    familyName: "User",
    fullName: "Test User",
    title: "",
    useAsHeadline: true,
    email: "",
    phone: "",
    address: "",
    postCode: "",
    city: "",
    location: "",
    driversLicense: "",
    linkedin: "",
    portfolio: "",
    socialLinks: [],
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    nationality: "",
    civilStatus: "",
    customFields: [],
    fieldVisibility: {},
    ...overrides,
  };
}

describe("buildPersonalContactItems", () => {
  it("uses profile handles for GitHub and clean labels for other social links", () => {
    const items = buildPersonalContactItems(
      basePersonal({
        socialLinks: ["https://github.com/KevyKenny", "dribbble.com/kennedy"],
      }),
    );

    expect(
      items.some(
        (item) => item.label === "KevyKenny" && item.platform === "github",
      ),
    ).toBe(true);
    expect(items.some((item) => item.label === "dribbble.com/kennedy")).toBe(true);
  });

  it("uses a hostname for website and profile handle for LinkedIn", () => {
    const items = buildPersonalContactItems(
      basePersonal({
        portfolio: "https://kennedy-sithole-portfolio.vercel.app",
        linkedin: "https://www.linkedin.com/in/kennedysithole15",
      }),
    );

    expect(
      items.find(
        (item) =>
          item.label === "kennedy-sithole-portfolio.vercel.app" &&
          item.platform === "website",
      )?.href,
    ).toBe(
      "https://kennedy-sithole-portfolio.vercel.app/",
    );
    expect(
      items.find(
        (item) =>
          item.label === "kennedysithole15" &&
          item.platform === "linkedin",
      )?.href,
    ).toBe(
      "https://www.linkedin.com/in/kennedysithole15",
    );
  });

  it("keeps only one GitHub and one LinkedIn profile", () => {
    const items = buildPersonalContactItems(
      basePersonal({
        linkedin: "https://linkedin.com/in/primary",
        socialLinks: [
          "https://linkedin.com/in/duplicate",
          "https://github.com/primary",
          "https://github.com/duplicate",
        ],
      }),
    );

    expect(items.filter((item) => item.platform === "linkedin")).toHaveLength(1);
    expect(items.filter((item) => item.platform === "github")).toHaveLength(1);
  });

  it("links custom fields when values look like URLs", () => {
    const items = buildPersonalContactItems(
      basePersonal({
        customFields: [{ id: "1", label: "Blog", value: "https://blog.example.com" }],
      }),
    );

    const blog = items.find((item) => item.fieldLabel === "Blog");
    expect(blog?.label).toBe("blog.example.com");
    expect(blog?.href).toBe("https://blog.example.com/");
  });
});
