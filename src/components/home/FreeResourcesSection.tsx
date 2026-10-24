import React from "react";
import Link from "next/link";
import { SEED_FREE_RESOURCES } from "@/lib/db/seed-data";
import { Download, FileText, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export default function FreeResourcesSection() {
  return (
    <section className="py-20 bg-[#FDFBF7] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B38A38] font-bold font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Free Educational Downloads</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B]">
              Complimentary Legal Study Guides
            </h2>
            <p className="text-stone-600 text-sm mt-2 max-w-2xl">
              Preview the caliber of our master notes with these open-access concordance charts, judgment writing blueprints, and doctrinal flowcharts.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#0B132B] hover:text-[#C5A059] transition-colors"
            >
              <span>View All Free Downloads</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEED_FREE_RESOURCES.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-[#C5A059]/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.format}
                  </span>
                  <span className="text-stone-400 text-[11px]">{item.fileSize}</span>
                </div>

                <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3">
                  <span>{item.pages} Pages</span>
                  <span>{item.downloadCount} Downloads</span>
                </div>

                <a
                  href={`/resources#${item.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-stone-100 hover:bg-[#0B132B] text-stone-800 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Free Guide</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
