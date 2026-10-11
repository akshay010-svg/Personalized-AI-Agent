"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { insforge } from "@/lib/insforge";
import { useAuth } from "@/context/AuthContext";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
      return;
    }
    const status = searchParams.get("insforge_status");
    const type = searchParams.get("insforge_type");
    const err = searchParams.get("insforge_error");
    if (status === "success" && type === "verify_email") {
      setSuccessMsg("Email verified! You can now sign in.");
    } else if (status === "error") {
      setErrorMsg(err ?? "Verification failed. Please try again.");
    }
  }, [loading, user, router, searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) { setErrorMsg("Please fill in all fields."); return; }
    setIsLoading(true);
    try {
      const { data, error } = await insforge.auth.signInWithPassword({ email, password });
      if (error) { setErrorMsg(error.message || "Invalid email or password."); return; }
      if (data) { await refreshUser(); router.push("/dashboard"); }
    } catch { setErrorMsg("Something went wrong. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email) { setErrorMsg("Enter your email address above."); return; }
    setIsLoading(true);
    try {
      const { data, error } = await insforge.auth.sendResetPasswordEmail({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) { setErrorMsg(error.message || "Failed to send reset email."); return; }
      if (data?.success) setResetSent(true);
    } catch { setErrorMsg("Something went wrong. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setOauthLoading(true);
    try {
      const { error } = await insforge.auth.signInWithOAuth("google", {
        redirectTo: `${window.location.origin}/dashboard`,
        additionalParams: { prompt: "select_account" },
      });
      if (error) { setErrorMsg(error.message || "Google sign-in failed."); setOauthLoading(false); }
    } catch { setErrorMsg("Something went wrong."); setOauthLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold text-white">
              OmniSync<span className="text-indigo-400">.ai</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0d101a] p-6 shadow-2xl">
          <h1 className="text-xl font-semibold text-white mb-1">
            {forgotMode ? "Reset password" : "Sign in"}
          </h1>
          <p className="text-xs text-slate-400 mb-5">
            {forgotMode
              ? "We'll send a reset link to your email."
              : "Welcome back to OmniSync."}
          </p>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {resetSent ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <p className="text-sm text-slate-300">
                Reset link sent to <strong className="text-white">{email}</strong>. Check your inbox.
              </p>
              <button
                onClick={() => { setForgotMode(false); setResetSent(false); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Back to sign in
              </button>
            </div>
          ) : forgotMode ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                id="forgot-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
              </button>
              <button
                type="button"
                onClick={() => { setForgotMode(false); setErrorMsg(""); }}
                className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            /* Sign In Form */
            <>
              {/* Google */}
              <button
                id="google-signin-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={oauthLoading || isLoading}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-medium text-slate-200 hover:bg-white/[0.08] disabled:opacity-60 transition-colors mb-4"
              >
                {oauthLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0d101a] px-3 text-[11px] uppercase text-slate-500">or</span>
                </div>
              </div>

              <form id="signin-form" onSubmit={handleSignIn} className="space-y-3">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setErrorMsg(""); }}
                    className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  id="signin-submit-btn"
                  type="submit"
                  disabled={isLoading || oauthLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
