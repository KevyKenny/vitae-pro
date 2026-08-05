"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CustomizeProvider } from "@/features/templates/context/customize-context";
import { CustomizeStudio } from "@/features/templates/components/customize-studio";

function CustomizeInner() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") ?? "tpl_meridian";

  return (
    <CustomizeProvider templateId={templateId}>
      <CustomizeStudio />
    </CustomizeProvider>
  );
}

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-paper text-ink-soft">
          Loading customizer…
        </div>
      }
    >
      <CustomizeInner />
    </Suspense>
  );
}
