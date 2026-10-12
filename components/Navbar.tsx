"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenConnectModal: () => void;
}

export default function Navbar({ onOpenConnectModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Integrations", href: "/integrations" },
    { label: "Demo", href: "/#demo" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#07090e]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            OmniSync<span className="text-indigo-400">.ai</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/signin"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1.5"
          >
            Sign In
          </Link>
          <button
            onClick={onOpenConnectModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <span>Connect</span>
          </button>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all shadow-indigo-600/20"
          >
            <span>Sign Up Free</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/signin"
            className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Sign Up
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#090b14] px-4 py-4 md:hidden space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08]"
            >
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Create Free Account</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConnectModal();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/[0.04] py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <span>Connect Channels (Modal)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
