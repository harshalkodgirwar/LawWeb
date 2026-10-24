"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Users, Search, BookOpen, ShieldCheck, Mail, Phone } from "lucide-react";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledDate: string;
  purchasedCount: number;
  totalSpentPaise: number;
}

export default function AdminCustomersPage() {
  const [customers] = useState<CustomerRecord[]>([
    {
      id: "cust-1",
      name: "Pooja Sharma",
      email: "pooja.sharma@example.com",
      phone: "+91 98765 43210",
      enrolledDate: "2026-03-12T10:00:00Z",
      purchasedCount: 3,
      totalSpentPaise: 219700,
    },
    {
      id: "cust-2",
      name: "Rohan Varma",
      email: "rohan.varma@chambers.in",
      phone: "+91 98210 12345",
      enrolledDate: "2026-04-05T12:00:00Z",
      purchasedCount: 2,
      totalSpentPaise: 139800,
    },
    {
      id: "cust-3",
      name: "Ananya Deshmukh",
      email: "ananya.d@gmail.com",
      phone: "+91 94021 84920",
      enrolledDate: "2026-05-18T14:30:00Z",
      purchasedCount: 1,
      totalSpentPaise: 59900,
    },
    {
      id: "cust-4",
      name: "Vikramaditya Rao",
      email: "vikram.rao@nlsiu.ac.in",
      phone: "+91 99887 76655",
      enrolledDate: "2026-06-20T09:15:00Z",
      purchasedCount: 4,
      totalSpentPaise: 299600,
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Registered Law Students & Customers
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit digital study licenses, enrollment dates, and authorized download entitlements.
          </p>
        </div>

        <div className="text-xs font-mono bg-stone-100 text-stone-700 px-3 py-1.5 rounded-xl font-medium">
          Total Customers: {customers.length}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-400 font-mono text-[10px] uppercase">
              <th className="py-3 px-4 font-semibold">Student Name</th>
              <th className="py-3 px-4 font-semibold">Email & Phone</th>
              <th className="py-3 px-4 font-semibold">Enrolled Since</th>
              <th className="py-3 px-4 font-semibold">Study Notes Owned</th>
              <th className="py-3 px-4 font-semibold text-right">Entitlements</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50/70">
                <td className="py-3.5 px-4 font-bold text-stone-900">{c.name}</td>
                <td className="py-3.5 px-4 text-stone-600">
                  <div>{c.email}</div>
                  <div className="text-[10px] text-stone-400 font-mono">{c.phone}</div>
                </td>
                <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                  {formatDate(c.enrolledDate)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-mono font-medium">
                  {c.purchasedCount} Compendiums
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Active Access
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
