"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilePlus2, Mail } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SavedCoverLetterCard } from "@/features/cover-letter/components/saved-cover-letter-card";
import { mockSavedCoverLetters } from "@/mocks/cover-letter-builder";
import type { SavedCoverLetterSummary } from "@/features/cover-letter/types";
import { toast } from "sonner";

export function CoverLettersListView() {
  const [letters, setLetters] = useState<SavedCoverLetterSummary[]>(
    mockSavedCoverLetters,
  );

  const empty = letters.length === 0;
  const sorted = useMemo(
    () =>
      [...letters].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [letters],
  );

  if (empty) {
    return (
      <PageContainer>
        <AppHeader
          title="Cover Letters"
          description="Personalized letters for each application."
          showNewCv={false}
        />
        <EmptyState
          icon={Mail}
          title="No cover letters"
          description="Create a tailored letter from your CV and a job posting."
          actionLabel="Create cover letter"
          onAction={() => {
            window.location.href = "/cover-letter";
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AppHeader
        title="Cover Letters"
        description="Manage drafts and track application status."
        showNewCv={false}
        actions={
          <Button asChild variant="outline" shape="soft">
            <Link href="/cover-letter">
              <FilePlus2 className="size-4" />
              New letter
            </Link>
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No saved applications"
          description="Your application tracker will appear here."
          actionLabel="Start writing"
          onAction={() => {
            window.location.href = "/cover-letter";
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((letter) => (
            <SavedCoverLetterCard
              key={letter.id}
              letter={letter}
              onDuplicate={() => {
                setLetters((prev) => [
                  {
                    ...letter,
                    id: `cl_${Date.now()}`,
                    title: `${letter.title} (copy)`,
                    applicationStatus: "draft",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                  ...prev,
                ]);
                toast.success("Duplicated");
              }}
              onDelete={() => {
                setLetters((prev) => prev.filter((l) => l.id !== letter.id));
                toast.success("Deleted");
              }}
              onRename={() => {
                const next = window.prompt("Rename cover letter", letter.title);
                if (!next?.trim()) return;
                setLetters((prev) =>
                  prev.map((l) =>
                    l.id === letter.id ? { ...l, title: next.trim() } : l,
                  ),
                );
                toast.success("Renamed");
              }}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
