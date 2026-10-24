import React from "react";
import { getCategories, getProducts } from "@/lib/supabase/data-service";
import MarketplaceClient from "@/components/materials/MarketplaceClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Materials Marketplace | Legal Notes, Bare Act Guides & Exam Books",
  description:
    "Explore authoritative legal study materials in Constitutional Law, BNS/BNSS Criminal Law, CPC Civil Procedure, and Judiciary Mains Answer Writing.",
};

interface MarketplacePageProps {
  searchParams: Promise<{
    cat?: string;
    search?: string;
  }>;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="bg-[#080D1A] text-white py-14 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest text-[#E5C378] font-mono font-medium">
            Digital Study Store
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Legal Study Materials & Compendiums
          </h1>
          <p className="text-stone-300 text-sm mt-2 max-w-2xl font-light">
            Searchable, high-resolution PDF notes, flowcharts, and judgment writing blueprints authored for Judicial Services examinations and law school finals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <MarketplaceClient
          initialProducts={products}
          categories={categories}
          initialCategory={resolvedParams.cat || "all"}
        />
      </div>
    </div>
  );
}
