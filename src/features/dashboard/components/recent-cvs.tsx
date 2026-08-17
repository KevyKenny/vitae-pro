"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Archive,
  Copy,
  Download,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useCreateCv } from "@/features/cv-editor/hooks/use-create-cv";
import { usePaidCvDownload } from "@/features/export/hooks/use-paid-cv-download";
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

export function RecentCvs() {
  const router = useRouter();
  const { creating, createAndOpen } = useCreateCv();
  const { requestDownload, paymentDialog } = usePaidCvDownload();
  const [items, setItems] = useState<CvListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CvListItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const cvs = await listUserCvs();
      setItems(cvs.slice(0, 5));
    } catch (error) {
      toast.error(cvErrorMessage(error, "Could not load recent CVs."));
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
    return <LoadingSkeleton variant="list" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Let's create your CV"
        description="Start with your experience, education, or skills. VitatePro will help you turn your information into a professional CV."
        actionLabel={creating ? "Opening…" : "Create my CV"}
        onAction={() => void createAndOpen()}
      />
    );
  }

  return (
    <>
      <SectionCard
        title="Recent CVs"
        action={
          <Link
            href="/cvs"
            className="text-[0.8rem] font-semibold text-emerald hover:underline"
          >
            View all →
          </Link>
        }
      >
        <ul className="divide-y divide-line pb-2">
          {items.map((cv) => (
            <motion.li
              key={cv.id}
              whileHover={{ backgroundColor: "var(--paper-dim)" }}
              className="-mx-2 rounded-[10px] px-2"
            >
              <div className="flex items-center gap-3.5 py-3.5">
                <div
                  className="relative h-[50px] w-[38px] shrink-0 overflow-hidden rounded-[5px] border border-line bg-paper-dim"
                  aria-hidden
                >
                  <span className="absolute top-2 right-1.5 left-1.5 h-0.5 rounded bg-emerald/50" />
                  <span className="absolute top-4 right-2 left-1.5 h-0.5 rounded bg-line-strong" />
                  <span className="absolute top-6 right-3 left-1.5 h-0.5 rounded bg-line-strong" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[0.9rem] font-semibold text-ink">
                      {cv.title}
                    </p>
                    {cv.isDefault ? (
                      <Badge variant="gold">Default</Badge>
                    ) : null}
                    <Badge variant="outline">{cv.completion ?? 0}%</Badge>
                    <Badge variant="outline">{cv.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-[0.78rem] text-ink-faint">
                    Edited {formatRelativeTime(cv.updatedAt)} · {cv.templateName}
                    {cv.targetRole ? ` · ${cv.targetRole}` : ""}
                  </p>
                </div>
                {cv.score != null ? (
                  <span className="hidden rounded-[6px] bg-emerald-wash px-2.5 py-1 font-mono text-[0.85rem] text-emerald sm:inline">
                    {cv.score}
                  </span>
                ) : null}
                <Button asChild size="sm" shape="soft" variant="outline">
                  <Link href={`/cvs/${cv.id}/edit`}>
                    {(cv.completion ?? 0) >= 80 ? "Open" : "Continue"}
                  </Link>
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
                        Continue
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void handleDuplicate(cv)}>
                      <Copy className="size-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => requestDownload(cv.id)}>
                      <Download className="size-4" />
                      Download PDF
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
            </motion.li>
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
      {paymentDialog}
    </>
  );
}
