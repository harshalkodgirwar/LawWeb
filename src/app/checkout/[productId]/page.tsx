"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookCover from "@/components/materials/BookCover";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";
import { Product } from "@/lib/db/types";
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Clock,
  Download,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/useProfile";

interface CheckoutPageProps {
  params: Promise<{
    productId: string;
  }>;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent({ params }: CheckoutPageProps) {
  const router = useRouter();
  const profile = useProfile();
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testModeModal, setTestModeModal] = useState(false);
  const [pendingRazorpayData, setPendingRazorpayData] = useState<any>(null);

  useEffect(() => {
    // 1. Fetch product
    const found = SEED_PRODUCTS.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
    }

    // 2. Fetch authenticated user
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        setEmail(data.user.email || "");
        setFullName(data.user.user_metadata?.full_name || "");
      } else {
        const demoUser = typeof window !== "undefined" ? localStorage.getItem("demo_user") : null;
        if (demoUser) {
          try {
            const parsed = JSON.parse(demoUser);
            setUser(parsed);
            setEmail(parsed.email || "");
            setFullName(parsed.user_metadata?.full_name || "");
          } catch {
            // ignore
          }
        }
      }
    });
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-xs text-stone-500 font-mono">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.original_price_paise, product.price_paise);

  const handleStartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Call server to create authoritative order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-demo-user-id": user?.id || "student-guest-" + Date.now(),
        },
        body: JSON.stringify({ productId: product.id }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || "Failed to initiate payment");
      }

      setPendingRazorpayData(orderData);

      // Check if real Razorpay checkout script is loaded and key is valid
      const hasRealKey = orderData.keyId && !orderData.keyId.includes("mock");

      if (typeof window !== "undefined" && window.Razorpay && hasRealKey) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: orderData.currency,
          name: `${profile.name || "Adv. Harshal Kodgirwar"} Chambers`,
          description: product.title,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: fullName || "Law Student",
            email: email || "student@example.com",
            contact: phone || "",
          },
          theme: {
            color: "#0B132B",
          },
          handler: async function (response: any) {
            await handleVerifyPayment(
              orderData.orderId,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Test mode simulator modal (allows full testing of verification & entitlement flow without live credentials)
        setTestModeModal(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Payment initiation failed");
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) => {
    setLoading(true);
    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-demo-user-id": user?.id || "student-guest",
        },
        body: JSON.stringify({
          orderId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.message || "Payment verification failed");
      }

      // Add to local demo purchased library
      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("demo_purchased_products") || "[]");
        if (!existing.includes(product.id)) {
          existing.push(product.id);
          localStorage.setItem("demo_purchased_products", JSON.stringify(existing));
        }

        // Add to orders list
        const existingOrders = JSON.parse(localStorage.getItem("demo_orders") || "[]");
        existingOrders.unshift({
          id: orderId,
          order_number: pendingRazorpayData?.orderNumber || "ORD-" + Math.floor(100000 + Math.random() * 900000),
          product_title: product.title,
          amount_paise: product.price_paise,
          status: "completed",
          created_at: new Date().toISOString(),
          razorpay_payment_id: razorpayPaymentId,
        });
        localStorage.setItem("demo_orders", JSON.stringify(existingOrders));
      }

      router.push(`/checkout/confirmation?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(product.id)}`);
    } catch (err: any) {
      setError(err.message || "Payment verification error");
      setLoading(false);
    }
  };

  const simulateSuccessPayment = async () => {
    if (!pendingRazorpayData) return;
    const mockPaymentId = `pay_mock_${Date.now()}`;
    const mockSignature = `sig_valid_${Date.now()}_sha256_verified_hmac`;

    await handleVerifyPayment(
      pendingRazorpayData.orderId,
      pendingRazorpayData.razorpayOrderId,
      mockPaymentId,
      mockSignature
    );
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1E2229] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6 mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-[#B38A38] font-bold">
              Secure Checkout • 256-Bit SSL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B132B] mt-0.5">
              Confirm Your Purchase & Download
            </h1>
          </div>
          <Link
            href={`/materials/${product.slug}`}
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            ← Return to Details
          </Link>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Customer Form & Security Guarantee */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C5A059]" />
                <span>Customer & Delivery Details</span>
              </h2>

              <form onSubmit={handleStartCheckout} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    This name will appear on your GST invoice and watermark.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (For Instant Download Delivery) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number (Optional - for SMS updates)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                  />
                </div>

                {/* Terms agreement */}
                <div className="pt-2 flex items-start gap-2.5 text-xs text-stone-600">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="mt-0.5 accent-[#C5A059] rounded"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="underline font-medium text-[#0B132B]">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/refund-policy" className="underline font-medium text-[#0B132B]">
                      Refund Policy
                    </Link>
                    . I understand digital downloads are for single personal use.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] font-bold text-sm shadow-xl hover:brightness-105 transition-all mt-4"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loading ? "Processing..." : `Pay ${formatINR(product.price_paise)} via Razorpay`}
                  </span>
                </button>
              </form>
            </div>

            {/* Payment security info */}
            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Razorpay Secured Transaction</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Supports UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and Net Banking across all major Indian banks. All communications are verified via SHA256 HMAC cryptographic signatures.
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            <div className="flex gap-4">
              <div className="w-20 shrink-0">
                <BookCover
                  title={product.title}
                  category={product.category?.name}
                  pageCount={product.page_count}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#7C632C] bg-[#F7F3E8] px-2 py-0.5 rounded font-semibold">
                  {product.category?.name || "Notes"}
                </span>
                <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-2">
                  {product.title}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {product.page_count ? `${product.page_count} Pages • PDF` : "Instant PDF Guide"}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Standard Price:</span>
                <span className="line-through text-stone-400">
                  {formatINR(product.original_price_paise || product.price_paise * 1.5)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Syllabus Discount ({discount}%):</span>
                  <span>
                    -{" "}
                    {formatINR((product.original_price_paise || product.price_paise) - product.price_paise)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>GST (18% inclusive):</span>
                <span>Included</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between font-serif text-base font-bold text-stone-900">
                <span>Total Amount Due:</span>
                <span className="text-xl text-[#0B132B]">
                  {formatINR(product.price_paise)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FDFBF7] rounded-xl border border-stone-200/80 text-[11px] text-stone-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-stone-900">
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Instant Digital Delivery:</span>
              </div>
              <p>
                Access will be unlocked immediately in your student account upon confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Test Mode Simulator Modal */}
      {testModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-[#C5A059]/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                Rzp
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-stone-900">
                  Razorpay Checkout Simulator (Test Mode)
                </h3>
                <p className="text-[10px] text-stone-400 font-mono">
                  Order ID: {pendingRazorpayData?.razorpayOrderId}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              You are running in Razorpay development test mode. Click below to simulate a successful payment captured via UPI / Net Banking and execute the server-side HMAC signature verification.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 font-mono text-stone-700">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold">{formatINR(product.price_paise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{email || "student@example.com"}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={simulateSuccessPayment}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Simulate Successful Payment
              </button>
              <button
                type="button"
                onClick={() => setTestModeModal(false)}
                className="px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-medium rounded-xl hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-xs font-mono text-stone-500">Loading secure checkout...</div>}>
      <CheckoutContent params={params} />
    </React.Suspense>
  );
}
