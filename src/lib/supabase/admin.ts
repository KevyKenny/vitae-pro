import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/types";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/**
 * Service-role client — bypasses RLS.
 * Use only in trusted server contexts (webhooks, admin jobs, seeds).
 * NEVER import this from Client Components.
 */
export function createAdminClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
