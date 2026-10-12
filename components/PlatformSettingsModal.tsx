"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Cpu,
  Play,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Code2
} from "lucide-react";
import { PlatformIntegration, MCPTool } from "@/lib/integrations-data";

interface PlatformSettingsModalProps {
  platform: PlatformIntegration | null;
  isOpen: boolean;
  onClose: () => void;
  onDisconnect?: (platformId: string) => void;
  connectedAccount?: {
    email?: string;
    accessToken?: string;
  };
}

export default function PlatformSettingsModal({
  platform,
  isOpen,
  onClose,
  connectedAccount
}: PlatformSettingsModalProps) {
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(
    platform && platform.tools.length > 0 ? platform.tools[0] : null
  );
  const [toolInputs, setToolInputs] = useState<Record<string, string>>({});
  const [executingTool, setExecutingTool] = useState(false);
  const [toolOutput, setToolOutput] = useState<any>(null);

  if (!isOpen || !platform) return null;

  // Handle execution of any MCP tool
  const handleExecuteTool = async (tool: MCPTool) => {
    setExecutingTool(true);
    setToolOutput(null);

    try {
      if (platform.id === "gmail") {
        const response = await fetch("/api/mcp/gmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "execute_tool",
            tool: tool.name,
            params: toolInputs,
            accessToken: connectedAccount?.accessToken
          })
        });
        const data = await response.json();
        setToolOutput(data);
      } else {
        // Simulated execution for other MCP platform endpoints
        await new Promise((r) => setTimeout(r, 500));
        setToolOutput({
          tool: tool.name,
          status: "success",
          platform: platform.id,
          executedAt: new Date().toISOString(),
          parametersReceived: toolInputs,
          result: {
            message: `Tool ${tool.name} executed successfully via MCP.`,
            sampleData: tool.sampleOutput || { status: "ok", code: 200 }
          }
        });
      }
    } catch (err: any) {
      setToolOutput({ error: err.message || "Failed to execute MCP tool" });
    } finally {
      setExecutingTool(false);
    }
  };

  const currentTool = selectedTool || platform.tools[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-[#0a0d14] text-slate-100 z-10 shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header: Platform Logo + Name + Tool Count */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-4 bg-gradient-to-r from-white/[0.03] to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 p-2 shadow-inner">
              <Image
                src={platform.logo}
                alt={platform.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {platform.name} — Available MCP Tools
                </h2>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                  {platform.tools.length} Tools
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Model Context Protocol tool catalog and execution schema for {platform.name}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area: Only Available MCP Tools */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Tool Selection List */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 flex items-center justify-between">
              <span>Tool List</span>
              <span className="text-slate-500 font-mono">Select to test</span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {platform.tools.map((tool) => {
                const isSelected = currentTool?.name === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => {
                      setSelectedTool(tool);
                      setToolOutput(null);
                      const defaults: Record<string, string> = {};
                      tool.parameters.forEach((p) => {
                        if (p.default !== undefined) {
                          defaults[p.name] = String(p.default);
                        }
                      });
                      setToolInputs(defaults);
                    }}
                    className={`w-full text-left rounded-xl p-3 border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? "border-indigo-500/50 bg-indigo-500/10 shadow-sm"
                        : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-white truncate">
                        {tool.name}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          tool.type === "read"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {tool.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Tool Details & Runner */}
          <div className="lg:col-span-7">
            {currentTool ? (
              <div className="rounded-2xl border border-white/10 bg-[#07090e] p-4 sm:p-5 space-y-4">
                {/* Tool Title & Description */}
                <div className="border-b border-white/8 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {currentTool.displayName}
                    </h3>
                    <code className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {currentTool.name}
                    </code>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {currentTool.description}
                  </p>
                </div>

                {/* Parameters Form */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Input Parameters ({currentTool.parameters.length})
                  </div>

                  {currentTool.parameters.length === 0 ? (
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-slate-500 italic">
                      This MCP tool does not require any parameters.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {currentTool.parameters.map((param) => (
                        <div key={param.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <label className="font-mono text-indigo-300 text-[11px]">
                              {param.name}
                              {param.optional && (
                                <span className="text-slate-500 ml-1.5 font-sans text-[10px]">
                                  (optional)
                                </span>
                              )}
                            </label>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {param.type}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={toolInputs[param.name] ?? ""}
                            onChange={(e) =>
                              setToolInputs((prev) => ({
                                ...prev,
                                [param.name]: e.target.value
                              }))
                            }
                            placeholder={param.description}
                            className="w-full rounded-xl border border-white/10 bg-[#0d101a] px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Execution Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleExecuteTool(currentTool)}
                    disabled={executingTool}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
                  >
                    {executingTool ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Executing Tool via MCP...
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Execute MCP Tool
                      </>
                    )}
                  </button>
                </div>

                {/* Response Output Box */}
                {toolOutput && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-[#05070b] p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {toolOutput.error ? (
                        <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Execution Error
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Response Received ({toolOutput.dataSource || "MCP"})
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-slate-500">
                        {toolOutput.tool || currentTool.name}
                      </span>
                    </div>
                    <pre className="max-h-60 overflow-auto rounded-lg bg-black/60 p-3 font-mono text-[11px] text-indigo-200 leading-relaxed border border-white/5 scrollbar-thin">
                      {JSON.stringify(toolOutput, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center">
                <Cpu className="h-8 w-8 text-slate-500 mb-2" />
                <h4 className="text-xs font-semibold text-slate-300">
                  Select a tool to view parameters and test
                </h4>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 px-6 py-3 bg-[#07090e]/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>MCP Protocol Tools Schema</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
