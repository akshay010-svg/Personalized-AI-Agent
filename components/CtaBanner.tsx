"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface CtaBannerProps {
  onOpenConnectModal: () => void;
}

export default function CtaBanner({ onOpenConnectModal }: CtaBannerProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#07090e]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#101424] to-[#0a0d18] p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Cut through the inbox noise. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Start your day with clarity.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-slate-300">
            Join thousands of busy professionals waking up to effortless 2-minute morning briefings and zero missed deadlines.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={onOpenConnectModal}
              className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-slate-200 hover:bg-white/[0.08] transition-all"
            >
              <span>Connect Channels Directly</span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Free tier included
            </span>
            <span>•</span>
            <span>No credit card required</span>
            <span>•</span>
            <span>60-second setup</span>
          </div>
        </div>
      </div>
    </section>
  );
}
