"use client";

import { useEffect, useState } from "react";
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
  Phone,
  LayoutDashboard,
  Bot,
  FileText,
  Boxes,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import IntegrationsView from "@/components/IntegrationsView";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          <p className="text-xs text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Will redirect to /signin if not authenticated (handled by useEffect)
  if (!user) return null;

  const displayName =
    user.profile?.name ||
    (user.email ? user.email.split("@")[0] : user.phoneNumber || "User");
  const avatarInitials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const mainNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "bg-indigo-600",
      href: "/dashboard",
    },
    {
      id: "agent",
      label: "AI Agent",
      icon: Bot,
      color: "bg-purple-600",
      href: "#",
      badge: "Active",
    },
    {
      id: "briefing",
      label: "Briefing",
      icon: FileText,
      color: "bg-emerald-600",
      href: "#",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Boxes,
      color: "bg-sky-600",
      href: "#",
      badge: "11 Ready",
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: Bell,
      color: "bg-amber-500",
      href: "#",
      badge: "3",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "bg-slate-700",
      href: "#",
    },
  ];

  const bottomNavItems = [
    {
      id: "pricing",
      label: "Pricing Settings",
      icon: CreditCard,
      color: "bg-rose-600",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/8 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-[130px]" />

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/8 bg-[#0a0d14]/95 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top: Logo & App Name + Collapse Toggle */}
        <div className="flex h-18 items-center justify-between border-b border-white/8 px-4">
          <Link
            href="/"
            className={`flex items-center gap-3 overflow-hidden transition-all ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            {/* Logo with solid colored gradient */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
                <span className="text-base font-bold tracking-tight text-white truncate">
                  OmniSync<span className="text-indigo-400">.ai</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Autonomous Agent
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse button */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Expand button when collapsed (Desktop) */}
        {collapsed && (
          <div className="hidden md:flex justify-center py-2 border-b border-white/8">
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Main Menu
            </div>
          )}

          {mainNavItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileOpen(false);
                }}
                title={collapsed ? item.label : undefined}
                className={`group relative flex w-full items-center rounded-xl p-2 text-left transition-all ${
                  isActive
                    ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                } ${collapsed ? "justify-center" : "gap-3"}`}
              >
                {/* Large Icon with Solid-Colored Background */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color} text-white shadow-md shadow-black/40 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Text and badges when expanded */}
                {!collapsed && (
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="text-sm font-semibold truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`ml-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                          item.id === "alerts"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className={`absolute rounded-full bg-indigo-500 ${
                      collapsed
                        ? "-right-1 top-1/2 -translate-y-1/2 h-6 w-1"
                        : "left-0 top-1/2 -translate-y-1/2 h-6 w-1"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Pricing Settings & User Account */}
        <div className="border-t border-white/8 p-3 space-y-2">
          {!collapsed && (
            <div className="px-3 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Account & Billing
            </div>
          )}

          {bottomNavItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileOpen(false);
                }}
                title={collapsed ? item.label : undefined}
                className={`group relative flex w-full items-center rounded-xl p-2 text-left transition-all ${
                  isActive
                    ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                } ${collapsed ? "justify-center" : "gap-3"}`}
              >
                {/* Large Icon with Solid-Colored Background */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color} text-white shadow-md shadow-black/40 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {!collapsed && (
                  <span className="text-sm font-semibold truncate">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          {/* User Profile Info & Sign Out */}
          <div
            className={`mt-2 rounded-xl border border-white/8 bg-white/[0.02] p-2 flex items-center ${
              collapsed ? "justify-center" : "justify-between gap-2"
            }`}
          >
            <div
              className={`flex items-center min-w-0 ${
                collapsed ? "justify-center" : "gap-2.5"
              }`}
            >
              {user.profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profile.avatar_url as string}
                  alt={displayName}
                  className="h-9 w-9 shrink-0 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                  {avatarInitials}
                </div>
              )}

              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user.email || user.phoneNumber || "Member"}
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                id="signout-btn"
                onClick={handleSignOut}
                title="Sign Out"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Signout icon when collapsed */}
          {collapsed && (
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="flex w-full h-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Layout Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Top Header Bar for Breadcrumbs & Mobile Trigger */}
        <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07090e]/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Workspace</span>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-semibold text-white capitalize">
                  {activeNav === "pricing" ? "Pricing Settings" : activeNav}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification bell with solid colored background */}
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-sm shadow-amber-500/50">
                  3
                </span>
              </button>

              {/* Settings button */}
              <button
                onClick={() => setActiveNav("settings")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>

              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sync Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="relative z-10 flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {activeNav === "integrations" ? (
            <IntegrationsView />
          ) : (
            <>
              {/* Welcome Banner */}
              <div className="mb-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-[#0d101a] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-600/30">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Good morning, {displayName.split(" ")[0]}! 👋
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Your OmniSync workspace is active. Connect your channels to start receiving automated briefings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Workspace Active
              </span>
            </div>
          </div>

          {/* Stats Row - Large icons with solid-colored backgrounds */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              {
                label: "Channels Connected",
                value: "0",
                icon: Zap,
                bgColor: "bg-indigo-600",
                shadow: "shadow-indigo-600/25",
              },
              {
                label: "Briefings Delivered",
                value: "0",
                icon: BarChart3,
                bgColor: "bg-emerald-600",
                shadow: "shadow-emerald-600/25",
              },
              {
                label: "Messages Synthesized",
                value: "0",
                icon: CheckCircle2,
                bgColor: "bg-purple-600",
                shadow: "shadow-purple-600/25",
              },
              {
                label: "Reminders Set",
                value: "0",
                icon: Clock,
                bgColor: "bg-amber-500",
                shadow: "shadow-amber-500/25",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/8 bg-[#0d101a]/80 p-4 sm:p-5 flex flex-col gap-3 backdrop-blur-sm hover:border-white/15 transition-all"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bgColor} text-white shadow-md ${stat.shadow}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 leading-tight mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left: Channel Connection Panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0d101a]/90 p-5 sm:p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-semibold text-white">Connect Your Channels</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Streamline your communications across all platforms
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNav("integrations")}
                    className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                  >
                    View All Integrations (MCP) →
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "gmail",
                      name: "Gmail",
                      desc: "Email triage, unread summary, urgent flags",
                      icon: Mail,
                      bgColor: "bg-rose-600",
                      shadow: "shadow-rose-600/20",
                    },
                    {
                      id: "whatsapp",
                      name: "WhatsApp",
                      desc: "Group & personal message synthesis",
                      icon: MessageSquare,
                      bgColor: "bg-emerald-600",
                      shadow: "shadow-emerald-600/20",
                    },
                    {
                      id: "telegram",
                      name: "Telegram",
                      desc: "Channel alerts, bot notifications, DMs",
                      icon: Send,
                      bgColor: "bg-sky-600",
                      shadow: "shadow-sky-600/20",
                    },
                    {
                      id: "outlook",
                      name: "Outlook & Calendar",
                      desc: "Meeting prep, email digest, schedule sync",
                      icon: Calendar,
                      bgColor: "bg-blue-600",
                      shadow: "shadow-blue-600/20",
                    },
                  ].map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] p-3.5 hover:border-white/15 hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Large icon with solid colored background */}
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${channel.bgColor} text-white shadow-md ${channel.shadow} group-hover:scale-105 transition-transform`}
                        >
                          <channel.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {channel.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {channel.desc}
                          </div>
                        </div>
                      </div>
                      <button
                        id={`connect-${channel.id}-btn`}
                        onClick={() => setActiveNav("integrations")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all"
                      >
                        Connect
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
                <h2 className="text-sm font-semibold text-white mb-4">Account Overview</h2>
                <div className="space-y-3.5">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3">
                    {user.profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.profile.avatar_url as string}
                        alt={displayName}
                        className="h-11 w-11 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md shadow-indigo-500/25">
                        {avatarInitials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {displayName}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {user.email || user.phoneNumber || "No email"}
                      </div>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Account Active
                    </span>
                    {user.emailVerified && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-medium text-blue-300">
                        <ShieldCheck className="h-3 w-3" />
                        Email Verified
                      </span>
                    )}
                    {user.phoneNumber && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                        <Phone className="h-3 w-3" />
                        {user.phoneNumber}
                      </span>
                    )}
                    {user.verificationMethod && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 capitalize">
                        <MessageSquare className="h-3 w-3" />
                        {user.verificationMethod} OTP
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-400 capitalize">
                      <User className="h-3 w-3" />
                      {user.providers?.[0] ?? "email"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/8">
                    <div className="text-xs text-slate-400">
                      Member since{" "}
                      <span className="text-slate-200 font-medium">
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
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-white">Briefing Schedule</h2>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Morning Briefing</span>
                    <span className="font-mono text-indigo-300 font-semibold">08:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Status</span>
                    <span className="text-slate-400 italic">No channels yet</span>
                  </div>
                  <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-3 text-xs text-indigo-200 flex items-start gap-2.5">
                    <Zap className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Connect at least one channel to activate your automated daily briefings.</span>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0d101a]/90 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-white">Enterprise Security</h2>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>256-bit AES encryption at rest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Zero LLM training on your data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>OAuth 2.0 PKCE protected sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
