"use client";

import { Fragment } from "react";

function stripSoftWrapMarks(text: string) {
  return text.replace(/[\u00AD\u200B\u200C\u200D\u2060\uFEFF]/g, "");
}

/** Keep each token intact so a line wraps before a word, never through it. */
export function WholeWords({ text }: { text: string }) {
  const words = stripSoftWrapMarks(text).split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {index > 0 ? " " : null}
          <span className="tpl-whole-word">{word}</span>
        </Fragment>
      ))}
    </>
  );
}
