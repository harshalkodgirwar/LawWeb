"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, BookOpen, User, Menu, X, ArrowRight, ShieldCheck, LogOut, FileText, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/useProfile";

export default function Navbar() {
  const pathname = usePathname();
  const profile = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Check local storage mock session or Supabase session
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        // Check admin
        if (data.user.email?.includes("admin") || data.user.user_metadata?.role === "admin") {
          setIsAdmin(true);
        }
      } else {
        // Check for local demo user session if in demo mode
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

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email?.includes("admin") || session.user.user_metadata?.role === "admin") {
          setIsAdmin(true);
        }
      } else {
        const demoUser = typeof window !== "undefined" ? localStorage.getItem("demo_user") : null;
        if (!demoUser) {
          setUser(null);
          setIsAdmin(false);
        }
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_user");
    }
    setUser(null);
    setIsAdmin(false);
    setDropdownOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Study Materials", href: "/materials" },
    { name: "Free Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080D1A]/95 backdrop-blur-md border-b border-[#C5A059]/25 text-white shadow-lg transition-all">
      {/* Top Banner Notice for Students */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] border-b border-[#C5A059]/15 py-1 text-center text-xs text-stone-300">
        <span className="text-[#E5C378] font-semibold tracking-wide uppercase mr-2 text-[10px] px-2 py-0.5 rounded bg-[#C5A059]/20 border border-[#C5A059]/30">
          New Edition 2026
        </span>
        BNS, BNSS & Bharatiya Sakshya Adhiniyam notes now available for Judiciary & LL.B.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Lawyer Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#1C2541] to-[#0B132B] border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] shadow-md group-hover:border-[#E5C378] transition-colors">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#E5C378] transition-colors">
                {profile.name || "Adv. Harshal Kodgirwar"}
              </div>
              <div className="text-[11px] font-mono text-[#C5A059] tracking-wider uppercase">
                {profile.designation || "Supreme Court Advocate & Legal Educator"}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "text-[#E5C378] bg-white/10 shadow-sm"
                    : "text-stone-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action / Auth & Cart */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1C2541] border border-[#C5A059]/40 hover:border-[#E5C378] text-sm text-stone-200 transition-all focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-[#C5A059] text-[#080D1A] font-bold text-xs flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[120px] truncate text-xs font-medium">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "Account"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0B132B] border border-[#C5A059]/40 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/account/library"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-200 hover:bg-white/10 hover:text-[#E5C378] transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      My Study Library
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-200 hover:bg-white/10 hover:text-[#E5C378] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                      My Orders & Receipts
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#E5C378] bg-[#C5A059]/10 font-medium hover:bg-[#C5A059]/20 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#E5C378]" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-white/10 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-medium text-stone-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/materials"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] text-xs font-bold shadow-md hover:brightness-105 transition-all"
                >
                  <span>Explore Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C5A059]/20 bg-[#080D1A] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? "text-[#E5C378] bg-white/10"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10 space-y-2">
            {user ? (
              <>
                <Link
                  href="/account/library"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-stone-200 hover:bg-white/5 text-sm"
                >
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  My Study Library
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-stone-200 hover:bg-white/5 text-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-[#E5C378] font-medium bg-[#C5A059]/15 text-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-950/20 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 border border-stone-600 rounded-lg text-sm font-medium text-stone-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#E5C378] rounded-lg text-sm font-bold text-[#080D1A]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
