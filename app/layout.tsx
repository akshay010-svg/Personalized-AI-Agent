import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmniSync AI | Unified AI Assistant for Gmail, WhatsApp, Telegram & Outlook",
  description:
    "Connect your Gmail, WhatsApp, Telegram, and Outlook to an autonomous AI assistant. Get automated daily executive summaries, instant smart reminders, cross-channel search, and zero inbox clutter.",
  keywords: [
    "AI personal assistant",
    "Gmail AI summary",
    "WhatsApp AI assistant",
    "Telegram AI bot",
    "Outlook AI reminder",
    "executive briefing",
    "smart reminders",
    "cross-platform AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
