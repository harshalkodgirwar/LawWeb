import React from "react";
import Link from "next/link";
import { Product } from "@/lib/db/types";
import ProductCard from "../materials/ProductCard";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";

interface FeaturedMaterialsProps {
  products: Product[];
}

export default function FeaturedMaterials({ products }: FeaturedMaterialsProps) {
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-20 bg-[#FDFBF7] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B38A38] font-bold font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Curated Legal Compendiums</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] tracking-tight">
              Featured Study Materials
            </h2>
            <p className="text-stone-600 text-sm mt-2 max-w-2xl">
              Comprehensive, syllabus-oriented PDF master notes designed to secure top ranks in State Judicial Services, UPSC Law Optional, and University Finals.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/materials"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B132B] hover:text-[#C5A059] group transition-colors"
            >
              <span>View All 15+ Study Notes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, idx) => {
            const variants = ["navy", "burgundy", "emerald", "charcoal"] as const;
            const variant = variants[idx % variants.length];
            return <ProductCard key={product.id} product={product} variant={variant} />;
          })}
        </div>

        {/* Bottom Banner callout */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C5A059]/40 shadow-xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-white">
                Looking for specific subjects or custom chapter compilations?
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                Explore our full digital store with category filters for CPC, CrPC/BNSS, Evidence Act/BSA, and Land Laws.
              </p>
            </div>
          </div>
          <Link
            href="/materials"
            className="shrink-0 px-6 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#E5C378] text-[#080D1A] text-xs font-bold transition-all shadow-md"
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
