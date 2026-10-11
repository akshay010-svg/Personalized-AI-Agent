"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { insforge } from "@/lib/insforge";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { refreshUser, user, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [loading, user, router]);

  // Password strength
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const score = (hasMinLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasUpper ? 1 : 0);
  const strengthLabel = score === 0 ? "" : score === 1 ? "Weak" : score === 2 ? "Good" : "Strong";
  const strengthColor = score === 1 ? "bg-rose-500" : score === 2 ? "bg-amber-500" : "bg-emerald-500";

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!fullName.trim()) { setErrorMsg("Please enter your full name."); return; }
    if (!email || !email.includes("@")) { setErrorMsg("Please enter a valid email."); return; }
    if (password.length < 8) { setErrorMsg("Password must be at least 8 characters."); return; }
    if (!agreeTerms) { setErrorMsg("Please agree to the Terms of Service."); return; }

    setIsLoading(true);
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name: fullName.trim(),
        redirectTo: `${window.location.origin}/signin`,
      });
      if (error) { setErrorMsg(error.message || "Failed to create account."); return; }
      if (data?.requireEmailVerification) {
        setRegisteredEmail(email);
        setPendingVerification(true);
      } else if (data?.accessToken) {
        await refreshUser();
        router.push("/dashboard");
      }
    } catch { setErrorMsg("Something went wrong. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg("");
    setOauthLoading(true);
    try {
      const { error } = await insforge.auth.signInWithOAuth("google", {
        redirectTo: `${window.location.origin}/dashboard`,
        additionalParams: { prompt: "select_account" },
      });
      if (error) { setErrorMsg(error.message || "Google sign-up failed."); setOauthLoading(false); }
    } catch { setErrorMsg("Something went wrong."); setOauthLoading(false); }
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 mx-auto">
            <Mail className="h-7 w-7 text-indigo-400" />
          </div>
          <h1 className="text-xl font-semibold text-white">Check your email</h1>
          <p className="text-sm text-slate-400">
            We sent a verification link to{" "}
            <strong className="text-white">{registeredEmail}</strong>. Click the link to activate your account.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4 py-10">
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
          <h1 className="text-xl font-semibold text-white mb-1">Create account</h1>
          <p className="text-xs text-slate-400 mb-5">Get started with OmniSync for free.</p>

          {errorMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google */}
          <button
            id="google-signup-btn"
            type="button"
            onClick={handleGoogleSignUp}
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

          <form id="signup-form" onSubmit={handleSignUp} className="space-y-3">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (8+ characters)"
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

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all duration-300`}
                      style={{ width: `${(score / 3) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-2">
                      <span className={hasMinLength ? "text-emerald-400" : ""}>8+ chars</span>
                      <span className={hasNumber ? "text-emerald-400" : ""}>number</span>
                      <span className={hasUpper ? "text-emerald-400" : ""}>uppercase</span>
                    </span>
                    <span className={score === 3 ? "text-emerald-400" : score === 2 ? "text-amber-400" : "text-rose-400"}>
                      {strengthLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 mt-0.5 rounded accent-indigo-600 border-white/20 bg-white/5"
              />
              <span className="text-xs text-slate-400 leading-snug">
                I agree to the{" "}
                <Link href="/" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>.
              </span>
            </label>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isLoading || oauthLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Create free account
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
