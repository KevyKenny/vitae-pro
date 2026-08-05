"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SocialLoginRow } from "@/features/auth/components";
import { mockSocialAuth } from "@/features/auth/lib/mock-auth";

export function WelcomeActions() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  async function handleSocial(provider: "google" | "github") {
    try {
      setLoadingProvider(provider);
      await mockSocialAuth(provider);
      router.push("/auth/transition");
    } catch {
      toast.error("Could not continue. Please try again.");
    } finally {
      setLoadingProvider(null);
    }
  }

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
      <SocialLoginRow
        onGoogle={() => handleSocial("google")}
        onGithub={() => handleSocial("github")}
        loadingProvider={loadingProvider}
      />
    </div>
  );
}
