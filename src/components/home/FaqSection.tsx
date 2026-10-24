"use client";

import React, { useState } from "react";
import { SEED_FAQS } from "@/lib/db/seed-data";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#FDFBF7] border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B38A38] font-bold font-mono">
            <HelpCircle className="w-4 h-4 text-[#C5A059]" />
            <span>Clear Guidance</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm mt-3">
            Find immediate answers regarding delivery, payment security, statutory updates, and copyright usage.
          </p>
        </div>

        <div className="space-y-3">
          {SEED_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 focus:outline-none hover:bg-stone-50/70"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-stone-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#C5A059]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FDFBF7]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
