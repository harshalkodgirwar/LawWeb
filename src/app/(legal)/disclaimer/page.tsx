import React from "react";
import { Metadata } from "next";
import { ShieldAlert, Scale, AlertTriangle } from "lucide-react";
import { getProfileContent } from "@/lib/supabase/data-service";

export default async function DisclaimerPage() {
  const profile = await getProfileContent();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";
  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#B38A38] font-mono font-bold">
            Statutory & Professional Notice
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B132B] mt-1">
            Professional Disclaimer & Regulatory Notice
          </h1>
          <p className="text-xs text-stone-500 mt-1">In compliance with the Bar Council of India (BCI) Rules</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Bar Council of India Rule 36 (Section IV) Compliance:</strong> Under the rules framed by the Bar Council of India, advocates are not permitted to advertise, solicit client work, or promote their legal practice. By visiting this website or accessing its materials, you explicitly confirm that you are doing so voluntarily for academic, educational, and exam-preparation purposes only.
          </div>
        </div>

        <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            1. Educational Content vs. Legal Advice
          </h2>
          <p>
            The content, notes, judgment summaries, procedural flowcharts, articles, and sample pleadings available on this website are designed exclusively for educational and academic enlightenment. None of the materials constitute tailored legal counsel, formal opinions, or statutory interpretations applicable to any specific ongoing litigation.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            2. No Advocate-Client Relationship
          </h2>
          <p>
            Visiting this website, purchasing digital study materials, downloading free sample resources, or sending messages via our contact form does <strong>NOT</strong> create an advocate-client relationship between you and {lawyerName} or his chambers. If you are facing actual legal disputes or litigation, you must seek independent legal counsel from a licensed advocate in your relevant jurisdiction.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            3. Accuracy of Judicial Precedents & Legislative Updates
          </h2>
          <p>
            While every effort has been taken to ensure that all case citations, statutory sections (including the transition to Bharatiya Nyaya Sanhita 2023, BNSS 2023, and BSA 2023), and model answers are updated through October 2026, judicial rulings and legislative amendments evolve dynamically. Readers are advised to verify primary sources and authoritative Gazettes before relying upon any proposition in court pleadings.
          </p>
        </div>
      </div>
    </div>
  );
}
