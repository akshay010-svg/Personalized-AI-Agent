"use client";

import Link from "next/link";
import {
  Mail,
  MessageSquare,
  Send,
  Calendar,
  Check,
  ArrowRight,
  Shield,
  Cpu,
} from "lucide-react";

interface ConnectedPlatformsProps {
  onOpenConnectModal: () => void;
}

export default function ConnectedPlatforms({ onOpenConnectModal }: ConnectedPlatformsProps) {
  const platforms = [
    {
      id: "gmail",
      name: "Gmail",
      category: "Google Workspace & Personal",
      icon: Mail,
      iconColor: "text-red-400 bg-red-500/10 border-red-500/20",
      accentHover: "hover:border-red-500/30",
      features: [
        "Turns 20+ email threads into 3 key takeaways",
        "Auto-extracts flight tickets and invoice receipts",
      ],
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      category: "Personal & Business",
      icon: MessageSquare,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      accentHover: "hover:border-emerald-500/30",
      features: [
        "Transcribes voice notes into quick bullet points",
        "Mutes group chat banter while keeping direct mentions",
      ],
    },
    {
      id: "telegram",
      name: "Telegram",
      category: "Channels & Groups",
      icon: Send,
      iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      accentHover: "hover:border-sky-500/30",
      features: [
        "Digest summaries for high-volume community channels",
        "Instant keyword alerts and action item tracking",
      ],
    },
    {
      id: "outlook",
      name: "Outlook",
      category: "Microsoft 365 & Exchange",
      icon: Calendar,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      accentHover: "hover:border-blue-500/30",
      features: [
        "Proactively catches meeting conflicts",
        "Prioritizes urgent client requests and follow-ups",
      ],
    },
  ];

  return (
    <section id="integrations" className="relative py-16 md:py-24 bg-[#090b12] border-y border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Connected to where your conversations happen
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            No more copying links or jumping between 4 tabs. OmniSync connects with your everyday channels in one secure place.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`flex flex-col justify-between rounded-xl border border-white/8 bg-[#0d101a] p-5 transition-all duration-200 ${p.accentHover} hover:bg-[#111524]`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${p.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <p className="text-[11px] text-slate-400">{p.category}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    {p.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5">
                  <button
                    onClick={onOpenConnectModal}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Connect {p.name}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Security Callout & Link */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400 text-center">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Stateless tokens & encrypted OAuth scopes. Passwords are never stored.</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <Link
            href="/integrations"
            className="inline-flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Browse All 11+ MCP Integrations</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
