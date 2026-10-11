"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ConnectedPlatforms from "@/components/ConnectedPlatforms";
import BentoGridFeatures from "@/components/BentoGridFeatures";
import InteractiveSimulator from "@/components/InteractiveSimulator";
import HowItWorks from "@/components/HowItWorks";
import SecuritySection from "@/components/SecuritySection";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ConnectModal from "@/components/ConnectModal";

export default function Home() {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const handleOpenConnect = () => {
    setIsConnectModalOpen(true);
  };

  const handleCloseConnect = () => {
    setIsConnectModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Interactive Account Connection Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={handleCloseConnect}
      />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar onOpenConnectModal={handleOpenConnect} />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section with Interactive Cockpit Mockup */}
        <HeroSection onOpenConnectModal={handleOpenConnect} />

        {/* Dedicated 4-Platform Integration Showcase */}
        <ConnectedPlatforms onOpenConnectModal={handleOpenConnect} />

        {/* Bento Grid Features Layout */}
        <BentoGridFeatures />

        {/* Live Interactive Simulator (Try Before You Connect) */}
        <InteractiveSimulator />

        {/* 3-Step Setup & How It Works */}
        <HowItWorks onOpenConnectModal={handleOpenConnect} />

        {/* Bank-Grade Security & Zero Training Privacy */}
        <SecuritySection />

        {/* Real User Social Proof & Metrics */}
        <Testimonials />

        {/* Transparent Pricing Plans */}
        <Pricing onOpenConnectModal={handleOpenConnect} />

        {/* High Conversion Pre-Footer Banner */}
        <CtaBanner onOpenConnectModal={handleOpenConnect} />
      </main>

      {/* Comprehensive Enterprise Footer */}
      <Footer />
    </div>
  );
}
