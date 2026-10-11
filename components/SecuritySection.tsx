"use client";

import { ShieldCheck, EyeOff, Lock, Server } from "lucide-react";

export default function SecuritySection() {
  const securityPoints = [
    {
      title: "Zero Model Training",
      description: "Your conversations and emails are never used to train or fine-tune AI models.",
      icon: EyeOff,
    },
    {
      title: "No Stored Passwords",
      description: "Direct official OAuth 2.0 authorization with minimal restricted scopes.",
      icon: Lock,
    },
    {
      title: "Isolated Processing",
      description: "Ephemeral sandboxes process summaries and wipe runtime memory immediately.",
      icon: Server,
    },
    {
      title: "End-to-End Encryption",
      description: "AES-256 standard encryption for all tokens in transit and at rest.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="security" className="relative py-16 md:py-20 bg-[#090b12] border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Bank-Grade Privacy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Your private data stays private
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Engineered with strict zero-trust principles so you never have to worry about data exposure.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {securityPoints.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-white/8 bg-[#0c0f18] p-4.5 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
