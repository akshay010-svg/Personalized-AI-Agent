"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  CheckCircle,
  Clock,
  Bell,
  ShieldCheck,
  ChevronRight,
  Flame,
  Check,
  TrendingUp,
  Bot,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  onOpenConnectModal: () => void;
}

export default function HeroSection({ onOpenConnectModal }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "reminders" | "drafts">(
    "summary"
  );
  const [completedReminders, setCompletedReminders] = useState<number[]>([]);

  const toggleReminder = (id: number) => {
    setCompletedReminders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/15 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Tag */}
        <div className="flex justify-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-500/15 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Assistant for Gmail, WhatsApp, Telegram & Outlook</span>
            <ChevronRight className="h-3 w-3 text-indigo-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Hero Title & Concise Subhead */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            One AI inbox for all your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              chats and emails
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Stop switching between apps. OmniSync brings Gmail, WhatsApp, Telegram, and Outlook into a clean morning briefing with auto-extracted to-dos.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenConnectModal}
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Connect Accounts Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="#demo"
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-slate-200 hover:bg-white/[0.08] transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current text-indigo-400" />
              <span>Try Live Demo</span>
            </a>
          </div>

          {/* Clean Trust Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Zero training on private messages
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              Official OAuth 2.0
            </span>
            <span>•</span>
            <span>60-second setup</span>
          </div>
        </div>

        {/* Hero Product Cockpit Mockup */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="relative rounded-2xl border border-white/10 bg-[#0b0e17]/95 p-2 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl sm:p-3">
            {/* Window bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-medium text-slate-400">
                  Daily Briefing Digest
                </span>
              </div>

              {/* Connected Services Pill Strip */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] text-red-300 font-medium">
                  <Mail className="h-2.5 w-2.5" /> Gmail (18)
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 font-medium">
                  <MessageSquare className="h-2.5 w-2.5" /> WhatsApp (34)
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-300 font-medium hidden sm:inline-flex">
                  <Send className="h-2.5 w-2.5" /> Telegram (8)
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300 font-medium hidden sm:inline-flex">
                  <Calendar className="h-2.5 w-2.5" /> Outlook (5)
                </span>
              </div>
            </div>

            {/* Mockup Tabs */}
            <div className="flex items-center gap-1 border-b border-white/8 bg-black/20 p-1.5">
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "summary"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>Morning Briefing</span>
              </button>

              <button
                onClick={() => setActiveTab("reminders")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "reminders"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Bell className="h-3 w-3" />
                <span>Extracted To-Dos</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {3 - completedReminders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("drafts")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "drafts"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Bot className="h-3 w-3" />
                <span>Smart Replies</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0e121d] to-[#0a0c13] rounded-b-xl min-h-[280px]">
              {/* TAB 1: EXECUTIVE SUMMARY */}
              {activeTab === "summary" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs">
                    <span className="text-slate-400">
                      65 total messages analyzed • 3 require action
                    </span>
                    <span className="text-emerald-400 font-medium">8:30 AM Briefing</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Item 1 */}
                    <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3.5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-rose-400 flex items-center gap-1">
                          <Flame className="h-3 w-3" /> Schedule Change
                        </span>
                        <span className="text-[10px] text-slate-400">Outlook + WhatsApp</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Board Meeting moved to 3:30 PM
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Sarah sent updated invite due to delayed flight. No conflict with your calendar.
                      </p>
                      <div className="mt-2.5 text-[11px] text-rose-300 font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Calendar updated
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-3.5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-indigo-400 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Agreement
                        </span>
                        <span className="text-[10px] text-slate-400">Gmail + Telegram</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Enterprise MSA Approved
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Counsel redlines approved; client signed via DocuSign. Action: countersign today.
                      </p>
                      <div className="mt-2.5 text-[11px] text-indigo-300 font-medium flex items-center gap-1">
                        <ChevronRight className="h-3 w-3" /> Draft reply ready
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Travel Alert
                        </span>
                        <span className="text-[10px] text-slate-400">Gmail</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Flight UA 482 Check-in
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Online check-in opens in 1 hr 45 min. Confirmation #KH82LF. Terminal 2 SFO.
                      </p>
                      <div className="mt-2.5 text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Reminder at 10:15 AM
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SMART REMINDERS */}
              {activeTab === "reminders" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs text-slate-400">
                    <span>Extracted from conversations automatically</span>
                    <span>Click to complete</span>
                  </div>

                  {[
                    {
                      id: 1,
                      title: "Send revised investment deck to Michael",
                      due: "Today at 2:00 PM",
                      source: "Outlook",
                      icon: Calendar,
                      color: "text-blue-400",
                    },
                    {
                      id: 2,
                      title: "Confirm dinner table at L'Ami Jean",
                      due: "Tonight at 7:30 PM",
                      source: "WhatsApp",
                      icon: MessageSquare,
                      color: "text-emerald-400",
                    },
                    {
                      id: 3,
                      title: "Approve smart contract deployment",
                      due: "Tomorrow at 11:00 AM",
                      source: "Telegram",
                      icon: Send,
                      color: "text-sky-400",
                    },
                  ].map((item) => {
                    const isDone = completedReminders.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleReminder(item.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isDone
                            ? "border-emerald-500/20 bg-emerald-500/5 opacity-50"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              isDone
                                ? "border-emerald-500 bg-emerald-500 text-black"
                                : "border-slate-500"
                            }`}
                          >
                            {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                          </button>
                          <div>
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                isDone ? "line-through text-slate-400" : "text-white"
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-2">
                              via {item.source}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-amber-300 font-medium">
                          {item.due}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: SMART REPLIES */}
              {activeTab === "drafts" && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 pb-2 border-b border-white/5">
                    Context-aware draft replies ready to send
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-emerald-400 font-medium mb-1">
                          WhatsApp Reply to Marco
                        </div>
                        <p className="text-xs text-slate-300 font-mono bg-black/40 p-2.5 rounded-lg border border-white/5">
                          &quot;Thanks Marco! Monday at 10 AM works great to finalize the agreement.&quot;
                        </p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500">
                          Approve & Send
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-blue-400 font-medium mb-1">
                          Outlook Reply to Michael
                        </div>
                        <p className="text-xs text-slate-300 font-mono bg-black/40 p-2.5 rounded-lg border border-white/5">
                          &quot;Hi Michael, revisions are ready. Attached the deck before our 2 PM sync.&quot;
                        </p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500">
                          Approve & Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
