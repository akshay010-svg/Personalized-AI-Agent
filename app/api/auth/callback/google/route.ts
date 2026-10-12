import { NextResponse } from "next/server";
import { saveUserGmailToken } from "@/lib/gmail-token-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const encodedState = url.searchParams.get("state");

  let userId = "";
  let returnUrl = "/dashboard/integrations";

  if (encodedState) {
    try {
      const decoded = JSON.parse(Buffer.from(encodedState, "base64url").toString("utf-8"));
      userId = decoded.userId || "";
      returnUrl = decoded.returnUrl || "/dashboard/integrations";
    } catch {
      // fallback
    }
  }

  const origin = url.origin;
  const redirectTarget = returnUrl.startsWith("http") ? new URL(returnUrl) : new URL(returnUrl, origin);

  if (error) {
    redirectTarget.searchParams.set("error", `Google OAuth access denied: ${error}`);
    return NextResponse.redirect(redirectTarget.toString());
  }

  if (!code) {
    redirectTarget.searchParams.set("error", "No authorization code received from Google");
    return NextResponse.redirect(redirectTarget.toString());
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    redirectTarget.searchParams.set(
      "error",
      "Google Client ID or Secret not configured in .env"
    );
    return NextResponse.redirect(redirectTarget.toString());
  }

  try {
    // 1. Exchange authorization code for access and refresh tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Token exchange failed:", errText);
      redirectTarget.searchParams.set("error", "Failed to exchange token with Google");
      return NextResponse.redirect(redirectTarget.toString());
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in || 3600;

    // 2. Fetch live user email from Google Gmail profile
    let email = "user@gmail.com";
    try {
      const profileRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        email = profile.emailAddress || email;
      }
    } catch (e) {
      console.warn("Could not fetch Gmail profile:", e);
    }

    // 3. Fetch optional user info (name, avatar)
    let name = "";
    let picture = "";
    try {
      const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (userinfoRes.ok) {
        const userInfo = await userinfoRes.json();
        name = userInfo.name || "";
        picture = userInfo.picture || "";
        if (!email || email === "user@gmail.com") {
          email = userInfo.email || email;
        }
      }
    } catch (e) {
      console.warn("Could not fetch userinfo:", e);
    }

    // 4. Save to multi-user token store
    saveUserGmailToken({
      userId: userId || email,
      email,
      name,
      picture,
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
      connectedAt: new Date().toISOString()
    });

    // 5. Build response redirecting back to integrations
    redirectTarget.searchParams.set("connected", "gmail");
    redirectTarget.searchParams.set("email", email);
    redirectTarget.searchParams.set("status", "success");

    const response = NextResponse.redirect(redirectTarget.toString());

    // 6. Set HTTP cookie with user connection session
    const cookiePayload = JSON.stringify({
      email,
      userId: userId || email,
      accessToken,
      isReal: true,
      connectedAt: new Date().toISOString()
    });

    response.cookies.set("omnisync_gmail_token", cookiePayload, {
      path: "/",
      httpOnly: false, // Accessible by client app to sync connection state
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax"
    });

    return response;
  } catch (err: any) {
    console.error("Google OAuth callback error:", err);
    redirectTarget.searchParams.set("error", err.message || "OAuth callback failure");
    return NextResponse.redirect(redirectTarget.toString());
  }
}
