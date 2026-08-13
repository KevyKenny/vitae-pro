import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database/types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/** Browser Supabase client (anon / publishable key only). */
export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
