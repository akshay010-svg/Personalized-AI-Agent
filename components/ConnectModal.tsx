"use client";

import { useState } from "react";
import {
  X,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlatformState {
  id: string;
  name: string;
  provider: string;
  icon: any;
  color: string;
  badgeBg: string;
  connected: boolean;
  syncing: boolean;
  status: string;
}

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [platforms, setPlatforms] = useState<PlatformState[]>([
    {
      id: "gmail",
      name: "Gmail",
      provider: "Google Workspace & Personal",
      icon: Mail,
      color: "from-red-500 to-rose-600",
      badgeBg: "bg-red-500/10 text-red-400 border-red-500/20",
      connected: true,
      syncing: false,
      status: "Synced & active",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      provider: "Personal & Business Bridge",
      icon: MessageSquare,
      color: "from-emerald-500 to-green-600",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      connected: false,
      syncing: false,
      status: "Ready to connect",
    },
    {
      id: "telegram",
      name: "Telegram",
      provider: "Channels & Direct Messages",
      icon: Send,
      color: "from-sky-500 to-blue-600",
      badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      connected: true,
      syncing: false,
      status: "Synced & active",
    },
    {
      id: "outlook",
      name: "Outlook",
      provider: "Office 365 & Exchange",
      icon: Calendar,
      color: "from-blue-600 to-indigo-600",
      badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      connected: false,
      syncing: false,
      status: "Ready to connect",
    },
  ]);

  if (!isOpen) return null;

  const handleToggleConnect = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (!p.connected) {
            return { ...p, syncing: true };
          } else {
            return {
              ...p,
              connected: false,
              syncing: false,
              status: "Disconnected",
            };
          }
        }
        return p;
      })
    );

    const target = platforms.find((p) => p.id === id);
    if (target && !target.connected) {
      setTimeout(() => {
        setPlatforms((prev) =>
          prev.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                connected: true,
                syncing: false,
                status: "Synced & active",
              };
            }
            return p;
          })
        );
      }, 800);
    }
  };

  const connectedCount = platforms.filter((p) => p.connected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d101a] p-5 sm:p-6 text-slate-100 z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/8">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Accounts</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Connect your channels
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              OmniSync extracts briefings locally. Passwords are never stored.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Platforms List */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
            <span>Channels</span>
            <span className="text-emerald-400">{connectedCount} of 4 connected</span>
          </div>

          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3.5 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${platform.color} text-white shadow`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      {platform.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{platform.status}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleConnect(platform.id)}
                  disabled={platform.syncing}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    platform.syncing
                      ? "bg-slate-800 text-slate-400 cursor-wait"
                      : platform.connected
                      ? "bg-slate-800 text-slate-300 hover:bg-rose-950/40 hover:text-rose-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                  }`}
                >
                  {platform.syncing ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Connecting
                    </>
                  ) : platform.connected ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security footnote */}
        <div className="mt-5 pt-3.5 border-t border-white/8 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Official OAuth 2.0 PKCE</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
