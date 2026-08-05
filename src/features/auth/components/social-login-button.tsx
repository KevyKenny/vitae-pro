"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SocialProvider = "google" | "github";

type SocialLoginButtonProps = {
  provider: SocialProvider;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3l-.9.7-2.1 1.6C5.1 19.3 8.3 21.2 12 21.2c2.4 0 4.4-.8 5.9-2.1l-3.1-2.4c-.8.6-1.9.9-2.8.9-2.2 0-4-1.5-4.7-3.5z"
      />
      <path
        fill="#4A90E2"
        d="M3.6 7.4C2.9 8.8 2.5 10.4 2.5 12s.4 3.2 1.1 4.6l3-2.3c-.2-.6-.3-1.2-.3-1.8s.1-1.3.3-1.8L3.6 7.4z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.4c1.3 0 2.5.5 3.4 1.3l2.5-2.5C16.4 2.7 14.4 1.8 12 1.8 8.3 1.8 5.1 3.7 3.6 7.4l3 2.3C7.9 7 9.8 5.4 12 5.4z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.58.69.48A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

const labels: Record<SocialProvider, string> = {
  google: "Continue with Google",
  github: "Continue with GitHub",
};

export function SocialLoginButton({
  provider,
  onClick,
  loading = false,
  disabled = false,
  className,
}: SocialLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      shape="soft"
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "h-11 w-full rounded-[8px] text-[0.86rem] font-semibold",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : provider === "google" ? (
        <GoogleIcon className="size-4" />
      ) : (
        <GitHubIcon className="size-4 text-ink" />
      )}
      {labels[provider]}
    </Button>
  );
}

export function SocialLoginRow({
  onGoogle,
  onGithub,
  loadingProvider,
  disabled,
}: {
  onGoogle: () => void;
  onGithub: () => void;
  loadingProvider?: SocialProvider | null;
  disabled?: boolean;
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <SocialLoginButton
        provider="google"
        onClick={onGoogle}
        loading={loadingProvider === "google"}
        disabled={disabled || Boolean(loadingProvider)}
      />
      <SocialLoginButton
        provider="github"
        onClick={onGithub}
        loading={loadingProvider === "github"}
        disabled={disabled || Boolean(loadingProvider)}
      />
    </div>
  );
}
