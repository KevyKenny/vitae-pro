"use client";

import type { CoverLetterDocument } from "@/features/cover-letter/types";
import { CvPage } from "@/components/document/cv-page";
import { DocumentReadyMarker } from "@/components/document/document-ready";
import { BlockMeasureLayer } from "@/components/document/pagination/block-measure-layer";
import { packBlocks, toPageModels } from "@/components/document/pagination/pack";
import type { ContentBlock } from "@/components/document/pagination/types";
import { contentHeightBudget } from "@/components/document/page-geometry";
import type { CoverLetterDocumentViewProps } from "@/components/document/types";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";

function buildCoverLetterBlocks(document: CoverLetterDocument): ContentBlock[] {
  const { body } = document;
  const paragraphs = [
    body.greeting,
    body.opening,
    body.experience,
    body.skills,
    body.closing,
    body.signature,
  ]
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks: ContentBlock[] = [];
  let seq = 0;

  blocks.push({
    id: `cl-header-${seq++}`,
    kind: "header",
    height: 0,
    render: () => (
      <header
        className={
          document.templateId === "modern"
            ? "doc-cl-header doc-cl-header--modern"
            : "doc-cl-header"
        }
      >
        <p className="doc-cl-name">{body.headerName}</p>
        <p className="doc-cl-meta">{body.headerMeta}</p>
        {body.date ? <p className="doc-cl-date">{body.date}</p> : null}
      </header>
    ),
  });

  paragraphs.forEach((paragraph) => {
    blocks.push({
      id: `cl-p-${seq++}`,
      kind: "paragraph",
      height: 0,
      render: () => (
        <p className="doc-cl-body whitespace-pre-wrap">{paragraph}</p>
      ),
    });
  });

  return blocks;
}

export function CoverLetterDocumentView({
  document,
  mode = "preview",
  pageSize = "a4",
  className,
  style,
}: CoverLetterDocumentViewProps) {
  const blocks = useMemo(() => buildCoverLetterBlocks(document), [document]);
  const contentHeight = contentHeightBudget(pageSize, 36);
  const [heights, setHeights] = useState<Map<string, number>>(new Map());
  const [measuredContentHeight, setMeasuredContentHeight] = useState(contentHeight);
  const [ready, setReady] = useState(false);

  const handleMeasured = useCallback(
    (next: Map<string, number>, budget: number) => {
      setHeights(next);
      setMeasuredContentHeight(budget || contentHeight);
      setReady(true);
    },
    [contentHeight],
  );

  const pages = useMemo(() => {
    if (!ready) return [{ index: 0, blockIds: blocks.map((b) => b.id) }];
    const measured = blocks.map((b) => ({
      id: b.id,
      height: heights.get(b.id) ?? 0,
    }));
    return toPageModels(packBlocks(measured, { contentHeight: measuredContentHeight }));
  }, [blocks, heights, measuredContentHeight, ready]);

  const blockMap = useMemo(() => new Map(blocks.map((b) => [b.id, b])), [blocks]);

  return (
    <div
      className={cn(
        "doc-root",
        mode === "print" && "doc-root--print",
        pageSize === "a4" ? "doc-root--a4" : "doc-root--letter",
        className,
      )}
      style={style}
      data-document-pages={pages.length}
    >
      <BlockMeasureLayer
        blocks={blocks}
        pageSize={pageSize}
        cssVars={{}}
        onMeasured={handleMeasured}
      />
      <div className="doc-pages-stack">
        {pages.map((page) => (
          <CvPage
            key={page.index}
            pageIndex={page.index}
            pageCount={pages.length}
            pageSize={pageSize}
        templateId={document.templateId}
            mode={mode}
            className={cn(
              document.templateId === "creative" && "doc-template-creative",
              document.templateId === "executive" && "doc-template-executive",
            )}
          >
            {page.blockIds.map((id) => {
              const block = blockMap.get(id);
              return block ? (
                <div key={id} data-block-id={id}>
                  {block.render()}
                </div>
              ) : null;
            })}
          </CvPage>
        ))}
      </div>
      <DocumentReadyMarker ready={ready} />
    </div>
  );
}
