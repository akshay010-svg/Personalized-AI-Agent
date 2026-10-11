"use client";

import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Siddharth Mehta",
      role: "Founder, Horizon Labs",
      platforms: "Gmail & Telegram",
      quote:
        "OmniSync gives me a 3-minute morning briefing that catches every deadline across my chats and email. It easily saves me 10+ hours every week.",
    },
    {
      name: "Claire Moreau",
      role: "Product Lead, FinScale",
      platforms: "WhatsApp & Outlook",
      quote:
        "The WhatsApp voice memo summaries alone are incredible. Long client audios are converted into 3 bullet points with calendar to-dos automatically.",
    },
    {
      name: "Marcus Vance",
      role: "Partner, Apex Ventures",
      platforms: "Gmail & WhatsApp",
      quote:
        "No more missing critical updates while traveling. The daily executive digest filters out 90% of the noise and highlights only what needs my sign-off.",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-[#07090e]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
            <span className="text-xs font-semibold text-slate-300 ml-1.5">Loved by 40,000+ busy professionals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Real time saved, every morning
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/8 bg-[#0d101a] p-5 flex flex-col justify-between hover:border-white/15 transition-all"
            >
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                &quot;{t.quote}&quot;
              </p>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {t.platforms}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
