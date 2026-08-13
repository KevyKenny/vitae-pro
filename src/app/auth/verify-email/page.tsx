"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AuthCard,
  IllustrationContainer,
  SuccessAnimation,
} from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authErrorMessage } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const emailFromQuery = searchParams.get("email");
  const email = emailFromQuery || user?.email || "your email";

  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    const target = emailFromQuery || user?.email;
    if (!target || target === "your email") {
      toast.error("Enter your email on the sign-up page to resend verification.");
      return;
    }
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: target,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/transition`,
        },
      });
      if (error) throw error;
      setResent(true);
      toast.success("Verification email resent");
    } catch (error) {
      toast.error(authErrorMessage(error, "Could not resend email."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Check your email"
      subtitle={`We sent a verification link to ${email}. Open it to activate your account.`}
      footer={
        <div className="space-y-3">
          <Button
            type="button"
            shape="soft"
            className="w-full rounded-[8px]"
            onClick={() => router.push("/auth/transition")}
          >
            I&apos;ve verified — continue
          </Button>
          <Button asChild variant="outline" shape="soft" className="w-full rounded-[8px]">
            <Link href="/auth/sign-in">
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </Button>
        </div>
      }
    >
      <div className="mb-6 flex justify-center">
        <IllustrationContainer tone="emerald" className="max-h-48 max-w-48">
          {resent ? (
            <SuccessAnimation size="md" />
          ) : (
            <MailOpen className="size-14 text-emerald" aria-hidden />
          )}
        </IllustrationContainer>
      </div>
      <p className="text-center text-sm text-ink-soft">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          className="font-semibold text-emerald hover:underline disabled:opacity-60"
          disabled={loading}
          onClick={() => void handleResend()}
        >
          {loading ? "Sending…" : "Resend verification email"}
        </button>
      </p>
      <p className="mt-3 text-center text-sm text-ink-soft">
        Wrong address?{" "}
        <Link
          href="/auth/sign-up"
          className="font-semibold text-emerald hover:underline"
        >
          Change email and sign up again
        </Link>
      </p>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="Check your email" subtitle="Loading…">
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-emerald" />
          </div>
        </AuthCard>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
