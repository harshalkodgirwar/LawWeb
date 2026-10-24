"use client";

import React, { useState, useMemo } from "react";
import { Product, Category } from "@/lib/db/types";
import ProductCard from "./ProductCard";
import { Search, Filter, SlidersHorizontal, BookOpen, AlertCircle, Sparkles, X } from "lucide-react";
import { useProfile } from "@/lib/useProfile";

interface MarketplaceClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function MarketplaceClient({
  initialProducts,
  categories,
  initialCategory = "all",
}: MarketplaceClientProps) {
  const profile = useProfile();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [maxPrice, setMaxPrice] = useState<number>(120000); // 120000 paise = ₹1200

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all") {
          const matchCat =
            product.category_id === selectedCategory ||
            product.category?.slug === selectedCategory;
          if (!matchCat) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchShort = product.short_description.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchTitle && !matchShort && !matchDesc) return false;
        }

        // Price filter
        if (product.price_paise > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price_asc":
            return a.price_paise - b.price_paise;
          case "price_desc":
            return b.price_paise - a.price_paise;
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "popularity":
          default:
            return b.sales_count - a.sales_count;
        }
      });
  }, [initialProducts, selectedCategory, searchQuery, sortBy, maxPrice]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(120000);
    setSortBy("popularity");
  };

  return (
    <div className="space-y-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by topic, act, or keyword (e.g. BNS, Writs, CPC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Quick Select */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Sort By:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          >
            <option value="popularity">Most Popular / Bestsellers</option>
            <option value="newest">Recently Added</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C5A059]" />
                <span>Categories</span>
              </h3>
              {(selectedCategory !== "all" || searchQuery || maxPrice < 120000) && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-[#B38A38] hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Radios / Badges */}
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === "all"
                    ? "bg-[#0B132B] text-white font-semibold"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span>All Legal Subjects</span>
                <span className="text-[10px] opacity-75">{initialProducts.length}</span>
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                const count = initialProducts.filter(
                  (p) => p.category_id === cat.id || p.category?.slug === cat.slug
                ).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-[#0B132B] text-white font-semibold"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">Max Budget:</span>
                <span className="font-mono text-stone-900 font-bold">₹{maxPrice / 100}</span>
              </div>
              <input
                type="range"
                min="30000"
                max="120000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <span>₹300</span>
                <span>₹1,200</span>
              </div>
            </div>

            {/* Assurance Callout */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <span className="font-semibold block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Guaranteed Authenticity
              </span>
              <p className="text-amber-800/90 leading-tight">
                All study modules are copyrighted original compilations authored by {profile.name || "Adv. Harshal Kodgirwar"}.
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 font-medium">
                Showing <strong className="text-stone-800">{filteredProducts.length}</strong> legal compendiums
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => {
                  const variants = ["navy", "burgundy", "emerald", "charcoal"] as const;
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={variants[idx % variants.length]}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                No Study Materials Found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We could not find any materials matching "{searchQuery}" under the selected filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#0B132B] text-white text-xs font-semibold rounded-lg hover:bg-[#1C2541] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
