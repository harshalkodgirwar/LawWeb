"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  ADMIN_CREDENTIALS,
  getRegisteredUsers,
  setCurrentUser,
  isSupabaseConfigured,
  AuthUser,
} from "@/lib/auth-helpers";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account/library";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
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
            full_name: ADMIN_CREDENTIALS.name,
            role: "admin",
          },
        };

        setCurrentUser(adminUser);
        setSuccess("Admin authenticated successfully! Entering console...");

        const target = redirectUrl && redirectUrl !== "/account/library" ? redirectUrl : "/admin";
        setTimeout(() => {
          router.push(target);
        }, 600);
        return;
      }

      if (isAdminUsername && !isAdminPassword) {
        throw new Error("Invalid password for Admin. Please verify and try again.");
      }

      // 2. Check Registered Users in Local Store
      const registeredUsers = getRegisteredUsers();
      const foundUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === trimmedId
      );

      if (foundUser) {
        if (foundUser.passwordHash !== trimmedPw) {
          throw new Error("Incorrect password for this student account. Please try again.");
        }

        const studentUser: AuthUser = {
          id: foundUser.id,
          email: foundUser.email,
          role: "customer",
          user_metadata: {
            full_name: foundUser.fullName,
            role: "customer",
          },
        };

        setCurrentUser(studentUser);
        setSuccess(`Welcome back, ${foundUser.fullName}! Redirecting...`);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
        return;
      }

      // 3. Fallback to Supabase Auth if configured
      if (isSupabaseConfigured() && trimmedId.includes("@")) {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: trimmedId,
          password: trimmedPw,
        });

        if (data?.user) {
          const userObj: AuthUser = {
            id: data.user.id,
            email: data.user.email || trimmedId,
            role: data.user.user_metadata?.role === "admin" ? "admin" : "customer",
            user_metadata: {
              full_name: data.user.user_metadata?.full_name || trimmedId.split("@")[0],
              role: data.user.user_metadata?.role === "admin" ? "admin" : "customer",
            },
          };
          setCurrentUser(userObj);
          setSuccess("Signed in successfully!");
          setTimeout(() => {
            router.push(redirectUrl);
          }, 600);
          return;
        }

        if (authError) {
          throw authError;
        }
      }

      throw new Error(
        "No account found with this email or username. Please check your spelling or register for a free account."
      );
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillStudent = () => {
    setIdentifier("student@example.com");
    setPassword("student123");
    setError("");
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
          Student & Customer Portal
        </h2>
        <p className="mt-1 text-xs text-stone-600">
          Sign in to access your purchased study notes, bare act guides, and download library.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-stone-200 shadow-md space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Student Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="student@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
              <span>{loading ? "Signing in..." : "Sign In to Library"}</span>
              <ArrowRight className="w-4 h-4 text-[#E5C378]" />
            </button>
          </form>

          {/* Preset Demo Student Account */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
            <div>
              <span className="block font-medium text-stone-800">Demo Student Account</span>
              <span className="text-[11px] text-stone-500 font-mono">student@example.com / student123</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFillStudent}
              className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-semibold transition-colors"
            >
              Autofill
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-stone-600">
            Don't have an account yet?{" "}
            <Link
              href={`/auth/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-bold text-[#0B132B] hover:underline"
            >
              Sign Up for Free
            </Link>
          </div>

          {/* Dedicated Link to Admin Console */}
          <div className="pt-4 border-t border-stone-200 text-center">
            <p className="text-[11px] text-stone-500 mb-2">
              Advocate Chambers Staff or Administrator?
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#080D1A] hover:bg-[#1C2541] text-[#E5C378] text-xs font-semibold border border-[#C5A059]/40 shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chambers Admin Portal (/admin) &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-xs font-mono text-stone-500">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
