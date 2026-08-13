"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AuthTabs,
  PasswordInput,
  PasswordStrengthMeter,
} from "@/features/auth/components";
import { CountrySelector } from "@/features/onboarding/components";
import {
  signUpSchema,
  type SignUpValues,
} from "@/features/auth/schemas/auth";
import { authErrorMessage } from "@/lib/auth/errors";
import { splitFullName } from "@/lib/auth/names";
import { createClient } from "@/lib/supabase/client";
import { mockCareerLevels } from "@/mocks/onboarding";

export default function SignUpPage() {
  const router = useRouter();

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

  async function onSubmit(values: SignUpValues) {
    try {
      const supabase = createClient();
      const { firstName, lastName } = splitFullName(values.fullName);

      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            full_name: values.fullName.trim(),
            first_name: firstName,
            last_name: lastName,
            country: values.country,
            career_level: values.careerLevel,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/transition`,
        },
      });
      if (error) throw error;

      // Ensure profile row has signup metadata (trigger may race / miss fields)
      if (data.user) {
        await supabase
          .from("profiles")
          .upsert(
            {
              id: data.user.id,
              email: values.email.trim(),
              first_name: firstName || null,
              last_name: lastName || null,
              country: values.country || null,
              career_level: values.careerLevel || null,
            },
            { onConflict: "id" },
          );
      }

      if (data.session) {
        // Email confirmation disabled — continue into the app funnel
        router.push("/auth/transition");
        router.refresh();
        return;
      }

      // Confirmation required in this Supabase project
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(values.email.trim())}`,
      );
    } catch (error) {
      toast.error(authErrorMessage(error, "Could not create your account."));
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-[18px]"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Kennedy Sithole"
            disabled={isSubmitting}
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
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          ) : (
            <p className="text-xs text-ink-faint">
              Use an email you can access — we&apos;ll use it for account
              recovery.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <PasswordStrengthMeter password={password || ""} />
          <p className="text-xs text-ink-faint">
            Use 8+ characters with uppercase, lowercase, and a number.
          </p>
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
            disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            <Link href="/terms" className="text-emerald hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald hover:underline">
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
          disabled={isSubmitting}
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
