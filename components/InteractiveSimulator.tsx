"use client";

import { useState } from "react";
import {
  Sparkles,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  Clock,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";

type PlatformType = "gmail" | "whatsapp" | "telegram" | "outlook";

interface Scenario {
  id: PlatformType;
  title: string;
  sender: string;
  icon: any;
  iconColor: string;
  sampleInput: string;
  summary: string;
  actionItem: string;
  dueTime: string;
  draftReply: string;
}

const scenarios: Record<PlatformType, Scenario> = {
  gmail: {
    id: "gmail",
    title: "Gmail Thread",
    sender: "Jessica Vance (Vanguard Capital)",
    icon: Mail,
    iconColor: "text-red-400",
    sampleInput:
      "Hi Akshay,\nTerm sheet is finalized at the $30M cap. Please review Exhibit B regarding stock pool allocation and wire the legal escrow by Wednesday noon.\n\nBest,\nJessica",
    summary: "Term sheet finalized at $30M cap. Review Exhibit B and wire escrow.",
    actionItem: "Wire legal escrow funds & sign Exhibit B",
    dueTime: "Wednesday at 12:00 PM",
    draftReply:
      "Thanks Jessica! Reviewing Exhibit B now and scheduling the escrow wire for Wednesday morning.",
  },
  whatsapp: {
    id: "whatsapp",
    title: "WhatsApp Message",
    sender: "Marco Rossi (Design Lead)",
    icon: MessageSquare,
    iconColor: "text-emerald-400",
    sampleInput:
      "[Voice Note 0:45 Transcribed]:\n\"Hey Akshay! Design system looks great in Figma. Quick question: can you confirm lunch tomorrow at 1:00 PM at Bistro Central to go over the animations?\"",
    summary: "Designs approved. Marco requested lunch tomorrow at 1:00 PM at Bistro Central.",
    actionItem: "Lunch with Marco at Bistro Central",
    dueTime: "Tomorrow at 1:00 PM",
    draftReply:
      "Hey Marco! 1:00 PM at Bistro Central works great. See you tomorrow!",
  },
  telegram: {
    id: "telegram",
    title: "Telegram Channel",
    sender: "Alexey @ Core Dev",
    icon: Send,
    iconColor: "text-sky-400",
    sampleInput:
      "Audit cleared with zero critical issues! Need you to initiate the multisig transaction to trigger mainnet deployment before 08:00 UTC tomorrow.",
    summary: "Contract audit cleared. Multisig key signature required before 08:00 UTC.",
    actionItem: "Execute multisig transaction for deployment",
    dueTime: "Tomorrow at 07:30 UTC",
    draftReply:
      "Great work team! Reviewing checklist now and executing the multisig signature.",
  },
  outlook: {
    id: "outlook",
    title: "Outlook Email",
    sender: "Sarah Jenkins (HR Operations)",
    icon: Calendar,
    iconColor: "text-blue-400",
    sampleInput:
      "Dear Akshay,\nQuarterly review cycle closes this Friday, Oct 16th at 5:00 PM. Please certify team reviews in the portal before the deadline.",
    summary: "Quarterly team review submissions close Friday at 5:00 PM.",
    actionItem: "Certify team evaluations in portal",
    dueTime: "Friday at 5:00 PM",
    draftReply:
      "Hi Sarah, evaluations are underway and will be submitted before Friday 5 PM.",
  },
};

export default function InteractiveSimulator() {
  const [activePlatform, setActivePlatform] = useState<PlatformType>("gmail");
  const [copied, setCopied] = useState(false);

  const scenario = scenarios[activePlatform];
  const Icon = scenario.icon;

  const handleCopy = () => {
    navigator.clipboard?.writeText(scenario.draftReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="demo" className="relative py-16 md:py-24 bg-[#090b14] border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            See how messages are distilled
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Pick a channel to see raw text transformed into a clean summary, to-do, and draft reply.
          </p>
        </div>

        {/* Platform Selector Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "gmail", label: "Gmail", icon: Mail, color: "text-red-400" },
            { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "text-emerald-400" },
            { id: "telegram", label: "Telegram", icon: Send, color: "text-sky-400" },
            { id: "outlook", label: "Outlook", icon: Calendar, color: "text-blue-400" },
          ].map((item) => {
            const ItemIcon = item.icon;
            const isSelected = activePlatform === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePlatform(item.id as PlatformType)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "border border-white/8 bg-[#0d101a] text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ItemIcon className={`h-4 w-4 ${isSelected ? "text-white" : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side Comparison */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT: Raw Message */}
          <div className="rounded-2xl border border-white/8 bg-[#0c0f18] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 border border-white/10">
                    <Icon className={`h-4 w-4 ${scenario.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{scenario.title}</h3>
                    <p className="text-[11px] text-slate-400">{scenario.sender}</p>
                  </div>
                </div>
                <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                  Raw Message
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-black/30 border border-white/5 p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line">
                {scenario.sampleInput}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500">
              Unstructured incoming conversation
            </div>
          </div>

          {/* RIGHT: AI Distilled Output */}
          <div className="rounded-2xl border border-indigo-500/25 bg-[#0e1220] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>OmniSync Distillation</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Processed
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {/* 1. Summary */}
                <div className="rounded-xl bg-black/30 border border-white/5 p-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Key Summary
                  </span>
                  <p className="text-xs text-white leading-relaxed">{scenario.summary}</p>
                </div>

                {/* 2. Action Item */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                    <span>Action Item</span>
                    <span className="flex items-center gap-1 lowercase text-emerald-300 font-normal">
                      <Clock className="h-2.5 w-2.5" /> {scenario.dueTime}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium">{scenario.actionItem}</p>
                </div>

                {/* 3. Draft Reply */}
                <div className="rounded-xl bg-black/30 border border-white/5 p-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    <span>1-Click Draft Reply</span>
                    <button
                      onClick={handleCopy}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 normal-case font-normal"
                    >
                      {copied ? (
                        <>
                          <Check className="h-2.5 w-2.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-2.5 w-2.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 italic font-mono bg-white/[0.02] p-2 rounded">
                    &quot;{scenario.draftReply}&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Ready to act in under 5 seconds</span>
              <span className="text-indigo-400">Auto-synced</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
