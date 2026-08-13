"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Copy,
  Download,
  FilePlus2,
  FileText,
  MoreHorizontal,
  Pencil,
  Scissors,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateCv } from "@/features/cv-editor/hooks/use-create-cv";
import { TailorCvDialog } from "@/features/cv-creation/components/tailor-cv-dialog";
import { useCvExport } from "@/features/export/hooks/use-cv-export";
import {
  archiveCv,
  cvErrorMessage,
  deleteCv,
  duplicateCv,
  listUserCvs,
  setDefaultCv,
  type CvListItem,
} from "@/lib/cvs";
import { formatRelativeTime } from "@/lib/utils";

export default function CvsPage() {
  const router = useRouter();
  const { creating, createAndOpen } = useCreateCv();
  const { downloadCvPdf } = useCvExport();
  const [items, setItems] = useState<CvListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CvListItem | null>(null);
  const [tailorTarget, setTailorTarget] = useState<CvListItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const cvs = await listUserCvs();
      setItems(cvs);
    } catch (error) {
      toast.error(cvErrorMessage(error, "Could not load your CVs."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleDuplicate(cv: CvListItem) {
    setBusyId(cv.id);
    try {
      const { id } = await duplicateCv(cv.id);
      toast.success("CV duplicated");
      router.push(`/cvs/${id}/edit`);
    } catch (error) {
      toast.error(cvErrorMessage(error, "Could not duplicate CV."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDefault(cv: CvListItem) {
    setBusyId(cv.id);
    try {
      await setDefaultCv(cv.id);
      toast.success("Default CV updated");
      await refresh();
    } catch (error) {
      toast.error(cvErrorMessage(error, "Could not set default CV."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleArchive(cv: CvListItem) {
    setBusyId(cv.id);
    try {
      await archiveCv(cv.id);
      toast.success("CV archived");
      await refresh();
    } catch (error) {
      toast.error(cvErrorMessage(error, "Could not archive CV."));
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const cv = deleteTarget;
    setDeleteTarget(null);
    setBusyId(cv.id);
    try {
      await deleteCv(cv.id);
      toast.success("CV deleted");
      await refresh();
    } catch (error) {
      toast.error(cvErrorMessage(error, "Could not delete CV."));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <AppHeader title="My CVs" description="Create and manage your documents." />
        <LoadingSkeleton variant="list" />
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer>
        <AppHeader title="My CVs" description="Create and manage your documents." />
        <EmptyState
          icon={FileText}
          title="No CV created"
          description="Start with a blank document prefilled from your profile."
          actionLabel={creating ? "Creating…" : "Create New CV"}
          onAction={() => void createAndOpen()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AppHeader
        title="My CVs"
        description="Open a document to continue editing."
        actions={
          <Button
            type="button"
            variant="outline"
            shape="soft"
            disabled={creating}
            onClick={() => void createAndOpen()}
          >
            <FilePlus2 className="size-4" />
            {creating ? "Creating…" : "New CV"}
          </Button>
        }
        showNewCv={false}
      />
      <SectionCard title="All documents">
        <ul className="divide-y divide-line pb-2">
          {items.map((cv) => (
            <li
              key={cv.id}
              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{cv.title}</p>
                  {cv.isDefault ? <Badge variant="gold">Default</Badge> : null}
                  <Badge variant="outline">{cv.status}</Badge>
                  <Badge variant="outline">{cv.completion ?? 0}%</Badge>
                  {cv.score != null ? (
                    <Badge variant="default">{cv.score}/100</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-ink-faint">
                  {cv.templateName}
                  {cv.targetRole ? ` · ${cv.targetRole}` : ""} · Edited{" "}
                  {formatRelativeTime(cv.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  shape="soft"
                  className="w-full rounded-[8px] sm:w-auto"
                >
                  <Link href={`/cvs/${cv.id}/edit`}>Continue</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      shape="soft"
                      disabled={busyId === cv.id}
                      aria-label={`Actions for ${cv.title}`}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/cvs/${cv.id}/edit`}>
                        <Pencil className="size-4" />
                        Open
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void handleDuplicate(cv)}>
                      <Copy className="size-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void downloadCvPdf(cv.id)}>
                      <Download className="size-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTailorTarget(cv)}>
                      <Scissors className="size-4" />
                      Create tailored CV
                    </DropdownMenuItem>
                    {!cv.isDefault ? (
                      <DropdownMenuItem onClick={() => void handleDefault(cv)}>
                        <Star className="size-4" />
                        Set as default
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onClick={() => void handleArchive(cv)}>
                      <Archive className="size-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteTarget(cv)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete this CV?"
        description="This action cannot be undone. All sections and content for this CV will be permanently removed."
        confirmLabel="Delete"
        destructive
        onConfirm={() => void confirmDelete()}
      />

      {tailorTarget ? (
        <TailorCvDialog
          open={Boolean(tailorTarget)}
          onOpenChange={(open) => {
            if (!open) setTailorTarget(null);
          }}
          sourceCvId={tailorTarget.id}
          defaultJobTitle={tailorTarget.targetRole ?? ""}
        />
      ) : null}
    </PageContainer>
  );
}
