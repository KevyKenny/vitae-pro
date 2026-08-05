"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

type AuthTabsProps = {
  className?: string;
};

export function AuthTabs({ className }: AuthTabsProps) {
  const pathname = usePathname();
  const isSignIn = pathname.includes("sign-in");
  const isSignUp = pathname.includes("sign-up");

  return (
    <div
      className={cn(
        "mb-8 flex rounded-full border border-line bg-surface p-1",
        className,
      )}
      role="tablist"
      aria-label="Authentication"
    >
      <Link
        href="/auth/sign-in"
        role="tab"
        aria-selected={isSignIn}
        className={cn(
          "flex-1 rounded-full py-2.5 text-center text-[0.88rem] font-semibold text-ink-soft transition-all",
          isSignIn && "bg-emerald text-paper",
        )}
      >
        Sign in
      </Link>
      <Link
        href="/auth/sign-up"
        role="tab"
        aria-selected={isSignUp}
        className={cn(
          "flex-1 rounded-full py-2.5 text-center text-[0.88rem] font-semibold text-ink-soft transition-all",
          isSignUp && "bg-emerald text-paper",
        )}
      >
        Create account
      </Link>
    </div>
  );
}

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-dvh flex-col justify-between overflow-hidden bg-emerald px-10 py-12 text-paper lg:flex xl:px-14">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 12%, rgba(250,248,243,0.08), transparent 45%), radial-gradient(circle at 10% 90%, rgba(176,141,62,0.18), transparent 40%)",
        }}
      />
      <div className="relative">
        <Logo href="/" inverted className="text-[1.2rem]" />
      </div>
      <div className="relative max-w-[420px]">
        <h2 className="font-serif text-[2.3rem] leading-[1.18] font-semibold tracking-[-0.01em]">
          Your career coach is already reading your draft.
        </h2>
        <p className="mt-5 max-w-[380px] text-[0.98rem] leading-relaxed text-paper/72">
          Sign in to pick up where you left off — VitatePro autosaves every change
          and keeps a full version history.
        </p>
        <div className="mt-9 max-w-[400px] rounded-[14px] border border-white/14 bg-white/6 p-[22px] backdrop-blur-[6px]">
          <p className="mb-2.5 flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.06em] text-gold uppercase">
            <span className="size-1.5 rounded-full bg-gold" aria-hidden />
            Welcome back note
          </p>
          <p className="text-[0.9rem] leading-relaxed text-paper/88">
            Your Product Designer CV is 87% complete. Your Experience section
            still needs one quantified result.
          </p>
        </div>
      </div>
      <div className="relative flex flex-wrap gap-8 text-[0.82rem] text-paper/55">
        <span>★ 4.9 rating</span>
        <span>12,400+ CVs built</span>
        <span>Bank-level encryption</span>
      </div>
    </aside>
  );
}
