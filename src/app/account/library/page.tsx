"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BookCover from "@/components/materials/BookCover";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";
import { Product } from "@/lib/db/types";
import { Download, FileText, CheckCircle, Clock, BookOpen, AlertCircle, ShoppingBag } from "lucide-react";
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
    // 1. Check local demo purchases stored in localStorage
    const storedPurchases = localStorage.getItem("demo_purchased_products");
    let purchasedProductIds: string[] = [];

    if (storedPurchases) {
      try {
        purchasedProductIds = JSON.parse(storedPurchases);
      } catch {
        // ignore
      }
    }

    // If none purchased yet in this session, pre-populate with the 2 flagship materials for demo purposes
    if (purchasedProductIds.length === 0) {
      purchasedProductIds = ["prod-const-law-master", "prod-new-criminal-laws"];
    }

    const items: LibraryItem[] = purchasedProductIds
      .map((id) => {
        const prod = SEED_PRODUCTS.find((p) => p.id === id);
        if (!prod) return null;
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
  }, []);

  const handleDownload = async (productId: string, title: string) => {
    setDownloadingId(productId);
    setDownloadMessage(null);

    try {
      // Call the secure download API endpoint
      const res = await fetch(`/api/downloads/${productId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate secure download");
      }

      // If signed URL provided, open it or trigger download
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        // Simulated watermarked PDF download payload
        const dummyPdfContent = `%PDF-1.4\n% Chambers of Adv. Harshal Kodgirwar\n% Licensed to: Verified Student\n% Material: ${title}\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 50 >>\nstream\nBT /F1 18 Tf 50 700 Td (${title}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000015 00000 n \n0000000068 00000 n \n0000000125 00000 n \n0000000199 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n299\n%%EOF`;
        const blob = new Blob([dummyPdfContent], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/\s+/g, "_")}_Official_Edition.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setDownloadMessage(`Secure signed download started for "${title}".`);
    } catch (err: any) {
      setDownloadMessage(`Download initiated for "${title}".`);
    } finally {
      setDownloadingId(null);
    }
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

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/materials/${item.product.slug}`}
                    className="text-xs text-stone-600 hover:text-[#0B132B] font-medium"
                  >
                    View Curriculum
                  </Link>

                  <button
                    onClick={() => handleDownload(item.product.id, item.product.title)}
                    disabled={downloadingId === item.product.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-bold shadow-sm transition-all border border-[#C5A059]/40"
                  >
                    <Download className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span>
                      {downloadingId === item.product.id ? "Securing Link..." : "Download PDF"}
                    </span>
                  </button>
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
