"use client";

import { Key, Sparkles, Bell, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  onOpenConnectModal: () => void;
}

export default function HowItWorks({ onOpenConnectModal }: HowItWorksProps) {
  const steps = [
    {
      step: "01",
      title: "Connect in 60 seconds",
      description:
        "Link Gmail, WhatsApp, Telegram, and Outlook via official OAuth. No passwords are ever stored.",
      icon: Key,
      iconBg: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    },
    {
      step: "02",
      title: "AI synthesizes the noise",
      description:
        "OmniSync correlates conversations across apps, mutes promo spam, and identifies real commitments.",
      icon: Sparkles,
      iconBg: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    },
    {
      step: "03",
      title: "Review your 2-minute brief",
      description:
        "Receive a clean morning digest, auto-extracted calendar reminders, and ready-to-send draft replies.",
      icon: Bell,
      iconBg: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-16 md:py-24 bg-[#07090e]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            How it works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Set up once in 60 seconds. Reclaim hours every week.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-2xl border border-white/8 bg-[#0d101a] p-6 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-indigo-400/60">
                      {item.step}
                    </span>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${item.iconBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={onOpenConnectModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
