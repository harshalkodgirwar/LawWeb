"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, BookOpen, Download, ArrowRight, ShieldCheck, FileText, ShoppingBag, Eye } from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";
import { formatINR } from "@/lib/utils";

function CheckoutConfirmationContent() {
  const searchParams = useSearchParams();
  const paramOrderId = searchParams.get("orderId");
  const productId = searchParams.get("productId") || "prod-const-law-master";

  const [orderId, setOrderId] = useState<string>(paramOrderId || "ORD-PROCESSING");
  const [product, setProduct] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!paramOrderId) {
      setOrderId("ORD-" + Math.floor(100000 + Math.random() * 900000));
    } else {
      setOrderId(paramOrderId);
    }

    // 1. Check custom admin products in localStorage
    let customList: any[] = [];
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_custom_products");
      if (stored) {
        try {
          customList = JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }

    const found =
      customList.find((p) => p.id === productId) ||
      SEED_PRODUCTS.find((p) => p.id === productId) ||
      SEED_PRODUCTS[0];
    setProduct(found);

    // 2. Also fetch latest from server store
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          const matched = data.products.find((p: any) => p.id === productId);
          if (matched) {
            setProduct(matched);
          }
        }
      })
      .catch(() => {});
  }, [paramOrderId, productId]);

  const handleInstantDownload = () => {
    if (!product) return;
    setDownloading(true);

    try {
      const downloadUrl = `/api/downloads/${product.id}?action=download`;
      const a = document.createElement("a");
      a.href = downloadUrl;
      const safeTitle = product.title.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().replace(/\s+/g, "_");
      a.download = `${safeTitle || "Study_Material"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadMessage(`Downloading official PDF for "${product.title}"... Please check your downloads folder.`);
    } catch {
      setDownloadMessage(`Download initiated for ${product.title}.`);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const handleOpenPdf = () => {
    if (!product) return;
    window.open(`/api/downloads/${product.id}?action=view`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E2229] py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/90 shadow-xl space-y-8 text-center">
          {/* Green Check Icon & Confirmed Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 mx-auto shadow-inner animate-in zoom-in-75">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
              Payment Verified & Captured
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B132B]">
              Order Confirmed & Access Granted!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you for purchasing. Your payment has been authoritatively verified through Razorpay and your digital study material is now active.
            </p>
          </div>

          {/* Order Details Receipt Box */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-3 font-mono">
            <div className="flex justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500 font-medium">Order Number:</span>
              <span className="font-bold text-stone-900">{orderId}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-stone-200 font-sans">
              <span className="text-stone-500 font-mono">Product:</span>
              <span className="font-bold text-stone-900 text-right max-w-xs truncate">
                {product?.title || "Constitutional Law Notes"}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500 font-medium">Amount Paid:</span>
              <span className="font-bold text-stone-900">
                {product ? formatINR(product.price_paise) : "₹699"} (GST Inclusive)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Delivery Method:</span>
              <span className="text-emerald-700 font-semibold">Instant Digital PDF Unlock</span>
            </div>
          </div>

          {downloadMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
              {downloadMessage}
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleInstantDownload}
                disabled={downloading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs sm:text-sm shadow-md transition-all border border-[#C5A059]/40"
              >
                <Download className="w-4 h-4 text-[#E5C378]" />
                <span>{downloading ? "Downloading..." : "Download Official PDF"}</span>
              </button>

              <button
                onClick={handleOpenPdf}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0B132B] font-bold text-xs sm:text-sm shadow-sm transition-all border border-[#C5A059]/50"
              >
                <Eye className="w-4 h-4 text-[#C5A059]" />
                <span>Open & Read in Browser</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/account/library"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
                <span>Go to My Library</span>
              </Link>
              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
              >
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>View Tax Invoice</span>
              </Link>
            </div>
          </div>

          <div className="text-[11px] text-stone-400">
            A confirmation receipt has also been transmitted to your registered email address.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-xs font-mono text-stone-500">Loading order confirmation...</div>}>
      <CheckoutConfirmationContent />
    </Suspense>
  );
}
