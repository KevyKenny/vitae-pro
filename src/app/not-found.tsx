import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-[14px] border border-line bg-surface px-6 py-14 text-center shadow-s">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-[14px] bg-emerald-wash text-emerald">
          <FileQuestion className="size-5" aria-hidden />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          That route doesn’t exist in VitatePro. Head back to the dashboard or
          open Help.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button asChild shape="soft">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="outline" shape="soft">
            <Link href="/help">Get support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
