"use client";

import Link from "next/link";
import { Sparkles, FileText, Mail, Settings2 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAISuggestions } from "@/mocks";
import { useDemoMode } from "@/features/demo/demo-mode-context";

export default function AiAssistantPage() {
  const { isDemo, enableDemo } = useDemoMode();

  return (
    <PageContainer>
      <PageHeader
        title="AI Assistant"
        description="Your career coach surfaces across the CV and cover letter editors. This hub lists active suggestions."
        actions={
          <div className="flex flex-wrap gap-2">
            {!isDemo ? (
              <Button type="button" variant="outline" shape="soft" onClick={enableDemo}>
                Enter demo mode
              </Button>
            ) : (
              <Badge variant="gold">Demo active</Badge>
            )}
            <Button asChild shape="soft">
              <Link href="/cvs/cv_1/edit">
                <Sparkles className="size-4" />
                Open CV editor
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <QuickLink href="/cvs/cv_1/edit" icon={FileText} label="Improve CV" />
        <QuickLink href="/cover-letter" icon={Mail} label="Cover letter AI" />
        <QuickLink href="/settings/ai" icon={Settings2} label="AI preferences" />
      </div>

      <SectionCard title="Active suggestions">
        <ul className="divide-y divide-line pb-2">
          {mockAISuggestions.map((s) => (
            <li key={s.id} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{s.title}</p>
                  <Badge variant="outline">{s.section}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{s.body}</p>
              </div>
              <Button asChild size="sm" shape="soft" variant="outline" className="rounded-[8px]">
                <Link href="/cvs/cv_1/edit">{s.ctaLabel}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageContainer>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FileText;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[14px] border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-emerald/40"
    >
      <span className="flex size-8 items-center justify-center rounded-[8px] bg-emerald-wash text-emerald">
        <Icon className="size-4" aria-hidden />
      </span>
      {label}
    </Link>
  );
}
