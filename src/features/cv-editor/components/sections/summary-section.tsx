"use client";

import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { RichTextEditor } from "@/features/cv-editor/components/rich-text-editor";
import { useEditor } from "@/features/cv-editor/context/editor-context";

export function SummarySection() {
  const { document, setSummary, requestAi } = useEditor();

  return (
    <EditorSectionCard sectionId="sec_summary" title="Professional Summary">
      <RichTextEditor
        value={document.summary}
        onChange={setSummary}
        onAiAction={(action) => {
          if (
            action === "Improve" ||
            action === "Rewrite" ||
            action === "Make More Professional" ||
            action === "Make More Concise" ||
            action === "Make ATS Friendly" ||
            action === "Generate"
          ) {
            requestAi("summary_improve");
          }
        }}
      />
    </EditorSectionCard>
  );
}
