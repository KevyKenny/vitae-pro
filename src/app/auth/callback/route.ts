import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles email confirmation and password-recovery redirects from Supabase.
 * Configure in Supabase: Authentication → URL Configuration
 * Redirect URLs should include: {SITE_URL}/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/auth/transition";
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      const safeNext = next.startsWith("/") ? next : "/auth/transition";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=auth_callback_failed`,
  );
}
