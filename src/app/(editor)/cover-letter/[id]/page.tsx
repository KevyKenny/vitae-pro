import { CoverLetterProvider } from "@/features/cover-letter/context/cover-letter-context";
import { CoverLetterLayout } from "@/features/cover-letter/components/cover-letter-layout";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CoverLetterEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <CoverLetterProvider letterId={id}>
      <CoverLetterLayout />
    </CoverLetterProvider>
  );
}
