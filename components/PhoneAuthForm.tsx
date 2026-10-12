"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Popular international country codes
const COUNTRY_CODES = [
  { code: "+1", label: "United States / Canada", flag: "🇺🇸", example: "555 123 4567" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧", example: "7911 123456" },
  { code: "+91", label: "India", flag: "🇮🇳", example: "98765 43210" },
  { code: "+61", label: "Australia", flag: "🇦🇺", example: "412 345 678" },
  { code: "+49", label: "Germany", flag: "🇩🇪", example: "151 23456789" },
  { code: "+33", label: "France", flag: "🇫🇷", example: "6 12 34 56 78" },
  { code: "+971", label: "United Arab Emirates", flag: "🇦🇪", example: "50 123 4567" },
  { code: "+65", label: "Singapore", flag: "🇸🇬", example: "8123 4567" },
  { code: "+81", label: "Japan", flag: "🇯🇵", example: "90 1234 5678" },
  { code: "+55", label: "Brazil", flag: "🇧🇷", example: "11 91234 5678" },
  { code: "+234", label: "Nigeria", flag: "🇳🇬", example: "803 123 4567" },
];

interface PhoneAuthFormProps {
  mode?: "signin" | "signup";
  onSuccessRedirect?: string;
}

export default function PhoneAuthForm({
  mode = "signin",
  onSuccessRedirect = "/dashboard",
}: PhoneAuthFormProps) {
  const router = useRouter();
  const { setPhoneSession, refreshUser } = useAuth();

  // Step 1: Input details, Step 2: Enter OTP
  const [step, setStep] = useState<"input" | "verify">("input");

  // Form states
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [fullName, setFullName] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"sms" | "whatsapp">("whatsapp");

  // OTP inputs (6 individual digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSimulatedDemo, setIsSimulatedDemo] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);

  // Full clean E.164 phone number
  const fullPhoneNumber = `${countryCode}${phoneDigits.replace(/\D/g, "")}`;

  // Countdown timer for resending OTP
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessNotice("");

    const digitsOnly = phoneDigits.replace(/\D/g, "");
    if (!digitsOnly || digitsOnly.length < 6) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          method: verificationMethod,
          name: fullName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to send OTP code. Please try again.");
        return;
      }

      setStep("verify");
      setResendCountdown(45); // 45 seconds cooldown

      if (data.isSimulated && data.demoCode) {
        setIsSimulatedDemo(true);
        setDemoOtpCode(data.demoCode);
        setSuccessNotice(
          `Demo mode: SENT_DM_API_KEY not configured. Use test code: ${data.demoCode}`
        );
      } else {
        setIsSimulatedDemo(false);
        setSuccessNotice(
          `OTP sent via ${verificationMethod === "whatsapp" ? "WhatsApp" : "SMS"} to ${fullPhoneNumber}`
        );
      }

      // Focus first OTP input
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
    } catch {
      setErrorMessage("Network error sending OTP. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit changes with auto-advance and paste support
  const handleOtpChange = (index: number, value: string) => {
    // Check if pasting full code
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const updated = [...otp];
      chars.forEach((c, i) => {
        if (i < 6) updated[i] = c;
      });
      setOtp(updated);
      const nextIndex = Math.min(chars.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    const updated = [...otp];
    updated[index] = cleaned;
    setOtp(updated);

    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const enteredCode = otp.join("");
    if (enteredCode.length !== 6) {
      setErrorMessage("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          code: enteredCode,
          method: verificationMethod,
          name: fullName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Verification failed. Please try again.");
        return;
      }

      // Successfully authenticated
      if (data.user) {
        setPhoneSession(data.user);
      }
      await refreshUser();
      router.push(onSuccessRedirect);
    } catch {
      setErrorMessage("Error verifying OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full">
      {/* Error notification */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success notice */}
      {successNotice && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{successNotice}</span>
        </div>
      )}

      {step === "input" ? (
        /* STEP 1: Phone & Method Selection */
        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Phone Number with Country Code */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
              Phone Number
            </label>
            <div className="flex gap-2">
              {/* Country selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-28 rounded-xl border border-white/10 bg-[#0d101a] px-2 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors appearance-none cursor-pointer text-center"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code + c.label} value={c.code} className="bg-[#0d101a] text-white">
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>

              {/* Number input */}
              <div className="relative flex-1">
                <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(e.target.value)}
                  placeholder="Mobile number"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Verification Method: WhatsApp OTP vs SMS OTP */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-2">
              Choose Verification Channel (via Sent.dm)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp Card */}
              <button
                type="button"
                onClick={() => setVerificationMethod("whatsapp")}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  verificationMethod === "whatsapp"
                    ? "border-emerald-500/80 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  {verificationMethod === "whatsapp" && (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
                  )}
                </div>
                <div className="text-xs font-semibold text-white">WhatsApp OTP</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  Fast & reliable on WhatsApp
                </div>
              </button>

              {/* SMS Card */}
              <button
                type="button"
                onClick={() => setVerificationMethod("sms")}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  verificationMethod === "sms"
                    ? "border-indigo-500/80 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  {verificationMethod === "sms" && (
                    <span className="flex h-2 w-2 rounded-full bg-indigo-400 ring-4 ring-indigo-500/20" />
                  )}
                </div>
                <div className="text-xs font-semibold text-white">SMS OTP</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  Standard mobile text
                </div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !phoneDigits.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending OTP via Sent.dm...
              </>
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* STEP 2: Enter OTP Code */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <div>
              <div className="text-xs text-slate-400">Verification code sent to</div>
              <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span>{fullPhoneNumber}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300 capitalize">
                  {verificationMethod}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("input");
                setErrorMessage("");
                setOtp(["", "", "", "", "", ""]);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Change
            </button>
          </div>

          {/* 6 Digit Input Boxes */}
          <div>
            <label className="block text-center text-xs text-slate-300 mb-3">
              Enter the 6-digit code sent to your phone
            </label>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="h-12 w-11 rounded-xl border border-white/15 bg-white/[0.04] text-center text-lg font-mono font-bold text-white focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {/* Resend actions */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Didn&apos;t receive code?</span>
            {resendCountdown > 0 ? (
              <span className="text-slate-500 font-mono text-[11px]">
                Resend in {resendCountdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isLoading}
                className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <RotateCw className="h-3 w-3" />
                Resend OTP
              </button>
            )}
          </div>

          {/* Quick autofill helper for dev simulation */}
          {isSimulatedDemo && demoOtpCode && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 text-center">
              <span className="text-[11px] text-amber-200">
                Sandbox Test Code: <strong className="text-white font-mono">{demoOtpCode}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setOtp(demoOtpCode.split(""));
                }}
                className="ml-2 text-[10px] text-amber-400 underline hover:text-amber-300"
              >
                (Autofill)
              </button>
            </div>
          )}

          {/* Verify & Authenticate Button */}
          <button
            type="submit"
            disabled={isVerifying || otp.join("").length !== 6}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 py-2.5 text-sm font-semibold text-white hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying OTP & Authenticating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Verify & Continue</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
