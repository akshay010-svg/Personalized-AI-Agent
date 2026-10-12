// Server-side multi-user token store for connected Gmail accounts

export interface UserGmailToken {
  userId: string;
  email: string;
  name?: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // timestamp in ms
  scopes?: string[];
  connectedAt: string;
}

// In-memory multi-user store keyed by userId and by email
const tokenStoreByUserId = new Map<string, UserGmailToken>();
const tokenStoreByEmail = new Map<string, UserGmailToken>();

export function saveUserGmailToken(token: UserGmailToken) {
  if (token.userId) {
    tokenStoreByUserId.set(token.userId, token);
  }
  if (token.email) {
    tokenStoreByEmail.set(token.email.toLowerCase(), token);
  }
}

export function getUserGmailToken(userIdOrEmail?: string): UserGmailToken | null {
  if (!userIdOrEmail) {
    // If no specific identifier provided, return the most recently updated entry if available
    const all = Array.from(tokenStoreByEmail.values());
    return all.length > 0 ? all[all.length - 1] : null;
  }

  const byUser = tokenStoreByUserId.get(userIdOrEmail);
  if (byUser) return byUser;

  const byEmail = tokenStoreByEmail.get(userIdOrEmail.toLowerCase());
  if (byEmail) return byEmail;

  return null;
}

export function removeUserGmailToken(userIdOrEmail: string) {
  const byUser = tokenStoreByUserId.get(userIdOrEmail);
  if (byUser) {
    tokenStoreByUserId.delete(userIdOrEmail);
    if (byUser.email) {
      tokenStoreByEmail.delete(byUser.email.toLowerCase());
    }
    return;
  }

  const byEmail = tokenStoreByEmail.get(userIdOrEmail.toLowerCase());
  if (byEmail) {
    tokenStoreByEmail.delete(userIdOrEmail.toLowerCase());
    if (byEmail.userId) {
      tokenStoreByUserId.delete(byEmail.userId);
    }
  }
}

// Refresh Google OAuth token if expired
export async function refreshGoogleTokenIfNeeded(token: UserGmailToken): Promise<string> {
  const isExpired = Date.now() > token.expiresAt - 60000; // 1 min buffer
  if (!isExpired) {
    return token.accessToken;
  }

  if (!token.refreshToken) {
    return token.accessToken;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return token.accessToken;
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token"
      })
    });

    if (!res.ok) {
      console.error("Failed to refresh Google token:", await res.text());
      return token.accessToken;
    }

    const data = await res.json();
    token.accessToken = data.access_token;
    token.expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    saveUserGmailToken(token);

    return token.accessToken;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return token.accessToken;
  }
}
