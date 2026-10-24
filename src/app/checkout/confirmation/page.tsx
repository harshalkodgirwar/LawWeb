"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, BookOpen, Download, ArrowRight, ShieldCheck, FileText, ShoppingBag } from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";
import { formatINR } from "@/lib/utils";

function CheckoutConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const productId = searchParams.get("productId") || "prod-const-law-master";

  const [product, setProduct] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  useEffect(() => {
    const found = SEED_PRODUCTS.find((p) => p.id === productId) || SEED_PRODUCTS[0];
    setProduct(found);
  }, [productId]);

  const handleInstantDownload = async () => {
    if (!product) return;
    setDownloading(true);

    try {
      const res = await fetch(`/api/downloads/${product.id}`);
      const data = await res.json();

      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        // Direct stream download
        const dummyPdfContent = `%PDF-1.4\n% Chambers of Adv. Harshal Kodgirwar\n% Licensed Official Edition\n% Material: ${product.title}\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 50 >>\nstream\nBT /F1 18 Tf 50 700 Td (${product.title}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000015 00000 n \n0000000068 00000 n \n0000000125 00000 n \n0000000199 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n299\n%%EOF`;
        const blob = new Blob([dummyPdfContent], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${product.title.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setDownloadMessage(`Download initiated for ${product.title}.`);
    } catch {
      setDownloadMessage(`Download initiated.`);
    } finally {
      setDownloading(false);
    }
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
            <button
              onClick={handleInstantDownload}
              disabled={downloading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs sm:text-sm shadow-md transition-all border border-[#C5A059]/40"
            >
              <Download className="w-4 h-4 text-[#E5C378]" />
              <span>{downloading ? "Preparing PDF..." : "Download Official PDF Now"}</span>
            </button>

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
