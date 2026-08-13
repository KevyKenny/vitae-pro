"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCard,
  AuthTabs,
  PasswordInput,
} from "@/features/auth/components";
import {
  signInSchema,
  type SignInValues,
} from "@/features/auth/schemas/auth";
import { authErrorMessage } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const rememberMe = watch("rememberMe");

  async function onSubmit(values: SignInValues) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      if (error) throw error;

      if (redirectTo && redirectTo.startsWith("/")) {
        router.push(redirectTo);
      } else {
        router.push("/auth/transition");
      }
      router.refresh();
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue building your CV."
      footer={
        <>
          <p className="text-center text-[0.8rem] text-ink-faint">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-emerald hover:underline"
            >
              Create one free
            </Link>
          </p>
          <p className="mt-4 text-center text-[0.76rem] leading-relaxed text-ink-faint">
            By continuing, you agree to VitatePro&apos;s Terms of Service and
            Privacy Policy.
          </p>
        </>
      }
    >
      <AuthTabs />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-[18px]"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-[0.8rem] font-semibold text-emerald hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5">
          <Checkbox
            id="remember"
            checked={Boolean(rememberMe)}
            onCheckedChange={(checked) =>
              setValue("rememberMe", checked === true)
            }
            disabled={isSubmitting}
          />
          <Label htmlFor="remember" className="font-medium text-ink-soft">
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          shape="soft"
          disabled={isSubmitting}
          className="mt-1.5 h-11 w-full rounded-[8px] text-[0.94rem]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="Welcome back" subtitle="Loading…">
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-emerald" />
          </div>
        </AuthCard>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
