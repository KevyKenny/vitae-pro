import { CoverLetterProvider } from "@/features/cover-letter/context/cover-letter-context";
import { CoverLetterLayout } from "@/features/cover-letter/components/cover-letter-layout";

export default function CoverLetterNewPage() {
  return (
    <CoverLetterProvider letterId="new">
      <CoverLetterLayout />
    </CoverLetterProvider>
  );
}
