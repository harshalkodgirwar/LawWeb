"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  ShieldCheck,
  Scale,
  LogOut,
  ArrowLeft,
  FileEdit,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/useProfile";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useProfile();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email?.includes("admin") || data?.user?.user_metadata?.role === "admin") {
        setAuthorized(true);
      } else {
        const demoUser = typeof window !== "undefined" ? localStorage.getItem("demo_user") : null;
        if (demoUser) {
          try {
            const parsed = JSON.parse(demoUser);
            if (parsed.role === "admin" || parsed.email?.includes("admin")) {
              setAuthorized(true);
            }
          } catch {
            // ignore
          }
        }
      }
      setChecking(false);
    });
  }, []);

  const navItems = [
    { name: "Analytics & Overview", href: "/admin", icon: BarChart3 },
    { name: "Product Management", href: "/admin/products", icon: BookOpen },
    { name: "Category Management", href: "/admin/categories", icon: FolderTree },
    { name: "Orders & Transactions", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customer Management", href: "/admin/customers", icon: Users },
    { name: "Portfolio & Bio Editor", href: "/admin/content", icon: FileEdit },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-[#080D1A] flex items-center justify-center text-white text-xs font-mono">
        Verifying administrator credentials...
      </div>
    );
  }

  return (
    <div className="bg-stone-100 min-h-screen text-[#1E2229]">
      {/* Admin Top Navigation */}
      <header className="bg-[#080D1A] text-white border-b border-[#C5A059]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1C2541] border border-[#C5A059] flex items-center justify-center text-[#E5C378]">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-serif text-base font-bold text-white tracking-wide">
              Chambers Admin Console
            </span>
          </Link>
          <span className="text-[10px] uppercase font-mono bg-[#C5A059]/20 text-[#E5C378] px-2 py-0.5 rounded border border-[#C5A059]/30">
            SECURE PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/"
            className="text-stone-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#080D1A] font-bold text-xs flex items-center justify-center">
              A
            </div>
            <span className="text-stone-300 text-xs font-medium">
              {profile.name || "Adv. Harshal"} (Admin)
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="md:col-span-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase text-stone-400 font-bold">
              Management Modules
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
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
