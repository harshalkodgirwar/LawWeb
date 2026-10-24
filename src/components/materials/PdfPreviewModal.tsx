"use client";

import React, { useState } from "react";
import { BookOpen, X, ChevronLeft, ChevronRight, FileText, CheckCircle, Shield } from "lucide-react";

interface PdfPreviewModalProps {
  title: string;
  category?: string;
  topics?: Array<{ title: string; subtopics?: string[] }>;
}

export default function PdfPreviewModal({ title, category, topics }: PdfPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPreviewPages = 4;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#C5A059] text-[#0B132B] hover:bg-[#FDFBF7] font-semibold text-xs sm:text-sm shadow-sm transition-all"
      >
        <BookOpen className="w-4 h-4 text-[#C5A059]" />
        <span>Read Sample Excerpt (Pages 1-4)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FDFBF7] w-full max-w-3xl rounded-2xl border border-[#C5A059]/40 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-[#080D1A] text-white flex items-center justify-between border-b border-[#C5A059]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1C2541] border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white truncate max-w-md">
                    Sample Excerpt: {title}
                  </h3>
                  <p className="text-[10px] text-[#C5A059] font-mono">
                    Watermarked Academic Preview • Page {currentPage} of {totalPreviewPages}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Document Preview Page */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#F4EFE6] flex justify-center">
              <div className="w-full max-w-xl bg-white rounded-lg shadow-xl border border-stone-300 p-8 sm:p-12 relative font-serif text-stone-800 text-xs sm:text-sm leading-relaxed space-y-4 select-none">
                {/* Diagonal Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-35deg] text-stone-900 font-bold text-4xl uppercase tracking-widest">
                  Preview Sample Only
                </div>

                {/* Excerpt Content per page */}
                {currentPage === 1 && (
                  <div>
                    <div className="text-center border-b border-[#C5A059]/30 pb-4 mb-4">
                      <span className="text-[10px] font-mono uppercase text-[#B38A38] font-bold">
                        CHAMBERS OF ADV. HARSHAL KODGIRWAR
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-[#0B132B] mt-1">
                        {title}
                      </h2>
                      <p className="text-[11px] text-stone-500 italic mt-0.5">
                        State Judicial Services & High Court Practice Compendium
                      </p>
                    </div>

                    <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
                      Table of Contents & Doctrinal Outline
                    </h3>
                    <ul className="space-y-2 text-xs text-stone-700">
                      {topics?.slice(0, 4).map((t, i) => (
                        <li key={i} className="flex justify-between border-b border-stone-100 pb-1">
                          <span>Chapter {i + 1}: {t.title}</span>
                          <span className="font-mono text-stone-400">P. {10 + i * 28}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPage === 2 && (
                  <div>
                    <div className="text-[10px] text-stone-400 font-mono pb-2 border-b border-stone-100 flex justify-between">
                      <span>Chapter 1: Foundational Jurisprudence</span>
                      <span>Section 1.1</span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm mt-3">
                      1.1 The Golden Triangle of Fundamental Rights (Articles 14, 19, and 21)
                    </h3>
                    <p className="mt-2 text-stone-700 leading-relaxed text-xs">
                      The historic transformation of constitutional adjudication in India began with the repudiation of the formalistic isolation doctrine in <em>A.K. Gopalan v. State of Madras (1950)</em>. In that decision, the Supreme Court held that Articles 19 and 21 operate in mutually exclusive silos.
                    </p>
                    <p className="mt-2 text-stone-700 leading-relaxed text-xs">
                      However, in <em>Maneka Gandhi v. Union of India (1978)</em>, Justice P.N. Bhagwati established the revolutionary "Golden Triangle" doctrine: any legislative or executive action affecting personal liberty must simultaneously pass the test of equality (Art. 14), procedural fairness (Art. 21), and fundamental freedoms (Art. 19).
                    </p>
                  </div>
                )}

                {currentPage === 3 && (
                  <div>
                    <div className="text-[10px] text-stone-400 font-mono pb-2 border-b border-stone-100 flex justify-between">
                      <span>Model Mains Answer Framework</span>
                      <span>Score: 18/20</span>
                    </div>

                    <div className="p-3 bg-stone-50 border-l-4 border-[#C5A059] text-xs font-mono text-stone-800 my-2">
                      <strong>Question:</strong> "Discuss the constitutional validity of arbitrary administrative actions under Article 14 with reference to the Wednesbury unreasonableness and proportionality test." [DJS Mains 2024]
                    </div>

                    <h4 className="font-bold text-stone-900 text-xs mt-3 uppercase">Structural Blueprint (IRAC Method):</h4>
                    <ol className="list-decimal pl-4 space-y-1.5 text-xs text-stone-700 mt-1">
                      <li><strong>Issue:</strong> Threshold between non-arbitrariness and proportionality.</li>
                      <li><strong>Rule:</strong> E.P. Royappa doctrine of antithesis to arbitrariness.</li>
                      <li><strong>Analysis:</strong> Shift from Wednesbury standard to the 4-pronged proportionality test (*Modern Dental College*).</li>
                      <li><strong>Conclusion:</strong> Modern constitutional synthesis.</li>
                    </ol>
                  </div>
                )}

                {currentPage === 4 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#0B132B] text-[#E5C378] mx-auto flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      End of Free Sample Pages
                    </h3>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto">
                      The full unredacted compendium contains complete notes, 140+ precedents, flowcharts, and solved mains question papers.
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2.5 bg-[#0B132B] text-white text-xs font-bold rounded-lg hover:bg-[#1C2541]"
                    >
                      Unlock Complete Master Notes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer with pagination */}
            <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <span className="font-mono text-stone-500 text-xs">
                Page {currentPage} of {totalPreviewPages}
              </span>

              <button
                disabled={currentPage === totalPreviewPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
