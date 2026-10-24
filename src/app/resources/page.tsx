import React from "react";
import { SEED_FREE_RESOURCES } from "@/lib/db/seed-data";
import { Download, FileText, CheckCircle, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { getProfileContent } from "@/lib/supabase/data-service";

export const metadata: Metadata = {
  title: "Free Legal Study Resources & Concordance Tables",
  description:
    "Download complimentary IPC-to-BNS concordance matrices, Article 21 landmark flowcharts, and judgment writing sample blueprints.",
};

export default async function FreeResourcesPage() {
  const profile = await getProfileContent();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";
  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="bg-[#080D1A] text-white py-16 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest text-[#E5C378] font-mono font-medium">
            Open-Access Academic Repository
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-1">
            Free Legal Resources & Model Blueprints
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl font-light leading-relaxed">
            High-utility revision charts, criminal code cross-references, and procedural checklists curated by {lawyerName} for all law students and judicial aspirants.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SEED_FREE_RESOURCES.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="bg-white p-8 rounded-2xl border border-stone-200/90 shadow-sm hover:border-[#C5A059] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {item.format}
                  </span>
                  <span className="text-stone-400 font-mono">{item.fileSize} • {item.pages} Pages</span>
                </div>

                <h2 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                  {item.title}
                </h2>

                <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Instant Unrestricted PDF
                  </span>
                  <span>•</span>
                  <span>{item.downloadCount} Total Downloads</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                <a
                  href={`/free-preview?resource=${item.id}`}
                  download={item.title.replace(/\s+/g, "_") + ".pdf"}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#E5C378]" />
                  <span>Download PDF Document</span>
                </a>

                <span className="text-[11px] text-stone-400 font-mono">
                  Direct Download
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade Callout */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C5A059]/40 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-white">
              Ready for Exhaustive Judicial Exam Notes?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Our comprehensive paid compendiums contain complete 300+ page master notes, solved 10-year mains questions, and high-scoring IRAC blueprints.
            </p>
          </div>
          <Link
            href="/materials"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] font-bold text-xs shadow-md hover:brightness-105 transition-all"
          >
            <span>Explore Paid Study Notes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
