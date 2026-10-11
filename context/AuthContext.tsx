"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { insforge } from "@/lib/insforge";

// Matches the InsForge SDK user shape: user.profile.name, user.profile.avatar_url
interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  providers: string[];
  createdAt: string;
  updatedAt: string;
  profile?: {
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
  metadata?: Record<string, unknown>;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

/**
 * Upserts user info into the public.users table on first sign-in / OAuth login.
 * This is safe to call repeatedly — it only writes if data changes.
 */
async function saveUserToDatabase(user: UserProfile) {
  const name = user.profile?.name ?? null;
  const avatar_url = user.profile?.avatar_url ?? null;
  const provider = user.providers?.[0] ?? "email";

  // Try insert first (new user); fall back to update if user already exists
  const { error: insertError } = await insforge.database
    .from("users")
    .insert([
      {
        id: user.id,
        email: user.email,
        name,
        avatar_url,
        provider,
        updated_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    // Likely a duplicate — update the existing record
    const { error: updateError } = await insforge.database
      .from("users")
      .update({ email: user.email, name, avatar_url, provider, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      console.error("[Auth] Failed to update user in database:", updateError);
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data?.user) {
        setUser(null);
        return;
      }

      const u = data.user as UserProfile;
      setUser(u);

      // Persist/sync user info into the public.users table on every session
      await saveUserToDatabase(u);
    } catch (err) {
      console.error("[Auth] Error fetching current user:", err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  const signOut = useCallback(async () => {
    await insforge.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
