"use client";

import React, { useState, useEffect } from "react";
import { formatINR, formatDate } from "@/lib/utils";
import { ShoppingBag, CheckCircle, Clock, ExternalLink, Download, FileText } from "lucide-react";

interface OrderDisplay {
  id: string;
  order_number: string;
  product_title: string;
  amount_paise: number;
  status: "completed" | "pending" | "refunded";
  created_at: string;
  razorpay_payment_id: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage demo orders or load representative orders
    const stored = localStorage.getItem("demo_orders");
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
        setLoading(false);
        return;
      } catch {
        // ignore
      }
    }

    // Default sample orders for verified customer
    setOrders([
      {
        id: "ord-1",
        order_number: "ORD-948120",
        product_title: "Constitutional Law of India: Master Revision & Judiciary Notes",
        amount_paise: 69900,
        status: "completed",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        razorpay_payment_id: "pay_PkN9418294901",
      },
      {
        id: "ord-2",
        order_number: "ORD-839104",
        product_title: "New Criminal Laws Handbook: BNS, BNSS & BSA Comparative Analysis",
        amount_paise: 79900,
        status: "completed",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        razorpay_payment_id: "pay_QmP1049284102",
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Order History & Tax Invoices
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            View transaction receipts, Razorpay payment references, and order status.
          </p>
        </div>

        <span className="text-xs font-mono text-stone-600 bg-stone-100 px-3 py-1 rounded-full font-medium">
          {orders.length} Verified Orders
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-stone-400">Loading your orders...</div>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-mono text-[11px] uppercase">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Study Material</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Payment Ref</th>
                <th className="pb-3 font-semibold text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 font-mono font-bold text-stone-900">
                    {order.order_number}
                  </td>
                  <td className="py-4 font-medium text-stone-900 max-w-xs truncate pr-4">
                    {order.product_title}
                  </td>
                  <td className="py-4 text-stone-500 whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="py-4 font-serif font-bold text-stone-900 whitespace-nowrap">
                    {formatINR(order.amount_paise)}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    {order.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Paid & Captured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                    {order.razorpay_payment_id}
                  </td>
                  <td className="py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => alert(`Downloading GST Invoice for ${order.order_number}...`)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-stone-500">
          No past orders recorded yet.
        </div>
      )}
    </div>
  );
}
