"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AuthCard,
  AuthDivider,
  AuthTabs,
  PasswordInput,
  PasswordStrengthMeter,
  SocialLoginRow,
} from "@/features/auth/components";
import { CountrySelector } from "@/features/onboarding/components";
import { mockSignUp, mockSocialAuth } from "@/features/auth/lib/mock-auth";
import {
  signUpSchema,
  type SignUpValues,
} from "@/features/auth/schemas/auth";
import { mockCareerLevels } from "@/mocks/onboarding";

export default function SignUpPage() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      careerLevel: "",
      acceptTerms: false,
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const password = watch("password");
  const busy = isSubmitting || Boolean(loadingProvider);

  async function onSubmit(values: SignUpValues) {
    try {
      await mockSignUp({
        email: values.email,
        fullName: values.fullName,
        password: values.password,
      });
      router.push("/auth/verify-email");
    } catch {
      toast.error("Could not create your account. Please try again.");
    }
  }

  async function handleSocial(provider: "google" | "github") {
    try {
      setLoadingProvider(provider);
      await mockSocialAuth(provider);
      router.push("/auth/transition");
    } catch {
      toast.error("Social sign-up failed. Please try again.");
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building your CV with an AI coach, free."
      footer={
        <p className="text-center text-[0.8rem] text-ink-faint">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-emerald hover:underline"
          >
            Sign in
          </Link>
        </p>
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
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Kennedy Sithole"
            disabled={busy}
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="text-xs font-medium text-destructive">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email address</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="kennedy.sithole@example.com"
            disabled={busy}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          ) : (
            <p className="text-xs text-ink-faint">
              We&apos;ll send a verification link to this address.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            disabled={busy}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <PasswordStrengthMeter password={password || ""} />
          {errors.password ? (
            <p className="text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            disabled={busy}
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-xs font-medium text-destructive">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountrySelector
                  id="country"
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={Boolean(errors.country)}
                />
              )}
            />
            {errors.country ? (
              <p className="text-xs font-medium text-destructive">
                {errors.country.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="careerLevel">Career level</Label>
            <Controller
              control={control}
              name="careerLevel"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="careerLevel"
                    aria-invalid={Boolean(errors.careerLevel)}
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCareerLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.careerLevel ? (
              <p className="text-xs font-medium text-destructive">
                {errors.careerLevel.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field }) => (
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                disabled={busy}
                className="mt-0.5"
                aria-invalid={Boolean(errors.acceptTerms)}
              />
            )}
          />
          <Label
            htmlFor="acceptTerms"
            className="text-[0.82rem] leading-relaxed font-medium text-ink-soft"
          >
            I agree to VitatePro&apos;s{" "}
            <Link href="#" className="text-emerald hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-emerald hover:underline">
              Privacy Policy
            </Link>
            .
          </Label>
        </div>
        {errors.acceptTerms ? (
          <p className="-mt-2 text-xs font-medium text-destructive">
            {errors.acceptTerms.message}
          </p>
        ) : null}

        <Button
          type="submit"
          shape="soft"
          disabled={busy}
          className="h-11 w-full rounded-[8px] text-[0.94rem]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
