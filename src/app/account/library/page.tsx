"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BookCover from "@/components/materials/BookCover";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";
import { Product } from "@/lib/db/types";
import { Download, FileText, CheckCircle, Clock, BookOpen, AlertCircle, ShoppingBag, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LibraryItem {
  id: string;
  product: Product;
  granted_at: string;
  order_id: string;
}

export default function MyLibraryPage() {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadLibrary = () => {
      // 1. Check local purchases stored in localStorage
      let purchasedProductIds: string[] = [];
      if (typeof window !== "undefined") {
        const storedPurchases = localStorage.getItem("demo_purchased_products");
        if (storedPurchases) {
          try {
            purchasedProductIds = JSON.parse(storedPurchases);
          } catch {
            // ignore
          }
        }
      }

      // If no purchases made yet, keep library clean (no unwanted demo data)
      if (purchasedProductIds.length === 0) {
        setLibrary([]);
        setLoading(false);
        return;
      }

      // 2. Load latest product list to check publishing status
      let currentProducts: Product[] = [];
      if (typeof window !== "undefined") {
        const storedAdminProducts = localStorage.getItem("admin_custom_products");
        if (storedAdminProducts) {
          try {
            currentProducts = JSON.parse(storedAdminProducts);
          } catch {
            // ignore
          }
        }
      }

      const getProductById = (id: string): Product | undefined => {
        const fromAdmin = currentProducts.find((p) => p.id === id);
        if (fromAdmin) return fromAdmin;
        return SEED_PRODUCTS.find((p) => p.id === id);
      };

      // 3. Build library, strictly excluding hidden/unpublished materials
      const items: LibraryItem[] = purchasedProductIds
        .map((id) => {
          const prod = getProductById(id);
          // If product does not exist or was hidden/unpublished by admin, do NOT show in user library
          if (!prod || prod.is_published === false) return null;
          return {
            id: `ent-${prod.id}`,
            product: prod,
            granted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            order_id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          };
        })
        .filter(Boolean) as LibraryItem[];

      setLibrary(items);
      setLoading(false);
    };

    loadLibrary();

    // Listen to admin publish/hide updates in real-time
    const handleAdminSync = () => {
      loadLibrary();
    };

    window.addEventListener("admin_products_updated", handleAdminSync);
    window.addEventListener("storage", handleAdminSync);

    return () => {
      window.removeEventListener("admin_products_updated", handleAdminSync);
      window.removeEventListener("storage", handleAdminSync);
    };
  }, []);

  const handleDownload = (productId: string, title: string) => {
    setDownloadingId(productId);
    setDownloadMessage(null);

    try {
      const downloadUrl = `/api/downloads/${productId}?action=download`;
      const a = document.createElement("a");
      a.href = downloadUrl;
      const safeTitle = title.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().replace(/\s+/g, "_");
      a.download = `${safeTitle || "Study_Material"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadMessage(`Downloading "${title}"... Please check your downloads folder.`);
    } catch {
      setDownloadMessage(`Download initiated for "${title}".`);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const handleOpenPdf = (productId: string) => {
    window.open(`/api/downloads/${productId}?action=view`, "_blank");
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            My Study Library
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Access, view, and securely download your licensed study compendiums.
          </p>
        </div>

        <span className="text-xs font-mono text-[#B38A38] bg-[#F7F3E8] px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
          {library.length} Materials Owned
        </span>
      </div>

      {downloadMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-stone-400">
          Loading your study library...
        </div>
      ) : library.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {library.map((item, idx) => {
            const variants = ["navy", "burgundy", "emerald", "charcoal"] as const;
            const variant = variants[idx % variants.length];

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-stone-200 hover:border-[#C5A059] shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <BookCover
                      title={item.product.title}
                      category={item.product.category?.name}
                      pageCount={item.product.page_count}
                      variant={variant}
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-[#7C632C] bg-[#F7F3E8] px-2 py-0.5 rounded font-semibold">
                      {item.product.category?.name || "Judicial Series"}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                      {item.product.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>Purchased: {formatDate(item.granted_at)}</span>
                    </p>
                    <p className="text-[10px] font-mono text-stone-400">
                      Order: #{item.order_id}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/materials/${item.product.slug}`}
                    className="text-xs text-stone-500 hover:text-[#0B132B] font-medium"
                  >
                    View Details
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenPdf(item.product.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-200"
                      title="Open and read PDF directly in browser"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>Open PDF</span>
                    </button>

                    <button
                      onClick={() => handleDownload(item.product.id, item.product.title)}
                      disabled={downloadingId === item.product.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-bold shadow-sm transition-all border border-[#C5A059]/40"
                      title="Download PDF file to computer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#E5C378]" />
                      <span>
                        {downloadingId === item.product.id ? "Downloading..." : "Download PDF"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-800">
            Your Library is Currently Empty
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            You have not purchased any study compendiums yet. Explore our marketplace for constitutional law notes, criminal code guides, and judiciary answer-writing frameworks.
          </p>
          <Link
            href="/materials"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B132B] text-white text-xs font-bold hover:bg-[#1C2541] transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#E5C378]" />
            <span>Browse Study Materials</span>
          </Link>
        </div>
      )}
    </div>
  );
}
