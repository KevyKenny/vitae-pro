import type { Profile } from "@/lib/database/types";
import { profileDisplayName } from "@/lib/auth/names";

export function suggestCvTitle(options: {
  profile?: Profile | null;
  email?: string | null;
  targetRole?: string | null;
  isGraduate?: boolean;
}): string {
  const name = profileDisplayName(options.profile ?? null, options.email);
  const role =
    options.targetRole?.trim() ||
    options.profile?.professional_title?.trim() ||
    "";

  if (name && role) {
    return `${name} — ${role}`;
  }
  if (role) {
    return `${role} CV`;
  }
  if (name) {
    return options.isGraduate ? `${name} — Graduate CV` : `${name} CV`;
  }
  return "My Professional CV";
}
