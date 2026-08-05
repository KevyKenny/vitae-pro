"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCard,
  IllustrationContainer,
  SuccessAnimation,
} from "@/features/auth/components";
import { mockForgotPassword } from "@/features/auth/lib/mock-auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schemas/auth";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: ForgotPasswordValues) {
    try {
      await mockForgotPassword(values.email);
      setSentTo(values.email);
    } catch {
      toast.error("Could not send reset link. Please try again.");
    }
  }

  if (sentTo) {
    return (
      <AuthCard
        title="Check your inbox"
        subtitle={`We sent a reset link to ${sentTo}. It expires in 30 minutes.`}
        footer={
          <Button asChild variant="outline" shape="soft" className="w-full rounded-[8px]">
            <Link href="/auth/sign-in">
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </Button>
        }
      >
        <div className="mb-2 flex justify-center">
          <IllustrationContainer tone="emerald" className="max-h-48 max-w-48">
            <SuccessAnimation size="md" />
          </IllustrationContainer>
        </div>
        <p className="text-center text-sm text-ink-soft">
          Didn&apos;t get it? Check spam, or{" "}
          <button
            type="button"
            className="font-semibold text-emerald hover:underline"
            onClick={() => setSentTo(null)}
          >
            try another email
          </button>
          .
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email and we’ll send a secure reset link."
      footer={
        <p className="text-center text-[0.8rem] text-ink-faint">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-1.5 font-semibold text-emerald hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </p>
      }
    >
      <div className="mb-8 flex justify-center">
        <IllustrationContainer tone="gold" className="max-h-40 max-w-40">
          <Mail className="size-12 text-gold" aria-hidden />
        </IllustrationContainer>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]" noValidate>
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email address</Label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <Button
          type="submit"
          shape="soft"
          disabled={isSubmitting}
          className="h-11 w-full rounded-[8px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending link…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
