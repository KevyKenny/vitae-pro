"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FileQuestion } from "lucide-react";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  coverLetterErrorMessage,
  createCoverLetter,
} from "@/lib/cover-letters";

export default function CreateCoverLetterPage() {
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;
    void (async () => {
      try {
        const { id } = await createCoverLetter();
        if (cancelled) return;
        router.replace(`/cover-letter/${id}`);
        router.refresh();
      } catch (err) {
        if (cancelled) return;
        const message = coverLetterErrorMessage(
          err,
          "Could not create cover letter.",
        );
        setError(message);
        toast.error(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper p-6">
        <EmptyState
          icon={FileQuestion}
          title="Could not create cover letter"
          description={error}
          actionLabel="Back to Cover Letters"
          onAction={() => {
            router.push("/cover-letters");
          }}
          className="max-w-md"
        />
        <Button asChild variant="outline" shape="soft">
          <Link href="/cover-letters">Cover Letters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper p-6">
      <LoadingSkeleton variant="editor" />
    </div>
  );
}
