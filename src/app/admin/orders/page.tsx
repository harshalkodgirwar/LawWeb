"use client";

import React, { useState } from "react";
import { formatINR, formatDate } from "@/lib/utils";
import { Search, Filter, CheckCircle, Clock, XCircle, ShieldCheck, Download, AlertCircle } from "lucide-react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  amountPaise: number;
  status: "completed" | "pending" | "refunded";
  razorpayOrderId: string;
  razorpayPaymentId: string;
  date: string;
  refundStatus: string | null;
}

export default function AdminOrdersPage() {
  const [orders] = useState<AdminOrder[]>([
    {
      id: "ord-1",
      orderNumber: "ORD-948120",
      customerName: "Pooja Sharma",
      customerEmail: "pooja.sharma@example.com",
      productTitle: "Constitutional Law of India: Master Revision & Judiciary Notes",
      amountPaise: 69900,
      status: "completed",
      razorpayOrderId: "order_Qz849102849",
      razorpayPaymentId: "pay_PkN9418294901",
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
      refundStatus: null,
    },
    {
      id: "ord-2",
      orderNumber: "ORD-839104",
      customerName: "Rohan Varma",
      customerEmail: "rohan.varma@chambers.in",
      productTitle: "New Criminal Laws Handbook: BNS, BNSS & BSA Comparative Analysis",
      amountPaise: 79900,
      status: "completed",
      razorpayOrderId: "order_Lx104928410",
      razorpayPaymentId: "pay_QmP1049284102",
      date: new Date(Date.now() - 3600000 * 8).toISOString(),
      refundStatus: null,
    },
    {
      id: "ord-3",
      orderNumber: "ORD-729104",
      customerName: "Ananya Deshmukh",
      customerEmail: "ananya.d@gmail.com",
      productTitle: "Code of Civil Procedure (CPC) & Limitation Act: Visual Flowcharts",
      amountPaise: 59900,
      status: "completed",
      razorpayOrderId: "order_Mm910481204",
      razorpayPaymentId: "pay_LkR829104812",
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      refundStatus: null,
    },
    {
      id: "ord-4",
      orderNumber: "ORD-619284",
      customerName: "Siddharth Mehra",
      customerEmail: "siddharth@delhilaw.com",
      productTitle: "Judiciary Mains Master Answer-Writing Framework",
      amountPaise: 89900,
      status: "refunded",
      razorpayOrderId: "order_Kk819284109",
      razorpayPaymentId: "pay_Jj1928401928",
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      refundStatus: "Full Refund (Duplicate Transaction Settled)",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.razorpayPaymentId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Order & Settlement Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit verified payment signatures, Razorpay gateway identifiers, and digital fulfillment records.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Strict Gateway Verified Records Only (No Manual Overrides)</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by order ID, email, or Razorpay ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-stone-500 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Captured & Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Material Purchased</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Gateway Status</th>
                <th className="py-3 px-4 font-semibold">Razorpay References</th>
                <th className="py-3 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                    {o.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">{o.customerName}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{o.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-medium text-stone-800">
                    {o.productTitle}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-stone-900 whitespace-nowrap">
                    {formatINR(o.amountPaise)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {o.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Captured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Refunded
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-stone-500 whitespace-nowrap">
                    <div>Pay: {o.razorpayPaymentId}</div>
                    <div className="text-stone-400">Ord: {o.razorpayOrderId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                    {formatDate(o.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
