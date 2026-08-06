"use client";

import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import {
  BackToTop,
  ReadingProgress,
} from "@/features/public/components/reading-progress";
import { PublicHero } from "@/features/public/components/public-hero";
import { ContentNavigation } from "@/features/public/components/content-navigation";
import type { LegalTocItem } from "@/mocks/public-pages";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { useState } from "react";

export function PublicPageLayout({
  title,
  subtitle,
  description,
  breadcrumbs,
  readingMinutes,
  lastUpdated,
  toc,
  centered = false,
  children,
}: {
  title: string;
  subtitle: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  readingMinutes?: number;
  lastUpdated?: string;
  toc?: LegalTocItem[];
  centered?: boolean;
  children: React.ReactNode;
}) {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <ReadingProgress />
      <LandingNavbar />
      <PublicHero
        title={title}
        subtitle={subtitle}
        description={description}
        breadcrumbs={breadcrumbs}
        readingMinutes={readingMinutes}
        lastUpdated={lastUpdated}
        centered={centered}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {toc?.length ? (
          <div className="mb-4 lg:hidden">
            <Button
              type="button"
              variant="outline"
              shape="soft"
              className="rounded-[8px]"
              onClick={() => setTocOpen(true)}
            >
              <List className="size-4" />
              On this page
            </Button>
          </div>
        ) : null}

        <div
          className={
            toc?.length
              ? "grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]"
              : centered
                ? "mx-auto w-full max-w-3xl"
                : "max-w-3xl"
          }
        >
          {toc?.length ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-[14px] border border-line bg-surface p-4 shadow-s">
                <ContentNavigation items={toc} />
              </div>
            </aside>
          ) : null}
          <div className="min-w-0 space-y-10">{children}</div>
        </div>
      </div>

      <LandingFooter />
      <BackToTop />

      {toc?.length ? (
        <Sheet open={tocOpen} onOpenChange={setTocOpen}>
          <SheetContent side="left" className="w-[min(100%,320px)] p-5">
            <SheetHeader>
              <SheetTitle className="font-serif text-left">On this page</SheetTitle>
            </SheetHeader>
            <div className="mt-4" onClick={() => setTocOpen(false)}>
              <ContentNavigation items={toc} />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
