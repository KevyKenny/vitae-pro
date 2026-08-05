"use client";

import Link from "next/link";
import { FilePlus2, FileText } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import { mockCVs } from "@/mocks";
import { formatRelativeTime } from "@/lib/utils";

export default function CvsPage() {
  if (mockCVs.length === 0) {
    return (
      <PageContainer>
        <AppHeader title="My CVs" description="Create and manage your documents." />
        <EmptyState
          icon={FileText}
          title="No CV created"
          description="Start with a template and an AI coach at your shoulder."
          actionLabel="Create New CV"
          onAction={() => {
            window.location.href = "/cvs/cv_1/edit";
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AppHeader
        title="My CVs"
        description="Open a document to continue editing with AI."
        actions={
          <Button asChild variant="outline" shape="soft">
            <Link href="/cvs/cv_1/edit">
              <FilePlus2 className="size-4" />
              New CV
            </Link>
          </Button>
        }
        showNewCv={false}
      />
      <SectionCard title="All documents">
        <ul className="divide-y divide-line pb-2">
          {mockCVs.map((cv) => (
            <li
              key={cv.id}
              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{cv.title}</p>
                  <Badge variant="outline">{cv.completion}%</Badge>
                  <Badge variant="default">{cv.score}/100</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-faint">
                  {cv.templateName} · Edited {formatRelativeTime(cv.updatedAt)}
                </p>
              </div>
              <Button asChild shape="soft" className="rounded-[8px]">
                <Link href={`/cvs/${cv.id}/edit`}>Continue</Link>
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageContainer>
  );
}
