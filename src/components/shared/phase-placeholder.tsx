import { Construction } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/shared/empty-state";

type PhasePlaceholderProps = {
  title: string;
  description?: string;
  phaseNote?: string;
};

/** Temporary shell page used until business UI is implemented in later phases. */
export function PhasePlaceholder({
  title,
  description,
  phaseNote = "This screen will be implemented in a later phase. The app shell, navigation, and design system are ready.",
}: PhasePlaceholderProps) {
  return (
    <PageContainer>
      <AppHeader title={title} description={description} />
      <EmptyState
        icon={Construction}
        title="Coming in a later phase"
        description={phaseNote}
      />
    </PageContainer>
  );
}
