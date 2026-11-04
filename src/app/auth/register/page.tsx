"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  saveRegisteredUser,
  setCurrentUser,
  isSupabaseConfigured,
  AuthUser,
} from "@/lib/auth-helpers";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account/library";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and retype.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      setLoading(false);
      return;
    }

    try {
      // 1. Save user to registered users database
      const newUser = saveRegisteredUser({
        email: trimmedEmail,
        fullName: trimmedName,
        passwordHash: password,
      });

      // 2. Also register in Supabase if live credentials are configured
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          await supabase.auth.signUp({
            email: trimmedEmail,
            password: password,
            options: {
              data: {
                full_name: trimmedName,
                role: "customer",
              },
            },
          });
        } catch (sbErr) {
          console.warn("Supabase background registration notice:", sbErr);
        }
      }

      // 3. Immediately sign in the new user
      const userSession: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        role: "customer",
        user_metadata: {
          full_name: newUser.fullName,
          role: "customer",
        },
      };

      setCurrentUser(userSession);
      setSuccess(true);

      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
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
          Create Your Student Account
        </h2>
        <p className="mt-1 text-xs text-stone-600">
          Unlock high-yield judicial notes, bare act guides, and digital downloads.
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
              <span>Account created successfully! Redirecting to your library...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs sm:text-sm shadow-md transition-all border border-[#C5A059]/40"
            >
              <span>{loading ? "Creating Account..." : "Create Account & Enter Library"}</span>
              <ArrowRight className="w-4 h-4 text-[#E5C378]" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-stone-600">
            Already have an account?{" "}
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-bold text-[#0B132B] hover:underline"
            >
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-xs font-mono text-stone-500">
          Loading sign up...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
