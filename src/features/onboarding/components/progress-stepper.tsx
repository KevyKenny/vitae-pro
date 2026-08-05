"use client";

import { cn } from "@/lib/utils";

type ProgressStepperProps = {
  steps: string[];
  currentStep: number;
  className?: string;
};

export function ProgressStepper({
  steps,
  currentStep,
  className,
}: ProgressStepperProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">
          Step {currentStep + 1} of {steps.length}
        </p>
        <p className="text-sm text-ink-faint">{steps[currentStep]}</p>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-paper-dim"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={currentStep + 1}
        aria-label={`Onboarding progress: step ${currentStep + 1} of ${steps.length}`}
      >
        <div
          className="h-full rounded-full bg-emerald transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ol className="mt-4 hidden gap-2 md:flex">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const done = index < currentStep;
          return (
            <li
              key={step}
              className={cn(
                "flex-1 truncate text-center text-[0.7rem] font-medium",
                active && "text-emerald",
                done && "text-ink-soft",
                !active && !done && "text-ink-faint",
              )}
            >
              {step}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
