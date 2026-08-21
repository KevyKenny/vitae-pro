"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { JobAnalysisCard } from "@/features/cover-letter/components/job-analysis-card";
import { CvTailorCard } from "@/features/cover-letter/components/cv-tailor-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listUserCvs, type CvListItem } from "@/lib/cvs";
import { cn } from "@/lib/utils";

export function JobInformationForm({
  embedded = false,
}: {
  /** When true (mobile sheet), drop outer chrome so the Sheet owns the chrome. */
  embedded?: boolean;
}) {
  const {
    document,
    updateJob,
    setCvId,
    analyzing,
    analyzeJobDescription,
    generateLetter,
    generating,
    tailorCv,
    cvTailoring,
    cvTailorResult,
    setJobFormOpen,
  } = useCoverLetter();
  const { job } = document;
  const descLen = job.jobDescription.length;
  const [cvs, setCvs] = useState<CvListItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    void listUserCvs()
      .then((items) => {
        if (!cancelled) setCvs(items);
      })
      .catch(() => {
        if (!cancelled) setCvs([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside
      className={cn(
        "min-w-0 bg-surface",
        embedded ? "px-5 py-5 sm:px-7 sm:py-6" : "flex h-full flex-col overflow-y-auto border-r border-line px-4 py-5 sm:px-5 md:px-7 md:py-6",
      )}
    >
      {embedded ? (
        <div className="border-b border-line pb-4">
          <h3 className="font-sans text-[0.92rem] font-semibold text-ink">
            Job details
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Company, role, and posting — used to draft and tailor the letter.
          </p>
        </div>
      ) : (
        <div className="mb-5 sm:mb-6">
          <h1 className="font-serif text-[1.25rem] font-semibold tracking-tight text-ink sm:text-[1.35rem]">
            Cover Letter
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Tell VitatePro about the role — we&apos;ll draft a letter matched to
            it.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-6 pb-8 sm:space-y-7 sm:pb-10">
        <section className="space-y-3">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Company information
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Company name" id="company">
              <Input
                id="company"
                value={job.companyName}
                onChange={(e) => updateJob({ companyName: e.target.value })}
                placeholder="Northwind"
                className="h-11"
              />
            </Field>
            <Field label="Job title" id="title">
              <Input
                id="title"
                value={job.jobTitle}
                onChange={(e) => updateJob({ jobTitle: e.target.value })}
                placeholder="Senior Product Designer"
                className="h-11"
              />
            </Field>
            <Field label="Hiring manager" id="hm">
              <Input
                id="hm"
                value={job.hiringManager}
                onChange={(e) => updateJob({ hiringManager: e.target.value })}
                placeholder="Jordan Ruiz"
                className="h-11"
              />
            </Field>
            <Field label="Company website" id="web">
              <Input
                id="web"
                value={job.companyWebsite}
                onChange={(e) => updateJob({ companyWebsite: e.target.value })}
                placeholder="northwind.design"
                className="h-11"
              />
            </Field>
            <Field label="Company location" id="loc" className="sm:col-span-2">
              <Input
                id="loc"
                value={job.companyLocation}
                onChange={(e) => updateJob({ companyLocation: e.target.value })}
                placeholder="Remote · San Francisco"
                className="h-11"
              />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-2">
            <Label htmlFor="job-description" className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
              Job description
            </Label>
            <span className="text-[0.7rem] text-ink-faint">{descLen} chars</span>
          </div>
          {!job.jobDescription.trim() ? (
            <EmptyState
              icon={FileText}
              title="No job description"
              description="Paste the posting so AI can extract skills, keywords, and expectations."
              className="py-8 sm:py-10"
            />
          ) : null}
          <Textarea
            id="job-description"
            value={job.jobDescription}
            onChange={(e) => updateJob({ jobDescription: e.target.value })}
            placeholder="Paste the job description here..."
            rows={6}
            className="min-h-32 bg-surface text-[0.95rem] sm:min-h-36"
          />
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="h-11 w-full rounded-[8px]"
            disabled={analyzing || !job.jobDescription.trim()}
            onClick={analyzeJobDescription}
          >
            <Sparkles className="size-4" />
            Analyze Job Description
          </Button>
          <JobAnalysisCard analysis={document.analysis} loading={analyzing} />
          {document.cvId ? (
            <>
              <Button
                type="button"
                variant="outline"
                shape="soft"
                className="h-11 w-full rounded-[8px]"
                disabled={
                  cvTailoring || !job.jobDescription.trim() || !document.cvId
                }
                onClick={tailorCv}
              >
                <Sparkles className="size-4" />
                Tailor linked CV to job
              </Button>
              <CvTailorCard result={cvTailorResult} loading={cvTailoring} />
            </>
          ) : null}
        </section>

        <section className="space-y-3">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Associated CV
          </p>
          <Field label="Associated CV" id="associated-cv">
            <Select
              value={document.cvId ?? "none"}
              onValueChange={(value) =>
                setCvId(value === "none" ? null : value)
              }
            >
              <SelectTrigger id="associated-cv" className="h-11 rounded-[8px]">
                <SelectValue placeholder="No CV attached" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No CV attached</SelectItem>
                {cvs.map((cv) => (
                  <SelectItem key={cv.id} value={cv.id}>
                    {cv.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </section>

        <Button
          type="button"
          shape="soft"
          className="h-12 w-full rounded-[10px]"
          disabled={generating}
          onClick={() => {
            generateLetter();
            if (embedded) setJobFormOpen(false);
          }}
        >
          <Sparkles className="size-4" />
          {generating ? "Generating…" : "Generate cover letter"}
        </Button>
      </div>
    </aside>
  );
}

function Field({
  label,
  id,
  children,
  className,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
