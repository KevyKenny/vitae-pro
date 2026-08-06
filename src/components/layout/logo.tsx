"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  APP_NAME,
  LOGO_MARK,
  LOGO_MARK_REVERSED,
} from "@/lib/constants/navigation";

type LogoProps = {
  href?: string;
  compact?: boolean;
  inverted?: boolean;
  className?: string;
  onNavigate?: () => void;
};

export function Logo({
  href = "/dashboard",
  compact = false,
  inverted = false,
  className,
  onNavigate,
}: LogoProps) {
  const markSrc = inverted ? LOGO_MARK_REVERSED : LOGO_MARK;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-bright",
        className,
      )}
      aria-label={APP_NAME}
    >
      <Image
        src={markSrc}
        alt=""
        width={26}
        height={26}
        className="size-[26px] rounded-[7px]"
        unoptimized
        priority
      />
      {!compact ? (
        <span
          className={cn(
            "font-serif text-[1.12rem] font-semibold tracking-[-0.01em]",
            inverted ? "text-paper" : "text-ink",
          )}
        >
          {APP_NAME}
        </span>
      ) : null}
    </Link>
  );
}
