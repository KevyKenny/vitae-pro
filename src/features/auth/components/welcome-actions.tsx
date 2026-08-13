"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WelcomeActions() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild shape="soft" size="lg" className="w-full rounded-[8px]">
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          shape="soft"
          size="lg"
          className="w-full rounded-[8px]"
        >
          <Link href="/auth/sign-up">Create account</Link>
        </Button>
      </div>
    </div>
  );
}
