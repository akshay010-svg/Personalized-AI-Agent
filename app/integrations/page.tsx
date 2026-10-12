"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntegrationsView from "@/components/IntegrationsView";
import ConnectModal from "@/components/ConnectModal";

export default function IntegrationsPage() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none fixed -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />
      <div className="pointer-events-none fixed bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[150px]" />

      <Navbar onOpenConnectModal={() => setConnectModalOpen(true)} />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <IntegrationsView />
      </main>

      <Footer />

      <ConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </div>
  );
}
