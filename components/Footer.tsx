"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#06080d] text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                OmniSync<span className="text-indigo-400">.ai</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Your AI personal assistant that unifies Gmail, WhatsApp, Telegram, and Outlook into clear morning digests and actionable reminders.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/signin" className="hover:text-white transition-colors font-medium text-slate-300">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors font-medium text-indigo-400">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#integrations" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="/#demo" className="hover:text-white transition-colors">
                  Simulator
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Trust & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#security" className="hover:text-white transition-colors">
                  Zero Data Training
                </a>
              </li>
              <li>
                <a href="/#security" className="hover:text-white transition-colors">
                  OAuth Security
                </a>
              </li>
              <li>
                <a href="/#security" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/#security" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© 2026 OmniSync AI. All rights reserved.</div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Bank-grade OAuth 2.0</span>
            <span>•</span>
            <span className="text-slate-400">Local Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
