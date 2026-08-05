"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, Loader2, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AuthCard,
  IllustrationContainer,
  SuccessAnimation,
} from "@/features/auth/components";
import {
  getMockSession,
  mockResendVerification,
} from "@/features/auth/lib/mock-auth";

function subscribe() {
  return () => {};
}

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const session = useSyncExternalStore(
    subscribe,
    () => getMockSession(),
    () => null,
  );
  const email = session?.email ?? "your email";

  async function handleResend() {
    try {
      setLoading(true);
      await mockResendVerification();
      setResent(true);
      toast.success("Verification email resent");
    } catch {
      toast.error("Could not resend email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle={`We sent a confirmation link to ${email}. Open it to activate your VitatePro account.`}
      footer={
        <div className="space-y-3">
          <Button
            type="button"
            shape="soft"
            disabled={loading}
            onClick={handleResend}
            className="h-11 w-full rounded-[8px]"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Resending…
              </>
            ) : resent ? (
              "Resend again"
            ) : (
              "Resend email"
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            shape="soft"
            className="h-11 w-full rounded-[8px]"
          >
            <Link href="/auth/sign-in">
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </Button>
          <p className="text-center text-sm text-ink-faint">
            Already verified?{" "}
            <Link
              href="/auth/transition"
              className="font-semibold text-emerald hover:underline"
            >
              Continue
            </Link>
          </p>
        </div>
      }
    >
      <div className="mb-4 flex justify-center">
        <IllustrationContainer tone="emerald" className="max-h-52 max-w-52">
          <div className="flex flex-col items-center gap-3">
            <SuccessAnimation size="md" />
            <MailOpen className="size-6 text-emerald" aria-hidden />
          </div>
        </IllustrationContainer>
      </div>
      <p className="rounded-[14px] border border-line bg-paper-dim px-4 py-3 text-center text-sm text-ink-soft">
        This is a mock verification screen — no real email is sent in Phase 2.
      </p>
    </AuthCard>
  );
}
