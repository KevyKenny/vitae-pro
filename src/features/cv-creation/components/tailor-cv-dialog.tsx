"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  duplicateCvAsTailored,
  cvErrorMessage,
} from "@/lib/cvs";
import { trackProductEvent } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TailorCvDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceCvId: string;
  defaultJobTitle?: string;
};

export function TailorCvDialog({
  open,
  onOpenChange,
  sourceCvId,
  defaultJobTitle = "",
}: TailorCvDialogProps) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState(defaultJobTitle);
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    if (!jobTitle.trim()) {
      toast.error("Enter a target job title.");
      return;
    }

    setBusy(true);
    try {
      const { id } = await duplicateCvAsTailored(sourceCvId, {
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
      });
      trackProductEvent("cv_tailored", { documentType: "cv", method: "tailored" });
      toast.success("Tailored CV created — your original CV is unchanged.");
      onOpenChange(false);
      router.push(`/cvs/${id}/edit`);
    } catch (error) {
      toast.error(cvErrorMessage(error, "Could not create tailored CV."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a tailored CV</DialogTitle>
          <DialogDescription>
            Duplicate your CV for a specific role. Your master CV stays unchanged.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tailor-job">Target job title</Label>
            <Input
              id="tailor-job"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Graduate Trainee Engineer"
              className="bg-paper"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tailor-company">Company (optional)</Label>
            <Input
              id="tailor-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. ABC Engineering"
              className="bg-paper"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tailor-jd">Job description (optional)</Label>
            <Textarea
              id="tailor-jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste a job description to reference while editing…"
              className="min-h-24 bg-paper"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" shape="soft" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" shape="soft" disabled={busy} onClick={() => void handleCreate()}>
            {busy ? "Creating…" : "Create tailored CV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useTailorCvDialog(sourceCvId: string) {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(() => setOpen(true), []);
  return { open, setOpen, openDialog, sourceCvId };
}
