"use client";

import { useState } from "react";
import {
  Sparkles,
  Bell,
  Mic,
  Filter,
  Check,
  Clock,
  Volume2,
} from "lucide-react";

export default function BentoGridFeatures() {
  const [reminderChecked, setReminderChecked] = useState(false);

  return (
    <section id="features" className="relative py-16 md:py-24 bg-[#07090e]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Core Superpowers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Built to eliminate inbox overwhelm
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Everything you need to stay on top of work without spending hours scrolling through messages.
          </p>
        </div>

        {/* 4 Clean Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CARD 1: Morning Briefing */}
          <div className="rounded-2xl border border-white/8 bg-[#0d101b] p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Executive Digest</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Turn 100+ unreads into a 2-minute brief
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                OmniSync cross-correlates replies from email threads and chat groups into three clear action points every morning.
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-white/8 bg-black/40 p-3.5 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                  1
                </span>
                <span>David approved the spec on Gmail; assets ready on Telegram.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  2
                </span>
                <span>Client demo scheduled for Thursday 2 PM via WhatsApp.</span>
              </div>
            </div>
          </div>

          {/* CARD 2: Voice Note Transcripts */}
          <div className="rounded-2xl border border-white/8 bg-[#0d101b] p-6 flex flex-col justify-between hover:border-sky-500/30 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                <Mic className="h-3.5 w-3.5" />
                <span>Audio Synthesis</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                No more listening to 4-minute voice rambles
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Voice notes on WhatsApp and Telegram are instantly transcribed and formatted into direct bullet points.
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-white/8 bg-black/40 p-3.5">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                  <Volume2 className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 flex items-center gap-0.5 h-4">
                  {[40, 70, 90, 45, 100, 60, 85, 30, 90, 50, 75, 40].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1 rounded-full bg-sky-400/80"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">0:45 audio</span>
              </div>
              <p className="text-xs text-sky-200 bg-sky-500/10 rounded-lg p-2 border border-sky-500/20">
                <strong>Takeaway:</strong> Client approved mockups; review agreement Monday 10 AM.
              </p>
            </div>
          </div>

          {/* CARD 3: Zero-Effort Smart Reminders */}
          <div className="rounded-2xl border border-white/8 bg-[#0d101b] p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                <Bell className="h-3.5 w-3.5" />
                <span>Smart Reminders</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Never forget a commitment or deadline
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                OmniSync detects promises like &quot;I&apos;ll send the invoice by Friday&quot; and adds them to your calendar.
              </p>
            </div>

            <div
              onClick={() => setReminderChecked(!reminderChecked)}
              className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 cursor-pointer select-none"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    reminderChecked
                      ? "border-emerald-500 bg-emerald-500 text-black"
                      : "border-slate-500 hover:border-emerald-400"
                  }`}
                >
                  {reminderChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <div>
                  <h4
                    className={`text-xs sm:text-sm font-semibold transition-all ${
                      reminderChecked ? "line-through text-slate-400" : "text-white"
                    }`}
                  >
                    Transfer rent & send confirmation
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    Due today by 4:00 PM (detected in WhatsApp)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: VIP Noise Shield */}
          <div className="rounded-2xl border border-white/8 bg-[#0d101b] p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Filter className="h-3.5 w-3.5" />
                <span>Noise Shield</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Mute spam, newsletters & banter
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Only get interrupted by family, key clients, or urgent updates. Everything else is safely batched.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5">
                <span className="text-rose-400 font-semibold block text-[11px]">Muted Noise</span>
                <span className="text-slate-300 text-[11px] mt-0.5 block">54 newsletters & promo chats</span>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                <span className="text-emerald-400 font-semibold block text-[11px]">VIP Surfaced</span>
                <span className="text-slate-300 text-[11px] mt-0.5 block">3 urgent client updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
