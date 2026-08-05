import { EditorProvider } from "@/features/cv-editor/context/editor-context";
import { CVEditorLayout } from "@/features/cv-editor/components/cv-editor-layout";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CvEditorPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <EditorProvider cvId={id}>
      <CVEditorLayout />
    </EditorProvider>
  );
}
