"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/lib/db/types";
import { formatINR, calculateDiscount } from "@/lib/utils";
import BookCover from "./BookCover";
import { Star, CheckCircle, ArrowRight, ShoppingBag, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "navy" | "burgundy" | "emerald" | "charcoal";
}

export default function ProductCard({ product, variant = "navy" }: ProductCardProps) {
  const discount = calculateDiscount(product.original_price_paise, product.price_paise);

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-xl hover:-translate-y-1">
      {/* Book Cover Area */}
      <div className="p-4 bg-stone-50/60 border-b border-stone-100 flex items-center justify-center relative">
        <div className="w-full max-w-[220px]">
          <BookCover
            title={product.title}
            category={product.category?.name || "Judicial Compendium"}
            pageCount={product.page_count}
            variant={variant}
          />
        </div>

        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-[#B38A38] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md tracking-wider">
            {discount}% OFF
          </div>
        )}

        {product.is_featured && (
          <div className="absolute top-4 left-4 bg-[#0B132B] text-[#E5C378] text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded border border-[#C5A059]/40">
            Bestseller
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-medium text-[#7C632C] bg-[#F7F3E8] px-2 py-0.5 rounded">
              {product.category?.name || "Legal Notes"}
            </span>
            <div className="flex items-center text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-500" />
              <span>{product.rating || "4.9"}</span>
              <span className="text-stone-400 text-[11px] ml-1">({product.reviews_count || 120})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/materials/${product.slug}`} className="block group-hover:text-[#0B132B]">
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug line-clamp-2 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>

          {/* Highlights */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-3 text-[11px] text-stone-500">
            <span className="flex items-center text-emerald-700 font-medium">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Instant Download
            </span>
            <span>•</span>
            <span>{product.page_count ? `${product.page_count} Pages` : "Complete Guide"}</span>
          </div>
        </div>

        {/* Pricing and Actions */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#0B132B] font-serif">
                {formatINR(product.price_paise)}
              </span>
              {product.original_price_paise && (
                <span className="text-xs text-stone-400 line-through">
                  {formatINR(product.original_price_paise)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 block">Inc. of all taxes</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/materials/${product.slug}`}
              className="p-2 text-stone-600 hover:text-[#0B132B] hover:bg-stone-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              href={`/checkout/${product.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:shadow hover:scale-[1.02] border border-[#C5A059]/30"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Buy Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
