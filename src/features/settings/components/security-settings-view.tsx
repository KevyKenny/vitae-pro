"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import {
  LoginHistoryRow,
  SecurityCard,
  SessionRow,
} from "@/features/settings/components/security-card";
import { useSettingsSave } from "@/features/settings/hooks/use-settings-save";
import {
  passwordSchema,
  type PasswordFormValues,
} from "@/features/settings/schemas";
import {
  mockLoginHistory,
  mockSecuritySessions,
} from "@/mocks/settings";

export function SecuritySettingsView() {
  const [sessions, setSessions] = useState(mockSecuritySessions);
  const [twoFactor, setTwoFactor] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const { saveStatus, saveNow, retry } = useSettingsSave();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Security & privacy"
        description="Password, sessions, and what VitatePro can remember about you."
        saveStatus={saveStatus}
        onRetry={retry}
      />

      <SecurityCard
        title="Password"
        description="Use a unique password you don’t reuse elsewhere."
      >
        <form
          className="grid max-w-md gap-3"
          onSubmit={handleSubmit(() => {
            void saveNow(() => {
              reset();
            });
          })}
        >
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              className="mt-1.5"
              {...register("currentPassword")}
            />
            {errors.currentPassword ? (
              <p className="mt-1 text-xs text-destructive" role="alert">
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              className="mt-1.5"
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <p className="mt-1 text-xs text-destructive" role="alert">
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="mt-1.5"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" shape="soft" className="w-fit rounded-[8px]">
            Change Password
          </Button>
        </form>
      </SecurityCard>

      <SecurityCard
        title="Two-factor authentication"
        description="Add a second step when signing in from new devices."
        action={
          <Button
            type="button"
            shape="soft"
            variant={twoFactor ? "outline" : "primary"}
            className="rounded-[8px]"
            onClick={() => {
              setTwoFactor((v) => !v);
              toast.success(
                twoFactor ? "2FA disabled (UI only)" : "2FA enabled (UI only)",
              );
            }}
          >
            {twoFactor ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        }
      >
        <p className="text-sm text-ink-soft">
          Status:{" "}
          <span className="font-semibold text-ink">
            {twoFactor ? "Enabled" : "Not enabled"}
          </span>
        </p>
      </SecurityCard>

      <SecurityCard
        title="Active sessions"
        description="Devices currently signed into your account."
        action={
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="rounded-[8px]"
            onClick={() => {
              setSessions((s) => s.filter((x) => x.current));
              toast.success("Logged out other devices (UI only)");
            }}
          >
            Logout devices
          </Button>
        }
      >
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            onLogout={() => {
              setSessions((s) => s.filter((x) => x.id !== session.id));
              toast.success("Session ended");
            }}
          />
        ))}
      </SecurityCard>

      <SecurityCard title="Login history" description="Recent sign-in attempts.">
        {mockLoginHistory.map((event) => (
          <LoginHistoryRow key={event.id} event={event} />
        ))}
      </SecurityCard>

      <SecurityCard
        title="Privacy controls"
        description="Optional analytics that improve coaching quality."
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">
              Share anonymized usage
            </p>
            <p className="text-[0.78rem] text-ink-soft">
              Helps us tune AI suggestions. Never sold.
            </p>
          </div>
          <Switch
            checked={shareAnalytics}
            onCheckedChange={setShareAnalytics}
            aria-label="Share anonymized usage"
          />
        </div>
      </SecurityCard>
    </div>
  );
}
