import type { Profile } from "@/lib/database/types";

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function profileDisplayName(
  profile: Profile | null,
  email?: string | null,
) {
  const name = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || email || "Member";
}

export function getSiteUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercel ? `https://${vercel.replace(/^https?:\/\//, "")}` : null) ??
    "http://localhost:3000"
  );
}
