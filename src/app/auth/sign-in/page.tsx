"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  AuthDivider,
  AuthTabs,
  PasswordInput,
  SocialLoginRow,
} from "@/features/auth/components";
import { mockSignIn, mockSocialAuth } from "@/features/auth/lib/mock-auth";
import {
  signInSchema,
  type SignInValues,
} from "@/features/auth/schemas/auth";

export default function SignInPage() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "kennedy.sithole@example.com",
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
      await mockSignIn({
        email: values.email,
        password: values.password,
        name: "Kennedy Sithole",
        needsOnboarding: true,
      });
      router.push("/auth/transition");
    } catch {
      toast.error("Unable to sign in. Check your details and try again.");
    }
  }

  async function handleSocial(provider: "google" | "github") {
    try {
      setLoadingProvider(provider);
      await mockSocialAuth(provider);
      router.push("/auth/transition");
    } catch {
      toast.error("Social sign-in failed. Please try again.");
    } finally {
      setLoadingProvider(null);
    }
  }

  const busy = isSubmitting || Boolean(loadingProvider);

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
      <SocialLoginRow
        onGoogle={() => handleSocial("google")}
        onGithub={() => handleSocial("github")}
        loadingProvider={loadingProvider}
        disabled={busy}
      />
      <AuthDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            disabled={busy}
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
            disabled={busy}
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
            disabled={busy}
          />
          <Label htmlFor="remember" className="font-medium text-ink-soft">
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          shape="soft"
          disabled={busy}
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
