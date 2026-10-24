import React from "react";
import { SEED_TESTIMONIALS } from "@/lib/db/seed-data";
import { Star, Quote, CheckCircle, Award } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#F6F3EB] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B38A38] font-bold font-mono">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>Success Stories & Proven Results</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mt-2">
            Trusted by Judicial Rank Holders & Advocates
          </h2>
          <p className="text-stone-600 text-sm mt-3">
            Read how our structured master notes and judgment writing frameworks helped students clear competitive judicial examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEED_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-stone-300" />
                </div>

                <p className="text-xs text-stone-700 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0B132B] text-[#E5C378] font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-[#C5A059]/40">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-stone-900 flex items-center gap-1">
                    <span>{t.name}</span>
                    {t.verifiedPurchase && (
                      <span title="Verified Reader" className="inline-flex">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
