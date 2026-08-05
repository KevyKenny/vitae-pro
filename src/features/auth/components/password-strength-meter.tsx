"use client";

import { cn } from "@/lib/utils";

type Strength = {
  score: number;
  label: string;
  tone: string;
};

export function getPasswordStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) return { score: 0, label: "Enter a password", tone: "bg-line" };
  if (score <= 2) return { score: 1, label: "Weak", tone: "bg-destructive" };
  if (score === 3) return { score: 2, label: "Fair", tone: "bg-gold" };
  if (score === 4) return { score: 3, label: "Good", tone: "bg-emerald-bright" };
  return { score: 4, label: "Strong", tone: "bg-emerald" };
}

type PasswordStrengthMeterProps = {
  password: string;
  className?: string;
};

export function PasswordStrengthMeter({
  password,
  className,
}: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password);

  return (
    <div className={cn("space-y-2", className)} aria-live="polite">
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-line transition-colors duration-200",
              index < strength.score && strength.tone,
            )}
          />
        ))}
      </div>
      <p className="text-xs text-ink-faint">
        Password strength:{" "}
        <span className="font-semibold text-ink-soft">{strength.label}</span>
      </p>
    </div>
  );
}
