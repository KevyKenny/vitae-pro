"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  Keyboard,
  LayoutTemplate,
  Mail,
  Sparkles,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { KeyboardShortcut } from "@/components/shared/responsive-container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

const GUIDES = [
  {
    title: "Build your first CV",
    description: "Start from a template, then polish with the AI coach.",
    href: "/templates",
    icon: FileText,
  },
  {
    title: "Write a cover letter",
    description: "Paste a job description and generate a tailored draft.",
    href: "/cover-letter",
    icon: Mail,
  },
  {
    title: "Browse templates",
    description: "Customize colors live.",
    href: "/templates",
    icon: LayoutTemplate,
  },
  {
    title: "Tune AI preferences",
    description: "Set tone, assistance level, and career focus.",
    href: "/settings/ai",
    icon: Sparkles,
  },
];

export default function HelpPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Help"
        description="Guides and answers for building with VitatePro."
        actions={
          <Button asChild variant="outline" shape="soft">
            <Link href="/settings">Account settings</Link>
          </Button>
        }
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((guide) => {
          const Icon = guide.icon;
          return (
            <Link
              key={guide.title}
              href={guide.href}
              className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-4 transition-colors hover:border-emerald/40"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-emerald-wash text-emerald">
                <Icon className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {guide.title}
                </span>
                <span className="text-[0.78rem] text-ink-soft">
                  {guide.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <SectionCard title="Keyboard shortcuts">
        <p className="mb-4 text-sm text-ink-soft">
          Press <KeyboardShortcut keys={["?"]} /> anywhere to open the shortcut
          cheat sheet.
        </p>
        <ul className="space-y-2 pb-4 text-sm">
          <li className="flex justify-between gap-3">
            <span className="text-ink-soft">Save</span>
            <KeyboardShortcut keys={["Ctrl", "S"]} />
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-ink-soft">Show shortcuts</span>
            <KeyboardShortcut keys={["?"]} />
          </li>
        </ul>
      </SectionCard>

      <div className="mt-6">
        <EmptyState
          icon={BookOpen}
          title="Need more help?"
          description="Support chat arrives with backend integration. For now, explore settings and the AI preferences to personalize coaching."
          guidance="Tip: open Demo mode with ?demo=1 to showcase a filled workspace."
          actionLabel="Open AI preferences"
          actionHref="/settings/ai"
        />
      </div>
    </PageContainer>
  );
}
