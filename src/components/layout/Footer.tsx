"use client";

import React from "react";
import Link from "next/link";
import { Scale, Mail, MapPin, Clock, ShieldAlert } from "lucide-react";
import { YouTubeIcon, InstagramIcon, LinkedInIcon, TelegramIcon } from "@/components/ui/SocialIcons";
import { useProfile } from "@/lib/useProfile";

export default function Footer() {
  const profile = useProfile();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";

  return (
    <footer className="bg-[#080D1A] text-stone-300 border-t border-[#C5A059]/25 text-sm">
      {/* Upper Footer: Credentials and Newsletter / Direct Chambers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1 & 2: Branding & Chambers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1C2541] border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  {lawyerName}
                </h3>
                <p className="text-xs text-[#C5A059] font-mono uppercase">
                  {profile.designation || "Chambers & Legal Education Academy"}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed pr-6 line-clamp-3">
              {profile.bio ||
                "Practicing Advocate before the Supreme Court of India and High Court. Dedicated to raising the benchmark of legal pedagogy through rigorous, syllabus-aligned judicial exam compendiums and courtroom litigation frameworks."}
            </p>

            <div className="pt-2 space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <a href={`mailto:${profile.contact?.email || "contact@advharshal.com"}`} className="hover:text-white transition-colors">
                  {profile.contact?.email || "contact@advharshal.com"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>{profile.contact?.officeLocation || "Chambers: Supreme Court of India / High Court Bench, New Delhi"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>{profile.contact?.hours || "Office: Mon – Sat, 10:00 AM – 7:00 PM IST"}</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 flex items-center space-x-3">
              <a
                href={profile.socials?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] flex items-center justify-center text-stone-300 transition-colors"
                aria-label="YouTube Channel"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href={profile.socials?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] flex items-center justify-center text-stone-300 transition-colors"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={profile.socials?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] flex items-center justify-center text-stone-300 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href={profile.socials?.telegram || "https://t.me"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1C2541] hover:bg-[#C5A059] hover:text-[#080D1A] flex items-center justify-center text-stone-300 transition-colors"
                aria-label="Telegram Community"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: Academic Resources */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#E5C378] tracking-wider uppercase">
              Study Series
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/materials?category=constitutional-law" className="hover:text-white transition-colors">
                  Constitutional Law Compendiums
                </Link>
              </li>
              <li>
                <Link href="/materials?category=criminal-law" className="hover:text-white transition-colors">
                  New Criminal Codes (BNS, BNSS, BSA)
                </Link>
              </li>
              <li>
                <Link href="/materials?category=civil-law" className="hover:text-white transition-colors">
                  Civil Procedure & Injunction Notes
                </Link>
              </li>
              <li>
                <Link href="/materials?category=judiciary-preparation" className="hover:text-white transition-colors">
                  Judiciary Mains Answer Writing
                </Link>
              </li>
              <li>
                <Link href="/materials?category=case-law-summaries" className="hover:text-white transition-colors">
                  Landmark Ratio Decidendi Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#E5C378] tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About {lawyerName}
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-white transition-colors">
                  All Study Materials
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Free Downloadable Notes
                </Link>
              </li>
              <li>
                <Link href="/account/library" className="hover:text-white transition-colors">
                  My Purchased Library
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Order Invoices & Receipts
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Chambers & Support Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#E5C378] tracking-wider uppercase">
              Trust & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/license" className="hover:text-white transition-colors">
                  Digital Product License Terms
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Legal Disclaimer & Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box as per Bar Council Norms */}
        <div className="mt-12 p-4 rounded-xl bg-[#0B132B]/90 border border-[#C5A059]/30 text-stone-400 text-[11px] leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#E5C378] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-200">Bar Council of India & Professional Compliance Disclaimer:</span> As per the rules of the Bar Council of India, advocates are prohibited from soliciting work or advertising. This website is exclusively maintained for academic, educational, and exam-preparation purposes for law students, judicial aspirants, and scholars. No material, notes, or videos available on this site constitute personalized legal advice, and viewing or purchasing materials does not create an advocate-client relationship.
          </div>
        </div>

        {/* Bottom Copyright & Razorpay badge */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 {lawyerName}. All rights reserved. Intellectual Property protected.</p>
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span>Secured Payments in INR via</span>
            <span className="font-semibold text-white px-2 py-0.5 rounded bg-blue-950/80 border border-blue-600/40 text-blue-300">
              Razorpay
            </span>
            <span>• 256-Bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
