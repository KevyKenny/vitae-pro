"use client";

import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { RichTextEditor } from "@/features/cv-editor/components/rich-text-editor";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useSectionId } from "@/features/cv-editor/hooks/use-section-id";
import { useSectionSave } from "@/features/cv-editor/hooks/use-section-save";

export function SummarySection() {
  const { document, setSummary, requestAi } = useEditor();
  const sectionId = useSectionId("summary");
  const { dirty, status, onSave } = useSectionSave("summary");

  return (
    <EditorSectionCard sectionId={sectionId} title="Professional Summary">
      <p className="mb-3 text-sm text-ink-soft">
        Write in your own words. Use AI to improve — suggestions never replace
        your text until you accept them.
      </p>
      <RichTextEditor
        value={document.summary}
        onChange={setSummary}
        onAiAction={(action) => {
          void requestAi({ feature: "summary", action });
        }}
      />
      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Summary"
      />
    </EditorSectionCard>
  );
}
