"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilePlus2, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProgressStepper } from "@/features/onboarding/components/progress-stepper";
import { useCreateCvFlow } from "@/features/cv-creation/hooks/use-create-cv-flow";
import type { CreateCvMethod } from "@/features/cv-creation/types";
import { useUser } from "@/features/auth/hooks/use-auth";
import type { EditorTemplateId } from "@/features/cv-editor/types";
import { parseEditorStyle } from "@/lib/templates/mappers";
import {
  SELECTED_TEMPLATE_STORAGE_KEY,
} from "@/lib/constants/pricing";
import { editorTemplates } from "@/mocks/cv-editor";
import { cn } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

function readStoredTemplate(): EditorTemplateId | undefined {
  try {
    const value = sessionStorage.getItem(SELECTED_TEMPLATE_STORAGE_KEY);
    if (!value) return undefined;
    return parseEditorStyle(value);
  } catch {
    return undefined;
  }
}

function CvCreationPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useUser();
  const { creating, startCreation } = useCreateCvFlow();
  const [targetRole, setTargetRole] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const templateKey = useMemo(() => {
    const fromQuery = searchParams.get("template");
    if (fromQuery) return parseEditorStyle(fromQuery);
    return readStoredTemplate();
  }, [searchParams]);

  const selectedTemplate = editorTemplates.find((t) => t.id === templateKey);

  useEffect(() => {
    if (authLoading) return;
    if (user) return;
    const next = searchParams.get("template")
      ? `/cvs/new?template=${searchParams.get("template")}`
      : "/cvs/new";
    router.replace(`/auth/sign-in?redirect=${encodeURIComponent(next)}`);
  }, [authLoading, router, searchParams, user]);

  async function handleCreate(method: CreateCvMethod) {
    if (method === "import") {
      setImportOpen(true);
      return;
    }

    const { id } = await startCreation({
      method,
      templateKey: templateKey,
      targetRole: targetRole.trim() || undefined,
      targetIndustry: targetIndustry.trim() || undefined,
    });

    if (!id) return;

    try {
      sessionStorage.removeItem(SELECTED_TEMPLATE_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }

    if (method === "guided") {
      router.push(`/cvs/${id}/edit?guided=1`);
    } else {
      router.push(`/cvs/${id}/edit`);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <LoadingSkeleton variant="cards" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <ProgressStepper steps={["Start", "Your CV"]} currentStep={0} />

      <div className="mt-8 rounded-[18px] border border-line bg-surface p-6 shadow-s sm:p-8">
        <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Create your CV
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Tell VitatePro about yourself — we&apos;ll help you turn it into a
          professional CV. No experience yet? Add education, attachment, or
          skills instead.
        </p>
        {selectedTemplate ? (
          <p className="mt-3 rounded-[10px] bg-emerald-wash px-3 py-2 text-sm font-medium text-emerald">
            Template: {selectedTemplate.name}
          </p>
        ) : null}

        <div className="mt-6 space-y-4 rounded-[12px] border border-line bg-paper-dim/40 p-4">
          <p className="text-[0.72rem] font-bold tracking-[0.06em] text-ink-faint uppercase">
            Optional — helps AI & recommendations
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="target-role">Target job title</Label>
              <Input
                id="target-role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="bg-paper"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target-industry">Target industry</Label>
              <Input
                id="target-industry"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                placeholder="e.g. Technology"
                className="bg-paper"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <MethodCard
            recommended
            icon={Sparkles}
            title="Create with VitatePro"
            description="Guided steps for personal info, education, experience, skills, and design."
            cta={creating ? "Creating…" : "Start guided CV"}
            disabled={creating}
            onClick={() => void handleCreate("guided")}
          />
          <MethodCard
            icon={FilePlus2}
            title="Start from scratch"
            description="Jump straight into the full editor with autosave."
            cta={creating ? "Creating…" : "Open editor"}
            disabled={creating}
            onClick={() => void handleCreate("scratch")}
          />
          <MethodCard
            icon={Upload}
            title="Import existing CV"
            description="Upload a PDF or Word file — coming soon."
            cta="Import CV"
            disabled={creating}
            onClick={() => void handleCreate("import")}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          className="mt-6 text-ink-soft"
          onClick={() => router.push("/dashboard")}
        >
          Back to dashboard
        </Button>
      </div>

      <ImportCvDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}

export function CvCreationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
          <LoadingSkeleton variant="cards" />
        </div>
      }
    >
      <CvCreationPageInner />
    </Suspense>
  );
}

function MethodCard({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
  disabled,
  recommended,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  disabled?: boolean;
  recommended?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-4 rounded-[14px] border p-4 text-left transition-colors",
        "border-line bg-surface hover:border-emerald/40 hover:bg-emerald-wash/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
        recommended && "border-emerald/30 bg-emerald-wash/20",
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-paper-dim text-emerald">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-ink">{title}</p>
          {recommended ? (
            <span className="rounded-full bg-emerald px-2 py-0.5 text-[0.68rem] font-semibold text-paper">
              Recommended
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
        <span className="mt-2 inline-block text-sm font-semibold text-emerald">
          {cta} →
        </span>
      </div>
    </button>
  );
}

function ImportCvDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import your CV</DialogTitle>
          <DialogDescription>
            CV import is coming soon. You can start guided creation now and
            paste sections from your existing CV.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="import-note">Paste text from your CV (optional)</Label>
          <Textarea
            id="import-note"
            placeholder="Paste content here to reference while building…"
            className="min-h-28 bg-paper"
            disabled
          />
          <p className="text-xs text-ink-faint">
            Automatic PDF/Word parsing will be added in a future update.
          </p>
          <Button type="button" shape="soft" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
