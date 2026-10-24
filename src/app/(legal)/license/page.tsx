import React from "react";
import { Metadata } from "next";
import { getProfileContent } from "@/lib/supabase/data-service";

export const metadata: Metadata = {
  title: "Digital Product License & Usage Terms",
  description: "End-user license terms for digital study materials and law compendiums.",
};

export default async function LicensePage() {
  const profile = await getProfileContent();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";
  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#B38A38] font-mono font-bold">
            End User Terms
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B132B] mt-1">
            Digital Product License & Usage Terms
          </h1>
          <p className="text-xs text-stone-500 mt-1">Single-User Personal Academic License</p>
        </div>

        <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            1. Grant of License
          </h2>
          <p>
            When you purchase any digital study material, PDF compendium, flowchart handbook, or template authored by {lawyerName}, you are granted a revocable, non-exclusive, non-transferable, single-user license strictly for your personal, non-commercial educational study.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            2. Permitted Uses
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Downloading and saving the PDF file onto up to 3 personal devices owned by you (e.g. tablet, laptop, phone).</li>
            <li>Annotating, highlighting, and taking personal notes on the digital file for examination preparation.</li>
            <li>Printing one physical hard copy of the document solely for your own private offline revision.</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            3. Prohibited Activities
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may <strong>NOT</strong> share, re-upload, distribute, or email the file to friends, batchmates, or online study groups.</li>
            <li>You may <strong>NOT</strong> broadcast or host the files on Telegram, WhatsApp, Google Drive, Scribd, or Torrent repositories.</li>
            <li>You may <strong>NOT</strong> resell, sublicense, rent, or lease the materials.</li>
            <li>You may <strong>NOT</strong> remove, obscure, or alter copyright notices, author attribution, or digital watermark identifiers embedded within the documents.</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            4. Institutional & Chamber Licensing
          </h2>
          <p>
            If you represent a law college, coaching institute, university library, or senior advocate's litigation chamber seeking multi-user distribution rights, please write to our institutional desk at <a href="mailto:contact@advharshal.com" className="text-[#B38A38] underline font-semibold">contact@advharshal.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
