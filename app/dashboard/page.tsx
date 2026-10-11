"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  Bell,
  LogOut,
  Loader2,
  Zap,
  ShieldCheck,
  User,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowRight,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  // Redirect unauthenticated users to sign-in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  // Show loading spinner while auth state resolves
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          <p className="text-xs text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Will redirect to /signin if not authenticated (handled by useEffect)
  if (!user) return null;

  const displayName = user.profile?.name ?? user.email.split("@")[0];
  const avatarInitials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/8 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-[130px]" />

      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07090e]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              OmniSync<span className="text-indigo-400">.ai</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-xs font-medium text-white">
              Dashboard
            </Link>
            <Link href="#" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Briefings
            </Link>
            <Link href="#" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Channels
            </Link>
            <Link href="#" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Reminders
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[8px] font-bold text-white">3</span>
            </button>

            {/* Settings */}
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white transition-colors">
              <Settings className="h-4 w-4" />
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              {user.profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profile.avatar_url as string}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white">
                  {avatarInitials}
                </div>
              )}
              <span className="hidden sm:block text-xs font-medium text-slate-200 max-w-[120px] truncate">
                {displayName}
              </span>
            </div>

            {/* Sign out */}
            <button
              id="signout-btn"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

        {/* Welcome Banner */}
        <div className="mb-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-[#0d101a] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Good morning, {displayName.split(" ")[0]}! 👋
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
              Your OmniSync workspace is active. Connect your channels to start receiving briefings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Workspace Active
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Channels Connected", value: "0", icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
            { label: "Briefings Delivered", value: "0", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { label: "Messages Synthesized", value: "0", icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { label: "Reminders Set", value: "0", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border ${stat.border} bg-[#0d101a]/80 p-3 sm:p-4 flex flex-col gap-2`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Left: Channel Connection Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#0d101a]/90 p-5 sm:p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Connect Your Channels</h2>
                <span className="text-[11px] text-slate-400">0 of 4 connected</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "gmail",
                    name: "Gmail",
                    desc: "Email triage, unread summary, urgent flags",
                    icon: Mail,
                    color: "text-rose-400",
                    bg: "bg-rose-500/10",
                    border: "border-rose-500/20",
                  },
                  {
                    id: "whatsapp",
                    name: "WhatsApp",
                    desc: "Group & personal message synthesis",
                    icon: MessageSquare,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20",
                  },
                  {
                    id: "telegram",
                    name: "Telegram",
                    desc: "Channel alerts, bot notifications, DMs",
                    icon: Send,
                    color: "text-sky-400",
                    bg: "bg-sky-500/10",
                    border: "border-sky-500/20",
                  },
                  {
                    id: "outlook",
                    name: "Outlook & Calendar",
                    desc: "Meeting prep, email digest, schedule sync",
                    icon: Calendar,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                  },
                ].map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 hover:border-white/15 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${channel.bg} border ${channel.border}`}>
                        <channel.icon className={`h-4 w-4 ${channel.color}`} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{channel.name}</div>
                        <div className="text-[11px] text-slate-400">{channel.desc}</div>
                      </div>
                    </div>
                    <button
                      id={`connect-${channel.id}-btn`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all"
                    >
                      Connect
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Account Info & Quick Actions */}
          <div className="space-y-4">

            {/* Account Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0d101a]/90 p-5 backdrop-blur-xl">
              <h2 className="text-sm font-semibold text-white mb-4">Account</h2>
              <div className="space-y-3">
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  {user.profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profile.avatar_url as string}
                      alt={displayName}
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-sm font-bold text-white">
                      {avatarInitials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{displayName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>

                {/* Status badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Account Active
                  </span>
                  {user.emailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                      <ShieldCheck className="h-3 w-3" />
                      Email Verified
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-400 capitalize">
                    <User className="h-3 w-3" />
                    {user.providers?.[0] ?? "email"}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/8">
                  <div className="text-[11px] text-slate-400">
                    Member since{" "}
                    <span className="text-slate-200">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Briefing Schedule Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0d101a]/90 p-5 backdrop-blur-xl">
              <h2 className="text-sm font-semibold text-white mb-3">Briefing Schedule</h2>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Morning Briefing</span>
                  <span className="font-mono text-indigo-300">08:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status</span>
                  <span className="text-slate-400 italic">No channels yet</span>
                </div>
                <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2.5 text-[11px] text-indigo-200 flex items-start gap-2">
                  <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Connect at least one channel to activate your automated daily briefings.</span>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0d101a]/90 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white">Security</h2>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>256-bit AES encryption at rest</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Zero LLM training on your data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>OAuth 2.0 PKCE protected sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
