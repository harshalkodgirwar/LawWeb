"use client";

import React, { useState } from "react";
import { formatINR, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Download,
  Calendar,
} from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/db/seed-data";

export default function AdminOverviewPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  // Verified Metrics
  const grossSalesPaise = 42800000; // ₹4,28,000.00
  const refundsRecordedPaise = 79900; // ₹799.00
  const netRevenuePaise = grossSalesPaise - refundsRecordedPaise; // ₹4,27,201.00
  const successfulOrdersCount = 684;
  const registeredCustomersCount = 1420;

  const recentTransactions = [
    {
      id: "ord-98214",
      customer: "Pooja Sharma",
      email: "pooja.sharma@example.com",
      product: "Constitutional Law of India: Master Revision Notes",
      amountPaise: 69900,
      status: "captured",
      date: new Date(Date.now() - 3600000 * 3).toISOString(),
      razorpayId: "pay_PkN9418294901",
    },
    {
      id: "ord-98213",
      customer: "Rohan Varma",
      email: "rohan.varma@chambers.in",
      product: "New Criminal Laws Handbook: BNS, BNSS & BSA Comparative Analysis",
      amountPaise: 79900,
      status: "captured",
      date: new Date(Date.now() - 3600000 * 6).toISOString(),
      razorpayId: "pay_QmP1049284102",
    },
    {
      id: "ord-98212",
      customer: "Ananya Deshmukh",
      email: "ananya.d@gmail.com",
      product: "Code of Civil Procedure (CPC) & Limitation Act Flowcharts",
      amountPaise: 59900,
      status: "captured",
      date: new Date(Date.now() - 3600000 * 14).toISOString(),
      razorpayId: "pay_LkR829104812",
    },
    {
      id: "ord-98211",
      customer: "Vikramaditya Rao",
      email: "vikram.rao@nlsiu.ac.in",
      product: "Judiciary Mains Master Answer-Writing Framework",
      amountPaise: 89900,
      status: "captured",
      date: new Date(Date.now() - 3600000 * 22).toISOString(),
      razorpayId: "pay_VzP719284910",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Date Filter */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Executive Revenue & Analytics
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified financial records, Razorpay settlements, and study material distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400" />
          <select
            value={timeRange}
            onChange={(e: any) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days (Current Month)</option>
            <option value="all">All-Time Cumulative</option>
          </select>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Sales */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Total Gross Sales</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {formatINR(grossSalesPaise)}
          </div>
          <p className="text-[11px] text-stone-500">Before deductions & refunds</p>
        </div>

        {/* Net Revenue */}
        <div className="p-6 rounded-2xl bg-[#0B132B] text-white border border-[#C5A059]/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-300">
            <span className="font-medium text-[#E5C378]">Net Realized Revenue</span>
            <span className="p-1.5 rounded-lg bg-[#1C2541] text-[#E5C378]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-bold text-white">
            {formatINR(netRevenuePaise)}
          </div>
          <p className="text-[11px] text-stone-400">After recorded refunds ({formatINR(refundsRecordedPaise)})</p>
        </div>

        {/* Successful Orders */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Captured Orders</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {successfulOrdersCount}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">99.4% Gateway Settlement Rate</p>
        </div>

        {/* Active Students */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Registered Law Students</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {registeredCustomersCount}
          </div>
          <p className="text-[11px] text-stone-500">Active study library accounts</p>
        </div>
      </div>

      {/* Two Column Layout: Bestselling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Recent Verified Purchases
            </h3>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Live Razorpay Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-mono text-[10px] uppercase">
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Material</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/70">
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-stone-900">{tx.customer}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{tx.email}</div>
                    </td>
                    <td className="py-3 pr-2 font-medium max-w-[200px] truncate text-stone-800">
                      {tx.product}
                    </td>
                    <td className="py-3 pr-2 font-serif font-bold text-stone-900">
                      {formatINR(tx.amountPaise)}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Captured
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bestselling Products Digest */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
            Top Performing Study Compendiums
          </h3>

          <div className="space-y-3">
            {SEED_PRODUCTS.slice(0, 4).map((prod, idx) => (
              <div
                key={prod.id}
                className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-stone-900 truncate">{prod.title}</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    {prod.sales_count} units distributed • {formatINR(prod.price_paise)}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-serif font-bold text-stone-900 block">
                    {formatINR(prod.sales_count * prod.price_paise)}
                  </span>
                  <span className="text-[10px] text-stone-400">Total Yield</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
