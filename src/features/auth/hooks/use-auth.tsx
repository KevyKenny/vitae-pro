"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/database/types";
import { calculateProfileCompletion } from "@/lib/auth/profile-completion";
import { createClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[AuthProvider] profile", error.message);
    return null;
  }
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: current },
    } = await supabase.auth.getUser();
    if (!current) {
      setUser(null);
      setProfile(null);
      return;
    }
    setUser(current);
    const next = await fetchProfile(current.id);
    setProfile(next);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    void (async () => {
      const {
        data: { user: current },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(current);
      if (current) {
        const next = await fetchProfile(current.id);
        if (mounted) setProfile(next);
      }
      if (mounted) setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        void fetchProfile(nextUser.id).then((p) => {
          if (mounted) setProfile(p);
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile, signOut }),
    [user, profile, loading, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useUser() {
  const { user, loading } = useAuth();
  return { user, loading };
}

export function useProfile() {
  const { profile, loading, refreshProfile } = useAuth();
  const completion = calculateProfileCompletion(profile);
  return {
    profile,
    loading,
    refreshProfile,
    completion: profile?.profile_completion ?? completion,
  };
}
