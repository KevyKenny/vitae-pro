import { describe, expect, it } from "vitest";
import { packBlocks, toPageModels } from "@/components/document/pagination/pack";
import {
  packBlocksByRegion,
  regionBlockIdsForPage,
} from "@/components/document/pagination/pack-regions";
import { contentHeightBudget } from "@/components/document/page-geometry";
import type { ContentBlock } from "@/components/document/pagination/types";
import { getTemplateDefinition, resolveRendererKey } from "@/lib/templates/definitions";
import { isTemplateRendererKey } from "@/lib/templates/definitions/types";
import { kennedySitholeReferenceFixture } from "@/lib/templates/reference/kennedy-sithole.fixture";
import { resolveCvDocumentStyle } from "@/components/document/resolve-document-style";

describe("packBlocks", () => {
  const budget = contentHeightBudget("a4", 36);

  it("returns one page for empty input", () => {
    expect(packBlocks([], { contentHeight: budget })).toEqual([[]]);
  });

  it("keeps small blocks on one page", () => {
    const pages = packBlocks(
      [
        { id: "a", height: 40 },
        { id: "b", height: 50 },
      ],
      { contentHeight: budget },
    );
    expect(pages).toEqual([["a", "b"]]);
  });

  it("splits when content exceeds page budget", () => {
    const pages = packBlocks(
      [
        { id: "a", height: budget - 20 },
        { id: "b", height: 40 },
      ],
      { contentHeight: budget },
    );
    expect(pages).toEqual([["a"], ["b"]]);
  });

  it("places oversized block alone on a page", () => {
    const pages = packBlocks(
      [{ id: "tall", height: budget + 100 }],
      { contentHeight: budget },
    );
    expect(pages).toEqual([["tall"]]);
  });

  it("reserves space on the last page when requested", () => {
    const pages = packBlocks(
      [
        { id: "a", height: budget - 30 },
        { id: "b", height: 40 },
      ],
      { contentHeight: budget, lastPageReserve: 40 },
    );
    expect(pages).toEqual([["a"], ["b"]]);
  });

  it("maps to page models with indexes", () => {
    const models = toPageModels([["a"], ["b", "c"]]);
    expect(models).toEqual([
      { index: 0, blockIds: ["a"] },
      { index: 1, blockIds: ["b", "c"] },
    ]);
  });
});

describe("packBlocksByRegion", () => {
  const budget = contentHeightBudget("a4", 36);

  it("packs main region independently", () => {
    const blocks: ContentBlock[] = [
      {
        id: "a",
        kind: "paragraph",
        height: 40,
        region: "main",
        render: () => null,
      },
      {
        id: "b",
        kind: "paragraph",
        height: budget,
        region: "main",
        render: () => null,
      },
    ];

    const { regionPages, pageCount } = packBlocksByRegion(blocks, budget, [
      "main",
    ]);
    expect(pageCount).toBeGreaterThanOrEqual(2);
    expect(regionPages.get("main")?.length).toBeGreaterThanOrEqual(2);
  });

  it("leaves a short region empty on later pages instead of repeating it", () => {
    const blocks: ContentBlock[] = [
      {
        id: "rail",
        kind: "paragraph",
        height: 60,
        region: "sidebar",
        render: () => null,
      },
      {
        id: "main-1",
        kind: "paragraph",
        height: budget,
        region: "main",
        render: () => null,
      },
      {
        id: "main-2",
        kind: "paragraph",
        height: 80,
        region: "main",
        render: () => null,
      },
    ];

    const { regionPages, pageCount } = packBlocksByRegion(blocks, budget, [
      "main",
      "sidebar",
    ]);

    expect(pageCount).toBe(2);
    expect(regionBlockIdsForPage(regionPages, "sidebar", 0)).toEqual(["rail"]);
    expect(regionBlockIdsForPage(regionPages, "sidebar", 1)).toEqual([]);
  });
});

describe("template registry", () => {
  it("resolves renderer keys from slug and legacy ids", () => {
    expect(resolveRendererKey({ templateSlug: "tpl_2" })).toBe("tpl_2");
    expect(resolveRendererKey({ legacyTemplateId: "modern" })).toBe("tpl_default");
    expect(isTemplateRendererKey("tpl_5")).toBe(true);
    expect(isTemplateRendererKey("modern")).toBe(false);
  });

  it("has seven active definitions", () => {
    expect([
      "tpl_default",
      "tpl_0",
      "tpl_1",
      "tpl_2",
      "tpl_3",
      "tpl_4",
      "tpl_5",
    ]).toHaveLength(7);
  });
});

