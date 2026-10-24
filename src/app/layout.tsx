import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Adv. Harshal Kodgirwar | Supreme Court Advocate & Legal Study Materials",
    template: "%s | Adv. Harshal Kodgirwar",
  },
  description:
    "Authoritative legal study materials, judiciary mains answer-writing frameworks, new criminal law handbooks (BNS, BNSS, BSA), and constitutional law compendiums by Adv. Harshal Kodgirwar.",
  keywords: [
    "Lawyer Portfolio",
    "Judiciary Notes",
    "Legal Study Materials",
    "Constitutional Law Notes",
    "BNS BNSS Notes",
    "Judiciary Mains Answer Writing",
    "Supreme Court Advocate",
    "High Court Legal Drafting",
    "Law Notes PDF",
  ],
  authors: [{ name: "Adv. Harshal Kodgirwar" }],
  creator: "Adv. Harshal Kodgirwar",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://advharshal.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://advharshal.com",
    title: "Adv. Harshal Kodgirwar | Legal Study Materials & Judicial Preparation",
    description:
      "Premier legal notes, bare act guides, and judiciary preparation materials curated by Supreme Court & High Court litigator Adv. Harshal Kodgirwar.",
    siteName: "Adv. Harshal Kodgirwar - Chambers & Legal Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adv. Harshal Kodgirwar | Legal Study Materials",
    description: "Authoritative legal notes, case summaries, and judiciary masterclasses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sans.variable} ${mono.variable} scroll-smooth`}>
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        />
      </head>
      <body className="min-h-screen bg-[#FDFBF7] text-[#1E2229] font-sans flex flex-col selection:bg-[#C5A059]/25 selection:text-[#0B132B]">
        <Suspense fallback={<div className="h-20 bg-[#080D1A]" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
