"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/features/onboarding/components/progress-stepper";
import { CvCompletionPanel } from "@/features/cv-creation/components/cv-completion-panel";
import { GUIDED_CV_STEPS } from "@/features/cv-creation/types";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import type { CvSectionType } from "@/features/cv-editor/types";
import { trackProductEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

const SECTION_ALIASES: Record<string, CvSectionType> = {
  additional: "projects",
};

export function GuidedCvPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guided = searchParams.get("guided") === "1";
  const {
    document,
    setActiveSectionId,
    setPreviewOpen,
    setAnalysisOpen,
    cvId,
  } = useEditor();

  const [stepIndex, setStepIndex] = useState(0);
  const step = GUIDED_CV_STEPS[stepIndex];
  const stepLabels = GUIDED_CV_STEPS.map((s) => s.label);

  if (!guided || !step) return null;

  function goToStep(index: number) {
    const next = GUIDED_CV_STEPS[index];
    if (!next) return;
    setStepIndex(index);

    if (next.id === "template" || next.id === "review") {
      setPreviewOpen(true);
      return;
    }

    const type = next.sectionType
      ? (SECTION_ALIASES[next.id] ?? next.sectionType)
      : null;
    if (type) {
      const section = document.sections.find((s) => s.type === type);
      if (section) setActiveSectionId(section.id);
    }
  }

  function nextStep() {
    if (stepIndex >= GUIDED_CV_STEPS.length - 1) {
      trackProductEvent("cv_guided_completed", {
        documentType: "cv",
        method: "guided",
      });
      router.replace(`/cvs/${cvId}/edit`);
      return;
    }
    goToStep(stepIndex + 1);
  }

  function previousStep() {
    goToStep(Math.max(0, stepIndex - 1));
  }

  function skipStep() {
    nextStep();
  }

  if (step.id === "review") {
    return (
      <div className="border-b border-line bg-emerald-wash/40 px-3 py-3 sm:px-4">
        <ProgressStepper steps={stepLabels} currentStep={stepIndex} />
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <CvCompletionPanel
            onAnalyze={() => setAnalysisOpen(true)}
            onFinish={() => router.replace(`/cvs/${cvId}/edit`)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" shape="soft" onClick={previousStep}>
              <ChevronLeft className="size-4" />
              Back
            </Button>
            <Button type="button" shape="soft" onClick={() => router.replace(`/cvs/${cvId}/edit`)}>
              <CheckCircle2 className="size-4" />
              Finish guided setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-line bg-emerald-wash/40 px-3 py-3 sm:px-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <ProgressStepper steps={stepLabels} currentStep={stepIndex} />
          <p className="mt-2 text-sm font-semibold text-ink">
            Step {stepIndex + 1}: {step.label}
            {step.optional ? (
              <span className="ml-2 text-xs font-normal text-ink-faint">(optional)</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">{step.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="soft"
            disabled={stepIndex === 0}
            onClick={previousStep}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          {step.optional ? (
            <Button type="button" variant="ghost" size="sm" shape="soft" onClick={skipStep}>
              Skip
            </Button>
          ) : null}
          <Button type="button" size="sm" shape="soft" onClick={nextStep}>
            {stepIndex >= GUIDED_CV_STEPS.length - 1 ? "Finish" : "Continue"}
            <ChevronRight className="size-4" />
          </Button>
          <button
            type="button"
            className={cn(
              "text-xs font-semibold text-ink-faint underline-offset-2 hover:text-ink hover:underline",
            )}
            onClick={() => router.replace(`/cvs/${cvId}/edit`)}
          >
            Exit guided mode
          </button>
        </div>
      </div>
    </div>
  );
}