describe("template definitions", () => {
  it("build blocks for all seven templates using reference fixture", () => {
    for (const key of [
      "tpl_default",
      "tpl_0",
      "tpl_1",
      "tpl_2",
      "tpl_3",
      "tpl_4",
      "tpl_5",
    ] as const) {
      const definition = getTemplateDefinition(key);
      const resolved = resolveCvDocumentStyle(
        "modern",
        definition.defaultCustomization,
        "a4",
        definition,
      );
      const blocks = definition.buildBlocks(kennedySitholeReferenceFixture, {
        document: kennedySitholeReferenceFixture,
        resolved,
        customization: definition.defaultCustomization,
        pageSize: "a4",
        mode: "preview",
      });
      expect(blocks.length).toBeGreaterThan(0);
    }
  });

  it("emits per-bullet experience blocks and splittable education rows", () => {
    const definition = getTemplateDefinition("tpl_default");
    const resolved = resolveCvDocumentStyle(
      "modern",
      definition.defaultCustomization,
      "a4",
      definition,
    );
    const doc = {
      ...kennedySitholeReferenceFixture,
      experience: kennedySitholeReferenceFixture.experience.map((entry, index) =>
        index === 0
          ? {
              ...entry,
              responsibilities: [
                "First responsibility",
                "Second responsibility",
                "Third responsibility",
              ],
            }
          : entry,
      ),
      education: [
        {
          id: "edu-o-level",
          qualificationType: "o-level" as const,
          examinationBoard: "zimsec" as const,
          examinationBoardOther: "",
          schoolName: "Test High School",
          yearCompleted: "2018",
          candidateNumber: "12345",
          subjects: [
            { id: "s1", name: "Mathematics", grade: "A" },
            { id: "s2", name: "English", grade: "B" },
            { id: "s3", name: "Physics", grade: "A" },
          ],
        },
        ...kennedySitholeReferenceFixture.education,
      ],
    };
    const blocks = definition.buildBlocks(doc, {
      document: doc,
      resolved,
      customization: definition.defaultCustomization,
      pageSize: "a4",
      mode: "preview",
    });

    const bulletBlocks = blocks.filter((block) => block.kind === "experience-bullet");
    expect(bulletBlocks.length).toBeGreaterThanOrEqual(3);
    expect(blocks.some((block) => block.kind === "education-table-header")).toBe(
      true,
    );
    expect(blocks.some((block) => block.kind === "education-table-row")).toBe(true);
  });

  it("packs Professional exam subjects two-up without a table header", () => {
    const definition = getTemplateDefinition("tpl_1");
    const resolved = resolveCvDocumentStyle(
      "professional",
      definition.defaultCustomization,
      "a4",
      definition,
    );
    const doc = {
      ...kennedySitholeReferenceFixture,
      rendererKey: "tpl_1" as const,
      education: [
        {
          id: "edu-o-level",
          qualificationType: "o-level" as const,
          examinationBoard: "zimsec" as const,
          examinationBoardOther: "",
          schoolName: "Test High School",
          yearCompleted: "2018",
          candidateNumber: "",
          subjects: [
            { id: "s1", name: "Mathematics", grade: "A" },
            { id: "s2", name: "English", grade: "B" },
            { id: "s3", name: "Physics", grade: "A" },
            { id: "s4", name: "History", grade: "C" },
          ],
        },
      ],
    };
    const blocks = definition.buildBlocks(doc, {
      document: doc,
      resolved,
      customization: definition.defaultCustomization,
      pageSize: "a4",
      mode: "preview",
    });

    expect(blocks.some((block) => block.kind === "education-table-header")).toBe(
      false,
    );
    expect(
      blocks.filter((block) => block.kind === "education-table-row"),
    ).toHaveLength(2);
  });

  it("measures single-column headers and form personal details as blocks", () => {
    for (const key of ["tpl_2", "tpl_3", "tpl_5"] as const) {
      const definition = getTemplateDefinition(key);
      const resolved = resolveCvDocumentStyle(
        "modern",
        definition.defaultCustomization,
        "a4",
        definition,
      );
      const blocks = definition.buildBlocks(kennedySitholeReferenceFixture, {
        document: kennedySitholeReferenceFixture,
        resolved,
        customization: definition.defaultCustomization,
        pageSize: "a4",
        mode: "preview",
      });

      expect(blocks.some((block) => block.kind === "header")).toBe(true);
      expect(blocks.some((block) => block.region === "left")).toBe(false);
    }
  });
});
