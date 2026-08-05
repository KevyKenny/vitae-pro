"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { CustomizationPanel } from "@/features/templates/components/customization-panel";
import { CVPreviewCustomizer } from "@/features/templates/components/cv-preview-customizer";
import { useCustomize } from "@/features/templates/context/customize-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function CustomizeStudio() {
  const {
    template,
    saveCustom,
    reset,
    drawerOpen,
    setDrawerOpen,
  } = useCustomize();

  return (
    <div className="flex h-dvh flex-col bg-paper">
      <header className="flex flex-wrap items-center gap-3 border-b border-line bg-surface/95 px-3 py-2.5 backdrop-blur md:px-5">
        <Button asChild variant="ghost" size="icon-sm" shape="soft" aria-label="Back">
          <Link href="/templates">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Logo compact href="/dashboard" className="hidden sm:inline-flex" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Customization Studio
          </p>
          <p className="truncate text-sm font-semibold text-ink">{template.name}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          shape="soft"
          className="rounded-[8px]"
          onClick={reset}
        >
          <RotateCcw className="size-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
        <Button
          type="button"
          size="sm"
          shape="soft"
          className="rounded-[8px]"
          onClick={saveCustom}
        >
          <Save className="size-3.5" />
          Save
        </Button>
        <Button
          asChild
          size="sm"
          variant="secondary"
          shape="soft"
          className="rounded-[8px]"
        >
          <Link
            href="/cvs/cv_1/edit"
            onClick={() => toast.success("Template applied to editor (UI)")}
          >
            Apply to CV
          </Link>
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="hidden w-[360px] shrink-0 overflow-y-auto border-r border-line bg-surface lg:block">
          <CustomizationPanel />
        </div>
        <div className="min-w-0 flex-1">
          <CVPreviewCustomizer />
        </div>
        <div className="hidden w-[280px] shrink-0 overflow-y-auto border-l border-line bg-surface p-4 xl:block">
          <p className="text-[0.72rem] font-bold tracking-[0.04em] text-ink-faint uppercase">
            Tips
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>· Keep ATS-critical headings if you switch layouts.</li>
            <li>· Emerald + gold palettes match VitatePro branding.</li>
            <li>· Export still happens from the CV Editor.</li>
          </ul>
          <Button asChild variant="outline" shape="soft" className="mt-6 w-full rounded-[8px]">
            <Link href={`/templates/${template.id}`}>Template details</Link>
          </Button>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="h-[75vh] overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Customization controls</SheetTitle>
          </SheetHeader>
          <CustomizationPanel />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden",
        )}
      >
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={() => setDrawerOpen(true)}
        >
          Customize
        </Button>
        <Button
          type="button"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={saveCustom}
        >
          Save design
        </Button>
      </div>
    </div>
  );
}
