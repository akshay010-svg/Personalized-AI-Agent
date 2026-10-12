"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { insforge } from "@/lib/insforge";

export interface UserProfile {
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
  phoneNumber?: string;
  verificationMethod?: 'sms' | 'whatsapp' | string;
  authProvider?: string;
  lastLoginDate?: string;
  metadata?: Record<string, unknown>;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setPhoneSession: (phoneUser: Record<string, unknown>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
  setPhoneSession: () => {},
});

/**
 * Upserts user info into the public.users table on sign-in / OAuth login.
 * This is safe to call repeatedly — it syncs user metadata.
 */
async function saveUserToDatabase(user: UserProfile) {
  const name = user.profile?.name ?? null;
  const avatar_url = user.profile?.avatar_url ?? null;
  const provider = user.providers?.[0] ?? "email";
  const nowIso = new Date().toISOString();

  // Try insert first (new user); fall back to update if user already exists
  const { error: insertError } = await insforge.database
    .from("users")
    .insert([
      {
        id: user.id,
        email: user.email || null,
        name,
        avatar_url,
        provider,
        auth_provider: provider,
        phone_number: user.phoneNumber || null,
        verification_method: user.verificationMethod || null,
        updated_at: nowIso,
        last_login_date: nowIso,
      },
    ]);

  if (insertError) {
    // Duplicate — update the existing record
    const updatePayload: Record<string, unknown> = {
      updated_at: nowIso,
      last_login_date: nowIso,
    };
    if (user.email) updatePayload.email = user.email;
    if (name) updatePayload.name = name;
    if (avatar_url) updatePayload.avatar_url = avatar_url;
    if (provider) {
      updatePayload.provider = provider;
      updatePayload.auth_provider = provider;
    }
    if (user.phoneNumber) updatePayload.phone_number = user.phoneNumber;
    if (user.verificationMethod) updatePayload.verification_method = user.verificationMethod;

    const { error: updateError } = await insforge.database
      .from("users")
      .update(updatePayload)
      .eq("id", user.id);

    if (updateError) {
      console.error("[Auth] Failed to update user in database:", updateError);
    }
  }
}

function formatPhoneUser(data: Record<string, unknown>): UserProfile {
  const name = (data.name as string) || (data.phone_number as string) || "User";
  const email = (data.email as string) || "";
  const phone = (data.phone_number as string) || "";
  const method = (data.verification_method as string) || "sms";

  return {
    id: data.id as string,
    email,
    emailVerified: false,
    providers: ["phone"],
    createdAt: (data.created_date as string) || (data.created_at as string) || new Date().toISOString(),
    updatedAt: (data.updated_at as string) || new Date().toISOString(),
    profile: {
      name,
      avatar_url: (data.avatar_url as string) || undefined,
    },
    phoneNumber: phone,
    verificationMethod: method,
    authProvider: "phone",
    lastLoginDate: (data.last_login_date as string) || new Date().toISOString(),
    metadata: {
      phone_number: phone,
      verification_method: method,
      auth_provider: "phone",
      last_login_date: data.last_login_date,
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      // 1. Check InsForge native auth session (OAuth / email password)
      const { data, error } = await insforge.auth.getCurrentUser();
      if (!error && data?.user) {
        const u = data.user as UserProfile;
        setUser(u);
        await saveUserToDatabase(u);
        return;
      }

      // 2. Check Sent.dm phone session
      const res = await fetch("/api/auth/phone/session");
      if (res.ok) {
        const sessionData = await res.json();
        if (sessionData.authenticated && sessionData.user) {
          const formatted = formatPhoneUser(sessionData.user);
          setUser(formatted);
          return;
        }
      }

      setUser(null);
    } catch (err) {
      console.error("[Auth] Error fetching current user:", err);
      setUser(null);
    }
  }, []);

  const setPhoneSession = useCallback((phoneUserData: Record<string, unknown>) => {
    const formatted = formatPhoneUser(phoneUserData);
    setUser(formatted);
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  const signOut = useCallback(async () => {
    try {
      await insforge.auth.signOut();
    } catch (err) {
      console.error("[Auth] InsForge signOut error:", err);
    }

    try {
      await fetch("/api/auth/phone/session", { method: "DELETE" });
    } catch (err) {
      console.error("[Auth] Phone signOut error:", err);
    }

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser, setPhoneSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
