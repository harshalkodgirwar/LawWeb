"use client";

import React from "react";
import Link from "next/link";
import { Scale, ArrowRight, BookOpen, CheckCircle, GraduationCap } from "lucide-react";
import { SEED_PROFILE_CONFIG } from "@/lib/db/seed-data";
import { useProfile } from "@/lib/useProfile";

export default function HeroSection({ profile: initialProfile }: { profile?: any }) {
  const dynamicProfile = useProfile();
  const profile = dynamicProfile || initialProfile || SEED_PROFILE_CONFIG;
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";

  return (
    <section className="relative overflow-hidden bg-[#080D1A] text-white pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#C5A059]/30">
      {/* Decorative Gold & Navy Ambient Background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#1C2541]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C2541] border border-[#C5A059]/40 text-[#E5C378] text-xs font-medium tracking-wide shadow-inner">
              <Scale className="w-3.5 h-3.5" />
              <span>{profile?.designation || "Advocate • Supreme Court of India & High Court"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Master the Law with{" "}
              <span className="bg-gradient-to-r from-[#C5A059] via-[#E5C378] to-[#C5A059] bg-clip-text text-transparent">
                Courtroom Precision
              </span>{" "}
              & Academic Rigor.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Authored by <strong className="font-semibold text-white">{lawyerName}</strong>. Meticulously structured digital study compendiums, visual procedural flowcharts, and judiciary mains answer-writing frameworks trusted by over 150,000+ law students and judicial aspirants across India.
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-300 pt-2 pb-2">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Updated for BNS & BNSS</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>100% Instant PDF Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>IRAC Answer Writing Format</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/materials"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] font-bold text-sm shadow-xl hover:brightness-105 hover:scale-[1.02] transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Study Materials</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#1C2541]/90 hover:bg-[#1C2541] border border-[#C5A059]/40 text-stone-200 font-semibold text-sm transition-all"
              >
                <span>About {lawyerName}</span>
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#E5C378]">
                  {profile.stats?.studentsMentored || "150K+"}
                </div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Community Mentored</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#E5C378]">
                  {profile.stats?.judicialOfficersProduced || "180+"}
                </div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Judicial Officers</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#E5C378]">
                  {profile.stats?.yearsInLitigation || "10+ Years"}
                </div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Courtroom Practice</div>
              </div>
            </div>
          </div>

          {/* Right Column: Prestigious Visual Presentation */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Outer Golden Glow & Frame */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-b from-[#C5A059] via-[#E5C378]/40 to-[#0B132B] opacity-60 blur-sm" />

              <div className="relative bg-[#0B132B] rounded-2xl border border-[#C5A059]/50 p-6 shadow-2xl overflow-hidden">
                {/* Header Crest inside Card */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1C2541] border border-[#C5A059] flex items-center justify-center text-[#E5C378]">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-serif text-sm font-bold text-white">Chamber Profile</div>
                      <div className="text-[10px] text-[#C5A059] font-mono">
                        {profile.barCouncilNumber || "SUPREME COURT ADVOCATE"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    ENROLLED ADVOCATE
                  </span>
                </div>

                {/* Simulated Portrait with Dignified Silhouette / Crest */}
                <div className="my-5 relative rounded-xl bg-gradient-to-b from-[#1C2541] via-[#0D152A] to-[#080D1A] border border-[#C5A059]/30 p-6 text-center">
                  <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-[#0B132B] to-[#1C2541] border-2 border-[#C5A059] shadow-xl flex items-center justify-center text-[#E5C378] relative overflow-hidden font-serif text-2xl font-bold">
                    {lawyerName
                      .replace(/^Adv\.?\s+/i, "")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("") || "HK"}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mt-4">
                    {lawyerName}
                  </h3>
                  <p className="text-xs text-[#E5C378] font-medium mt-0.5">
                    {profile.qualifications || "B.A. LL.B (Hons.), LL.M"}
                  </p>
                  <p className="text-xs text-stone-400 mt-2 italic max-w-xs mx-auto">
                    "Law is not merely statutes to be memorized, but an intellectual instrument of justice."
                  </p>
                </div>

                {/* Highlight Badges */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C2541]/70 border border-white/5">
                    <span className="text-stone-300 font-medium">Courtroom Practice</span>
                    <span className="text-[#E5C378] font-semibold">{profile.stats?.yearsInLitigation || "10+ Years"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C2541]/70 border border-white/5">
                    <span className="text-stone-300 font-medium">Students & Aspirants</span>
                    <span className="text-[#E5C378] font-semibold">{profile.stats?.studentsMentored || "150,000+"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C2541]/70 border border-white/5">
                    <span className="text-stone-300 font-medium">Chambers</span>
                    <span className="text-stone-300 text-[11px] truncate max-w-[180px]">
                      {profile.contact?.officeLocation || "New Delhi & Mumbai"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
