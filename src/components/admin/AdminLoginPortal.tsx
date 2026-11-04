"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/useProfile";
import {
  ADMIN_CREDENTIALS,
  setCurrentUser,
  isSupabaseConfigured,
  AuthUser,
} from "@/lib/auth-helpers";

interface AdminLoginPortalProps {
  onSuccess?: () => void;
}

export default function AdminLoginPortal({ onSuccess }: AdminLoginPortalProps) {
  const profile = useProfile();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPw = password.trim();

    try {
      // 1. Check Hardcoded Admin Credentials
      const isAdminUsername =
        trimmedId === ADMIN_CREDENTIALS.username.toLowerCase() ||
        trimmedId === ADMIN_CREDENTIALS.email.toLowerCase();

      const isAdminPassword = ADMIN_CREDENTIALS.passwords.includes(trimmedPw);

      if (isAdminUsername && isAdminPassword) {
        const adminUser: AuthUser = {
          id: "admin-master-id",
          email: ADMIN_CREDENTIALS.email,
          role: "admin",
          user_metadata: {
            full_name: profile.name ? `${profile.name} (Admin)` : ADMIN_CREDENTIALS.name,
            role: "admin",
          },
        };

        setCurrentUser(adminUser);
        setSuccess("Administrator verified! Entering console...");

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = "/admin";
          }
        }, 500);
        return;
      }

      if (isAdminUsername && !isAdminPassword) {
        throw new Error("Invalid administrator password. Please check your credentials.");
      }

      // 2. Check Supabase Auth if email format
      if (isSupabaseConfigured() && trimmedId.includes("@")) {
        const supabase = createClient();
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: trimmedId,
          password: trimmedPw,
        });

        if (data?.user) {
          const role = data.user.user_metadata?.role;
          if (role === "admin" || data.user.email?.includes("admin")) {
            const adminUser: AuthUser = {
              id: data.user.id,
              email: data.user.email || trimmedId,
              role: "admin",
              user_metadata: {
                full_name: data.user.user_metadata?.full_name || "Chambers Admin",
                role: "admin",
              },
            };
            setCurrentUser(adminUser);
            setSuccess("Authenticated via Supabase. Opening console...");
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                window.location.href = "/admin";
              }
            }, 500);
            return;
          } else {
            throw new Error("This account does not have administrator privileges.");
          }
        }

        if (authErr) {
          throw authErr;
        }
      }

      throw new Error("Invalid administrator credentials. Access is restricted to authorized chambers staff.");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate administrator.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setIdentifier("admin");
    setPassword("admin123");
    setError("");

    const adminUser: AuthUser = {
      id: "admin-master-id",
      email: ADMIN_CREDENTIALS.email,
      role: "admin",
      user_metadata: {
        full_name: profile.name ? `${profile.name} (Admin)` : ADMIN_CREDENTIALS.name,
        role: "admin",
      },
    };

    setLoading(true);
    setSuccess("Authenticating as Administrator...");
    setCurrentUser(adminUser);

    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = "/admin";
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {/* Emblem */}
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] border-2 border-[#C5A059] flex items-center justify-center text-[#E5C378] shadow-2xl group-hover:scale-105 transition-all">
            <Scale className="w-7 h-7" />
          </div>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E5C378] text-[11px] font-mono uppercase tracking-widest mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E5C378]" />
          <span>Restricted Management Portal</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Chambers Admin Console
        </h1>
        <p className="mt-1.5 text-xs text-stone-400 max-w-sm mx-auto">
          {profile.name || "Adv. Harshal Kodgirwar"} &bull; Judicial Notes, Product Catalog & Order Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0D1527] border border-[#C5A059]/35 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/60 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/70" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#080D1A] border border-[#C5A059]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-white placeholder-stone-500 text-xs sm:text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/70" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#080D1A] border border-[#C5A059]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-white placeholder-stone-500 text-xs sm:text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] font-bold text-xs sm:text-sm shadow-xl hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              <span>{loading ? "Authenticating..." : "Enter Admin Console"}</span>
              <ArrowRight className="w-4 h-4 text-[#080D1A]" />
            </button>
          </form>

          {/* Quick 1-Click Access Box */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-mono uppercase text-stone-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-[#C5A059]" />
                Hardcoded Credentials
              </span>
              <span className="text-[#E5C378]">admin / admin123</span>
            </div>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-[#1C2541]/70 hover:bg-[#1C2541] border border-[#C5A059]/40 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#E5C378]" />
              <span>1-Click Sign In as Admin</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#E5C378] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
