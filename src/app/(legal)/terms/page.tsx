import React from "react";
import { Metadata } from "next";
import { getProfileContent } from "@/lib/supabase/data-service";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions governing website usage and digital study material purchases.",
};

export default async function TermsPage() {
  const profile = await getProfileContent();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";
  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#B38A38] font-mono font-bold">
            Agreement
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B132B] mt-1">
            Terms & Conditions
          </h1>
          <p className="text-xs text-stone-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            1. Nature of the Website
          </h2>
          <p>
            This website serves as an academic portfolio and digital study materials marketplace operated by {lawyerName}. By accessing this platform or purchasing study compendiums, you acknowledge that all materials provided are strictly educational and do not constitute personalized legal counsel or create an advocate-client relationship.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            2. Intellectual Property Rights
          </h2>
          <p>
            All study notes, judgment summaries, procedural flowcharts, templates, and exam blueprints are the sole intellectual property of {lawyerName} under the Indian Copyright Act, 1957. Purchasing a study compendium grants you a single, personal, non-exclusive, non-transferable license to read and print the document for your own private study.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            3. Prohibition of Resale & Public Distribution
          </h2>
          <p>
            Unauthorized redistribution, resale, file-sharing on Telegram/WhatsApp channels, uploading to cloud storage repositories, or copying of text into competing commercial publications is strictly illegal and will result in permanent revocation of library access and immediate civil/criminal legal action.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            4. Digital Delivery
          </h2>
          <p>
            Upon successful completion of payment via Razorpay, materials are immediately made available for download in your authenticated account under "My Library".
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            5. Jurisdiction
          </h2>
          <p>
            Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts in New Delhi / Mumbai, India.
          </p>
        </div>
      </div>
    </div>
  );
}
