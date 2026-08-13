"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2, Mail } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { SavedCoverLetterCard } from "@/features/cover-letter/components/saved-cover-letter-card";
import { useCreateCoverLetter } from "@/features/cover-letter/hooks/use-create-cover-letter";
import type { SavedCoverLetterSummary } from "@/features/cover-letter/types";
import {
  coverLetterErrorMessage,
  deleteCoverLetter,
  duplicateCoverLetter,
  listUserCoverLetters,
  renameCoverLetter,
  type CoverLetterListItem,
} from "@/lib/cover-letters";

function mapListItemToSummary(
  item: CoverLetterListItem,
): SavedCoverLetterSummary {
  return {
    id: item.id,
    title: item.title,
    company: item.company,
    role: item.role,
    cvTitle: item.cvTitle,
    templateName: item.templateName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    applicationStatus: item.applicationStatus,
  };
}

export function CoverLettersListView() {
  const router = useRouter();
  const { creating, createAndOpen } = useCreateCoverLetter();
  const [letters, setLetters] = useState<SavedCoverLetterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SavedCoverLetterSummary | null>(
    null,
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const items = await listUserCoverLetters();
      setLetters(items.map(mapListItemToSummary));
    } catch (error) {
      toast.error(
        coverLetterErrorMessage(error, "Could not load your cover letters."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sorted = useMemo(
    () =>
      [...letters].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [letters],
  );

  async function handleDuplicate(letter: SavedCoverLetterSummary) {
    setBusyId(letter.id);
    try {
      const { id } = await duplicateCoverLetter(letter.id);
      toast.success("Cover letter duplicated");
      router.push(`/cover-letter/${id}`);
    } catch (error) {
      toast.error(
        coverLetterErrorMessage(error, "Could not duplicate cover letter."),
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const letter = deleteTarget;
    setDeleteTarget(null);
    setBusyId(letter.id);
    try {
      await deleteCoverLetter(letter.id);
      toast.success("Cover letter deleted");
      await refresh();
    } catch (error) {
      toast.error(
        coverLetterErrorMessage(error, "Could not delete cover letter."),
      );
    } finally {
      setBusyId(null);
    }
  }

  function handleRename(letter: SavedCoverLetterSummary) {
    const next = window.prompt("Rename cover letter", letter.title);
    if (!next?.trim()) return;
    setBusyId(letter.id);
    void renameCoverLetter(letter.id, next.trim())
      .then(async () => {
        toast.success("Renamed");
        await refresh();
      })
      .catch((error) => {
        toast.error(
          coverLetterErrorMessage(error, "Could not rename cover letter."),
        );
      })
      .finally(() => {
        setBusyId(null);
      });
  }

  if (loading) {
    return (
      <PageContainer>
        <AppHeader
          title="Cover Letters"
          description="Personalized letters for each application."
          showNewCv={false}
        />
        <LoadingSkeleton variant="cards" />
      </PageContainer>
    );
  }

  if (letters.length === 0) {
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
          onAction={() => void createAndOpen()}
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
          <Button
            type="button"
            variant="outline"
            shape="soft"
            disabled={creating}
            onClick={() => void createAndOpen()}
          >
            <FilePlus2 className="size-4" />
            {creating ? "Creating…" : "New letter"}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((letter) => (
          <SavedCoverLetterCard
            key={letter.id}
            letter={letter}
            disabled={busyId === letter.id}
            onDuplicate={() => void handleDuplicate(letter)}
            onDelete={() => setDeleteTarget(letter)}
            onRename={() => handleRename(letter)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete cover letter?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => void confirmDelete()}
      />
    </PageContainer>
  );
}
