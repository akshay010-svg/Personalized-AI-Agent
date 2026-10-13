"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  CheckCircle2,
  Cpu,
  Settings,
  Sparkles,
  Unplug,
  ArrowRight,
  ShieldCheck,
  Radio,
  Layers,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { PLATFORMS_DATA, PlatformIntegration } from "@/lib/integrations-data";
import PlatformSettingsModal from "@/components/PlatformSettingsModal";
import PlatformConnectModal from "@/components/PlatformConnectModal";
import { useAuth } from "@/context/AuthContext";

interface IntegrationsViewProps {
  initialConnectedIds?: string[];
  onConnectionChange?: (connectedIds: string[]) => void;
}

// Storage key is scoped per user to prevent data leaks across accounts
function getStorageKey(userId: string) {
  return `omnisync_connected_platforms__${userId}`;
}

export default function IntegrationsView({
  initialConnectedIds,
  onConnectionChange
}: IntegrationsViewProps) {
  const { user } = useAuth();

  // State for connected platform IDs
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [connectedDetails, setConnectedDetails] = useState<Record<string, any>>({});

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modals state
  const [settingsPlatform, setSettingsPlatform] = useState<PlatformIntegration | null>(null);
  const [connectPlatform, setConnectPlatform] = useState<PlatformIntegration | null>(null);

  // Notification / toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset connection state when user changes (prevents cross-user data leak)
  useEffect(() => {
    setConnectedIds([]);
    setConnectedDetails({});
  }, [user?.id]);

  // Initialize from localStorage (scoped by userId) or OAuth callback query params
  useEffect(() => {
    if (!user?.id) return; // Don't load until we know who is logged in
    const STORAGE_KEY = getStorageKey(user.id);

    // Check if returning from Google OAuth callback redirect
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const connectedParam = url.searchParams.get("connected");
      const emailParam = url.searchParams.get("email");
      const errorParam = url.searchParams.get("error");

      if (errorParam) {
        setToastMessage(`OAuth error: ${errorParam}`);
        url.searchParams.delete("error");
        window.history.replaceState({}, "", url.pathname);
      } else if (connectedParam === "gmail") {
        const realEmail = emailParam || "your.google@gmail.com";
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : { ids: [], details: {} };
        const updatedIds = Array.from(new Set([...(parsed.ids || []), "gmail"]));
        const updatedDetails = {
          ...(parsed.details || {}),
          gmail: {
            email: realEmail,
            isReal: true,
            connectedAt: new Date().toISOString()
          }
        };
        saveState(updatedIds, updatedDetails, STORAGE_KEY);
        setToastMessage(`Successfully connected real Gmail account: ${realEmail}!`);

        url.searchParams.delete("connected");
        url.searchParams.delete("email");
        url.searchParams.delete("status");
        window.history.replaceState({}, "", url.pathname);
        return;
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConnectedIds(parsed.ids || []);
        setConnectedDetails(parsed.details || {});
      } else {
        setConnectedIds(initialConnectedIds || []);
        setConnectedDetails({});
      }
    } catch {
      setConnectedIds(initialConnectedIds || []);
    }
  }, [user?.id, initialConnectedIds]);

  // Save to localStorage (scoped by userId) whenever connectedIds or connectedDetails change
  const saveState = (newIds: string[], newDetails: Record<string, any>, storageKey?: string) => {
    setConnectedIds(newIds);
    setConnectedDetails(newDetails);
    try {
      const key = storageKey || (user?.id ? getStorageKey(user.id) : null);
      if (key) {
        localStorage.setItem(key, JSON.stringify({ ids: newIds, details: newDetails }));
      }
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    if (onConnectionChange) {
      onConnectionChange(newIds);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Connect platform
  const handleConnect = (platform: PlatformIntegration) => {
    setConnectPlatform(platform);
  };

  const handleConnectSuccess = (
    platformId: string,
    details?: { email?: string; accessToken?: string; isReal?: boolean }
  ) => {
    const updatedIds = Array.from(new Set([...connectedIds, platformId]));
    const updatedDetails = {
      ...connectedDetails,
      [platformId]: {
        email: details?.email || `${platformId}.account@work.com`,
        accessToken: details?.accessToken,
        isReal: details?.isReal,
        connectedAt: new Date().toISOString()
      }
    };
    saveState(updatedIds, updatedDetails);
    const platform = PLATFORMS_DATA.find((p) => p.id === platformId);
    showToast(
      details?.isReal
        ? `Successfully connected real ${platform?.name || platformId} account!`
        : `Successfully connected ${platform?.name || platformId} via MCP!`
    );
  };

  // Disconnect platform
  const handleDisconnect = async (platformId: string) => {
    if (platformId === "gmail") {
      try {
        await fetch("/api/mcp/gmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Pass userId so server-side token store removes the correct user's token
          body: JSON.stringify({ action: "disconnect", userId: user?.id || user?.email })
        });
      } catch (err) {
        console.error("Disconnect error:", err);
      }
    }

    const updatedIds = connectedIds.filter((id) => id !== platformId);
    const updatedDetails = { ...connectedDetails };
    delete updatedDetails[platformId];

    saveState(updatedIds, updatedDetails);
    const platform = PLATFORMS_DATA.find((p) => p.id === platformId);
    showToast(`Disconnected ${platform?.name || platformId}.`);
  };

  // Open settings
  const handleOpenSettings = (platform: PlatformIntegration) => {
    setSettingsPlatform(platform);
  };

  // Categories list
  const categories = [
    "All",
    "Connected",
    "Google Workspace",
    "Team Workspace",
    "Messaging & VoIP",
    "Productivity & Docs",
    "Developer Tools"
  ];

  // Filtered platforms
  const filteredPlatforms = PLATFORMS_DATA.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "Connected") {
      return connectedIds.includes(p.id);
    }
    if (selectedCategory !== "All") {
      return p.category.toLowerCase() === selectedCategory.toLowerCase();
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-[#0d121f] px-4 py-3 text-xs font-semibold text-emerald-300 shadow-2xl shadow-emerald-500/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Section: Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Cpu className="h-4 w-4" />
            <span>Model Context Protocol (MCP) Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Connected Integrations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
            Integrate your core apps with OmniSync autonomous agent using official MCP bridges. Seamlessly sync communications, triage urgent emails, and extract context.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="rounded-xl border border-white/10 bg-[#0d101a] px-3.5 py-2 flex items-center gap-3">
            <div>
              <div className="text-base font-bold text-white">
                {connectedIds.length} / {PLATFORMS_DATA.length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                Active Connections
              </div>
            </div>
            <div className="h-7 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live MCP Bus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d101a]/90 p-2.5 rounded-2xl border border-white/8 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search platforms by name, category, or capability..."
            className="w-full rounded-xl border border-white/8 bg-[#07090e] pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {cat}
              {cat === "Connected" && connectedIds.length > 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2">
                  {connectedIds.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredPlatforms.map((platform) => {
          const isConnected = connectedIds.includes(platform.id);
          const details = connectedDetails[platform.id];

          return (
            <div
              key={platform.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                isConnected
                  ? "border-emerald-500/30 bg-[#0d121c]/90 shadow-lg shadow-emerald-500/5 hover:border-emerald-500/50"
                  : "border-white/8 bg-[#0d101a]/80 hover:border-white/18 hover:bg-[#101422]"
              }`}
            >
              {/* Card Content Top */}
              <div>
                {/* Status Badge in Top Right Corner */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 truncate max-w-[120px]">
                    {platform.category}
                  </span>

                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {platform.tools.length} Tools
                    </span>
                  )}
                </div>

                {/* Platform Logo in the Center */}
                <div className="my-3 flex justify-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 p-3 shadow-inner group-hover:scale-105 transition-transform duration-200">
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                    {isConnected && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/40">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Platform Name in Center */}
                <div className="text-center mt-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {platform.name}
                  </h3>
                  {isConnected && details?.email && (
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-mono text-emerald-400/90 truncate max-w-[180px]">
                        {details.email}
                      </span>
                      {details.isReal && (
                        <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] px-1 font-sans font-semibold">
                          Live
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Two-Line Description */}
                <p className="mt-2 text-xs text-slate-400 text-center line-clamp-2 min-h-[2.5rem] leading-relaxed">
                  {platform.description}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3.5 border-t border-white/8 space-y-2">
                {isConnected ? (
                  /* Connected State: Disconnect Button + Settings Button */
                  <div className="flex items-center gap-2">
                    {/* Settings Button: Opens MCP tools and actions dialog */}
                    <button
                      id={`settings-${platform.id}-btn`}
                      onClick={() => handleOpenSettings(platform)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-2 px-3 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all shadow-sm"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </button>

                    {/* Disconnect Button: Allows disconnecting anytime */}
                    <button
                      id={`disconnect-${platform.id}-btn`}
                      onClick={() => handleDisconnect(platform.id)}
                      title="Disconnect integration"
                      className="inline-flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 py-2 px-3 text-xs font-medium text-rose-300 hover:bg-rose-500/15 hover:border-rose-500/30 transition-all"
                    >
                      <Unplug className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:inline-block">Disconnect</span>
                    </button>
                  </div>
                ) : (
                  /* Disconnected State: Connect Button */
                  <button
                    id={`connect-${platform.id}-btn`}
                    onClick={() => handleConnect(platform)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-3 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 transition-all group/btn"
                  >
                    <span>Connect</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPlatforms.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0d101a] p-12 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 mx-auto text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No integration platforms found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try tweaking your search term or select &quot;All&quot; to browse all available MCP platforms.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Security & Architecture Note */}
      <div className="rounded-2xl border border-white/8 bg-[#090b12] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white">
              Official Model Context Protocol Architecture
            </h4>
            <p className="text-xs text-slate-400">
              OmniSync operates exclusively via authenticated MCP tool calls and scoped tokens.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">MCP Protocol v2024-11-05</span>
        </div>
      </div>

      {/* Platform Connect Modal */}
      <PlatformConnectModal
        platform={connectPlatform}
        isOpen={Boolean(connectPlatform)}
        onClose={() => setConnectPlatform(null)}
        onConnectSuccess={handleConnectSuccess}
      />

      {/* Platform Settings Modal (Shows MCP tools, actions, and Gmail live inbox) */}
      <PlatformSettingsModal
        platform={settingsPlatform}
        isOpen={Boolean(settingsPlatform)}
        onClose={() => setSettingsPlatform(null)}
        onDisconnect={handleDisconnect}
        connectedAccount={
          settingsPlatform ? connectedDetails[settingsPlatform.id] : undefined
        }
      />
    </div>
  );
}
