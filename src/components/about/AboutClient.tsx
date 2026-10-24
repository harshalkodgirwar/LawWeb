"use client";

import React from "react";
import Link from "next/link";
import { Scale, Award, BookOpen, Briefcase } from "lucide-react";
import { YouTubeIcon, InstagramIcon, LinkedInIcon, TelegramIcon } from "@/components/ui/SocialIcons";
import { useProfile } from "@/lib/useProfile";
import { SEED_PROFILE_CONFIG } from "@/lib/db/seed-data";

export default function AboutClient({ initialProfile }: { initialProfile?: any }) {
  const dynamicProfile = useProfile();
  const profile = dynamicProfile || initialProfile || SEED_PROFILE_CONFIG;
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";
  const initials = lawyerName
    .replace(/^Adv\.?\s+/i, "")
    .split(" ")
    .map((n: string) => n[0])
    .join("") || "HK";

  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen">
      {/* Editorial Header */}
      <div className="bg-[#080D1A] text-white py-16 lg:py-20 border-b border-[#C5A059]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2541] border border-[#C5A059]/40 text-[#E5C378] text-xs font-mono uppercase mb-4">
            Curriculum Vitae & Chambers Profile
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {lawyerName}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-light mt-3 max-w-2xl leading-relaxed">
            {profile.designation} | {profile.qualifications}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Profile Card & At a Glance */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#0B132B] border-2 border-[#C5A059] flex items-center justify-center text-[#E5C378] font-serif text-2xl font-bold shadow-lg">
              {initials}
            </div>
            <div className="text-center">
              <h2 className="font-serif text-lg font-bold text-stone-900">{lawyerName}</h2>
              <p className="text-xs text-[#B38A38] font-mono mt-0.5">
                {profile.barCouncilNumber || "MAH/2841/2016"}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">Principal Fora</span>
                <span className="font-semibold text-stone-800">
                  Supreme Court of India, Delhi High Court & Bombay High Court
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">Specialization</span>
                <span className="font-semibold text-stone-800">
                  Constitutional Writs, Criminal Appellate Litigation, Commercial Arbitration
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">Chambers Location</span>
                <span className="font-semibold text-stone-800">
                  {profile.contact?.officeLocation || "New Delhi & Mumbai, India"}
                </span>
              </div>
              {profile.stats?.studentsMentored && (
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Mentorship Reach</span>
                  <span className="font-semibold text-stone-800">
                    {profile.stats.studentsMentored} Law Students & Aspirants
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100">
              <span className="text-stone-400 block text-[10px] uppercase font-mono mb-2">Connect Channels</span>
              <div className="flex items-center gap-2">
                <a
                  href={profile.socials?.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-stone-100 hover:bg-[#0B132B] hover:text-white transition-colors"
                  title="YouTube"
                >
                  <YouTubeIcon className="w-4 h-4 text-red-600" />
                </a>
                <a
                  href={profile.socials?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-stone-100 hover:bg-[#0B132B] hover:text-white transition-colors"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-600" />
                </a>
                <a
                  href={profile.socials?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-stone-100 hover:bg-[#0B132B] hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4 text-blue-600" />
                </a>
                <a
                  href={profile.socials?.telegram || "https://t.me"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-stone-100 hover:bg-[#0B132B] hover:text-white transition-colors"
                  title="Telegram"
                >
                  <TelegramIcon className="w-4 h-4 text-sky-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0B132B]">
                Professional Biography
              </h2>
              <div className="w-12 h-0.5 bg-[#C5A059] mt-2 mb-4" />
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-medium">
                {profile.bio}
              </p>
            </div>

            {/* Areas of Expertise */}
            <div className="pt-4">
              <h3 className="font-serif text-lg font-bold text-[#0B132B]">
                Areas of Legal Expertise
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                  <Scale className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Constitutional Law & Writs</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Articles 32, 226, administrative discretion, service jurisprudence.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                  <Briefcase className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">New Criminal Codes Transition</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Bharatiya Nyaya Sanhita, BNSS procedure, forensic mandate & bail.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Civil Procedure & Injunctions</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Res Judicata, Order XXXIX injunctions, decree execution (Order XXI).</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Judicial Mains Evaluation</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Civil and criminal judgment drafting, framing of issues & charges.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Content Creation Journey */}
            <div className="pt-4">
              <h3 className="font-serif text-lg font-bold text-[#0B132B]">
                The Legal Content Creation Journey
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed mt-2">
                What began as a chamber study circle for junior advocates preparing for Judicial Services examinations evolved into a nationwide digital movement. Recognizing that traditional law books are often filled with dated commentary and disorganized case lists, {lawyerName} started distilling complex precedents into crisp, 1-page ratio decidendi syntheses.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed mt-2">
                His comprehensive video analyses on transformative Supreme Court judgments have garnered millions of views, fostering a vibrant community of future civil judges, prosecutors, and research scholars who rely on his study materials for conceptual mastery.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to explore materials */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C5A059]/40 shadow-xl">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Explore Official Study Materials</h3>
            <p className="text-xs text-stone-300 mt-1 max-w-lg">
              Get immediate access to searchable PDF compendiums authored directly by {lawyerName}.
            </p>
          </div>
          <Link
            href="/materials"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] font-bold text-xs shadow-md hover:brightness-105 transition-all"
          >
            Browse All Materials
          </Link>
        </div>
      </div>
    </div>
  );
}
