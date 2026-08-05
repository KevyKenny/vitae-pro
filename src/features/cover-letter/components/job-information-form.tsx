"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCoverLetter } from "@/features/cover-letter/context/cover-letter-context";
import { JobAnalysisCard } from "@/features/cover-letter/components/job-analysis-card";
import { CandidateProfileCard } from "@/features/cover-letter/components/candidate-profile-card";
import { ToneSelector } from "@/features/cover-letter/components/tone-selector";
import { LengthSelector } from "@/features/cover-letter/components/length-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";

export function JobInformationForm() {
  const {
    document,
    updateJob,
    analyzing,
    analyzeJobDescription,
    generateLetter,
    generating,
    setTone,
    setLength,
  } = useCoverLetter();
  const { job } = document;
  const descLen = job.jobDescription.length;

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r border-line bg-paper px-5 py-6 md:px-7">
      <div className="mb-6">
        <h1 className="font-serif text-[1.35rem] font-semibold tracking-tight text-ink">
          Cover Letter
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Tell VitatePro about the role — we&apos;ll draft a letter matched to it.
        </p>
      </div>

      <div className="space-y-7 pb-24 md:pb-10">
        <section className="space-y-3">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Company information
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Company name" id="company">
              <Input
                id="company"
                value={job.companyName}
                onChange={(e) => updateJob({ companyName: e.target.value })}
                placeholder="Northwind"
              />
            </Field>
            <Field label="Job title" id="title">
              <Input
                id="title"
                value={job.jobTitle}
                onChange={(e) => updateJob({ jobTitle: e.target.value })}
                placeholder="Senior Product Designer"
              />
            </Field>
            <Field label="Hiring manager" id="hm">
              <Input
                id="hm"
                value={job.hiringManager}
                onChange={(e) => updateJob({ hiringManager: e.target.value })}
                placeholder="Jordan Ruiz"
              />
            </Field>
            <Field label="Company website" id="web">
              <Input
                id="web"
                value={job.companyWebsite}
                onChange={(e) => updateJob({ companyWebsite: e.target.value })}
                placeholder="northwind.design"
              />
            </Field>
            <Field label="Company location" id="loc" className="sm:col-span-2">
              <Input
                id="loc"
                value={job.companyLocation}
                onChange={(e) => updateJob({ companyLocation: e.target.value })}
                placeholder="Remote · San Francisco"
              />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-2">
            <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
              Job description
            </p>
            <span className="text-[0.7rem] text-ink-faint">{descLen} chars</span>
          </div>
          {!job.jobDescription.trim() ? (
            <EmptyState
              icon={FileText}
              title="No job description"
              description="Paste the posting so AI can extract skills, keywords, and expectations."
              className="py-10"
            />
          ) : null}
          <Textarea
            value={job.jobDescription}
            onChange={(e) => updateJob({ jobDescription: e.target.value })}
            placeholder="Paste the job description here..."
            rows={7}
            className="min-h-36 bg-surface"
          />
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="w-full rounded-[8px]"
            disabled={analyzing || !job.jobDescription.trim()}
            onClick={analyzeJobDescription}
          >
            <Sparkles className="size-4" />
            Analyze Job Description
          </Button>
          <JobAnalysisCard analysis={document.analysis} loading={analyzing} />
        </section>

        <section className="space-y-3">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Candidate information
          </p>
          <CandidateProfileCard />
        </section>

        <section className="space-y-3">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Tone
          </p>
          <ToneSelector value={document.tone} onChange={setTone} />
        </section>

        <section className="space-y-3">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Length
          </p>
          <LengthSelector value={document.length} onChange={setLength} />
        </section>

        <Button
          type="button"
          shape="soft"
          className="w-full rounded-full"
          disabled={generating}
          onClick={generateLetter}
        >
          <Sparkles className="size-4" />
          {generating ? "Generating…" : "Generate with AI"}
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
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5">
        {label}
      </Label>
      {children}
    </div>
  );
}
