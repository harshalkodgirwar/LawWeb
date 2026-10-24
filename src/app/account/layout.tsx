"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, ShoppingBag, User, LogOut, ShieldCheck, Scale, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        if (data.user.email?.includes("admin") || data.user.user_metadata?.role === "admin") {
          setIsAdmin(true);
        }
      } else {
        const demoUser = typeof window !== "undefined" ? localStorage.getItem("demo_user") : null;
        if (demoUser) {
          try {
            const parsed = JSON.parse(demoUser);
            setUser(parsed);
            if (parsed.role === "admin" || parsed.email?.includes("admin")) {
              setIsAdmin(true);
            }
          } catch {
            // ignore
          }
        }
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_user");
    }
    window.location.href = "/";
  };

  const navItems = [
    { name: "My Study Library", href: "/account/library", icon: BookOpen },
    { name: "My Orders & Invoices", href: "/account/orders", icon: ShoppingBag },
    { name: "Account Profile", href: "/account/profile", icon: User },
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1E2229] pb-24">
      {/* Top Banner */}
      <div className="bg-[#080D1A] text-white py-8 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C2541] border border-[#C5A059] flex items-center justify-center text-[#E5C378]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Customer & Student Portal
              </h1>
              <p className="text-xs text-stone-300">
                Logged in as <span className="text-[#E5C378] font-medium">{user?.email || "Student"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-semibold hover:bg-[#C5A059]/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <Link
              href="/materials"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Browse Store</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="md:col-span-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase text-stone-400 font-bold">
              Account Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-[#0B132B] text-white shadow-sm font-semibold"
                      : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#E5C378]" : "text-stone-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-stone-100 my-2" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Main Panel Content */}
          <div className="md:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
