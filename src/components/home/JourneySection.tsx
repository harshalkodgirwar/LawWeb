"use client";

import React from "react";
import Link from "next/link";
import { Scale, Award, BookOpen, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import { YouTubeIcon, InstagramIcon, LinkedInIcon, TelegramIcon } from "@/components/ui/SocialIcons";
import { useProfile } from "@/lib/useProfile";

export default function JourneySection() {
  const profile = useProfile();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";
  const initials = lawyerName
    .replace(/^Adv\.?\s+/i, "")
    .split(" ")
    .map((n: string) => n[0])
    .join("") || "HK";

  return (
    <section className="py-24 bg-[#080D1A] text-white border-b border-[#C5A059]/30 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#1C2541]/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Showcase of Journey */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-[#0B132B] to-[#1C2541] border border-[#C5A059]/40 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="text-xs uppercase tracking-widest text-[#E5C378] font-mono">
                  The Educator's Manifesto
                </span>
                <Scale className="w-5 h-5 text-[#C5A059]" />
              </div>

              <blockquote className="my-6 text-sm sm:text-base font-serif italic text-stone-200 leading-relaxed">
                "Indian jurisprudence is vast and majestic. However, law school curriculum often leaves students stranded between theoretical bare text and actual litigation reality. My mission is to give every law student, regardless of tier, the highest standard of judicial clarity."
              </blockquote>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#080D1A] font-bold flex items-center justify-center font-serif text-base">
                  {initials}
                </div>
                <div>
                  <div className="font-serif text-sm font-bold text-white">{lawyerName}</div>
                  <div className="text-[11px] text-[#C5A059]">Advocate & Author</div>
                </div>
              </div>
            </div>

            {/* Chamber Credentials Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-white/10">
                <Award className="w-5 h-5 text-[#C5A059] mb-2" />
                <div className="text-xs font-semibold text-white">Court Appearances</div>
                <div className="text-[11px] text-stone-400 mt-1">
                  {profile.stats?.yearsInLitigation ? `${profile.stats.yearsInLitigation} Practice` : "Supreme Court & High Courts"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-white/10">
                <HeartHandshake className="w-5 h-5 text-[#C5A059] mb-2" />
                <div className="text-xs font-semibold text-white">Mentorship Reach</div>
                <div className="text-[11px] text-stone-400 mt-1">
                  {profile.stats?.studentsMentored || "150,000+"} Students Mentored
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Mission */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2541] border border-[#C5A059]/40 text-[#E5C378] text-xs font-mono tracking-wider uppercase">
              Advocate's Journey & Pedagogy
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Bridging the Chasm Between the Bare Act and the Bench.
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
              Starting as a dedicated litigator, {lawyerName} recognized early on that passing judicial services or succeeding in courtroom arguments requires far more than rote memorization. It demands structured problem-solving, mastery of constitutional principles, and the ability to articulate concise legal holdings.
            </p>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
              Over the last decade, his legal analysis videos and study frameworks have demystified landmark Constitution Bench decisions and simplified procedural bottlenecks in CPC, CrPC, and Evidence Law. With the landmark enactment of Bharatiya Nyaya Sanhita (BNS) and allied codes, he has spearheaded national orientation programs for lawyers and judicial aspirants.
            </p>

            {/* Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Doctrinal Precision Over Rote Learning</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Every compendium is written in IRAC (Issue, Rule, Analysis, Conclusion) format, mirroring the actual evaluation methodology of State Public Service Commissions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Visual Procedural Flowcharts</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Transforming convoluted statutory provisions into 1-page visual flowcharts for fast retention during the final 48 hours prior to judicial mains examinations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Constitutional Pedagogy</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Analyzing not just what the Supreme Court held, but the underlying jurisprudence and judicial reasoning that candidates must reproduce in their answers.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Banner */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B132B] border border-[#C5A059]/30">
              <div className="text-xs text-stone-300">
                Join our legal academic community on social platforms:
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={profile.socials?.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] transition-colors"
                  title="YouTube"
                >
                  <YouTubeIcon className="w-4 h-4 text-red-500" />
                </a>
                <a
                  href={profile.socials?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] transition-colors"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                </a>
                <a
                  href={profile.socials?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] transition-colors"
                  title="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4 text-blue-500" />
                </a>
                <a
                  href={profile.socials?.telegram || "https://t.me"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] transition-colors"
                  title="Telegram"
                >
                  <TelegramIcon className="w-4 h-4 text-sky-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
