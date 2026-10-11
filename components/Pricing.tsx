"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface PricingProps {
  onOpenConnectModal: () => void;
}

export default function Pricing({ onOpenConnectModal }: PricingProps) {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "free forever",
      description: "For individuals wanting a daily digest across two channels.",
      features: [
        "Connect any 2 accounts (e.g. Gmail & WhatsApp)",
        "Daily 8:00 AM executive brief",
        "Up to 25 smart reminders per month",
        "Standard OAuth security",
      ],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For managers, founders, and power users needing full coverage.",
      features: [
        "Connect all 4 channels: Gmail, WhatsApp, Telegram & Outlook",
        "Unlimited real-time & scheduled briefs",
        "Unlimited smart reminder extractions & calendar sync",
        "Voice note transcription (WhatsApp & Telegram)",
        "VIP noise filter & 1-click draft replies",
      ],
      cta: "Start 14-Day Free Trial",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Team & Enterprise",
      price: "$49",
      period: "per user / mo",
      description: "For executive teams needing isolated enclaves and compliance.",
      features: [
        "All Pro capabilities included",
        "Dedicated isolated LLM enclave (Zero data retention)",
        "Custom domain sync & priority routing",
        "SOC-2 Type II audit report & DPA support",
      ],
      cta: "Contact Enterprise",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-16 md:py-24 bg-[#090b12] border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Start free, connect in 60 seconds, upgrade when you need full coverage.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                p.highlight
                  ? "border-2 border-indigo-500 bg-[#0e1324] shadow-xl shadow-indigo-950/40"
                  : "border border-white/8 bg-[#0c0f18]"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-bold text-white shadow">
                  {p.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-400 font-medium">/{p.period}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{p.description}</p>

                <div className="mt-5 space-y-2.5 border-t border-white/8 pt-5">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 pt-4 border-t border-white/5">
                <Link
                  href="/signup"
                  className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    p.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
