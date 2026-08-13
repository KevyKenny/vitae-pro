import { Suspense } from "react";
import { EditorProvider } from "@/features/cv-editor/context/editor-context";
import { CVEditorLayout } from "@/features/cv-editor/components/cv-editor-layout";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CvEditorPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <EditorProvider cvId={id}>
      <Suspense fallback={<LoadingSkeleton variant="editor" />}>
        <CVEditorLayout />
      </Suspense>
    </EditorProvider>
  );
}
