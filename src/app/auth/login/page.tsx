"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account/library";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoRole, setDemoRole] = useState<"customer" | "admin" | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback for local demo mode if credentials are mock/not yet connected
        if (email.includes("admin")) {
          const mockUser = {
            id: "mock-admin-uuid",
            email,
            role: "admin",
            user_metadata: { full_name: "Adv. Harshal (Admin)", role: "admin" },
          };
          localStorage.setItem("demo_user", JSON.stringify(mockUser));
          router.push(redirectUrl);
          return;
        } else if (email) {
          const mockUser = {
            id: "mock-customer-uuid",
            email,
            role: "customer",
            user_metadata: { full_name: email.split("@")[0], role: "customer" },
          };
          localStorage.setItem("demo_user", JSON.stringify(mockUser));
          router.push(redirectUrl);
          return;
        }
        throw authError;
      }

      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (role: "customer" | "admin") => {
    const mockEmail = role === "admin" ? "admin@advharshal.com" : "student@example.com";
    const mockName = role === "admin" ? "Adv. Harshal (Admin)" : "Pooja Sharma (Student)";
    const mockUser = {
      id: role === "admin" ? "mock-admin-uuid" : "mock-student-uuid",
      email: mockEmail,
      role: role,
      user_metadata: { full_name: mockName, role: role },
    };
    localStorage.setItem("demo_user", JSON.stringify(mockUser));
    router.push(role === "admin" ? "/admin" : redirectUrl);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#080D1A] border border-[#C5A059] flex items-center justify-center text-[#E5C378] shadow-md">
            <Scale className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0B132B]">
          Sign in to Your Account
        </h2>
        <p className="mt-1 text-xs text-stone-600">
          Access your purchased study notes, download PDFs, and review past orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-stone-200 shadow-md space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#B38A38] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs sm:text-sm shadow-md transition-all border border-[#C5A059]/40"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Library"}</span>
              <ArrowRight className="w-4 h-4 text-[#E5C378]" />
            </button>
          </form>

          {/* 1-Click Demo Accounts for Instant Review */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block text-center">
              Quick 1-Click Demo Sign-in
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("customer")}
                className="py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors"
              >
                Sign in as Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("admin")}
                className="py-2 px-3 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#8E6D24] text-xs font-bold border border-[#C5A059]/40 transition-colors"
              >
                Sign in as Admin
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-stone-600">
            Don't have an account yet?{" "}
            <Link
              href={`/auth/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-bold text-[#0B132B] hover:underline"
            >
              Register for Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-xs font-mono text-stone-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
