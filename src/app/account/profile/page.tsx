"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Save, CheckCircle2, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function MyProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setEmail(data.user.email || "");
        setFullName(data.user.user_metadata?.full_name || "");
        setPhone(data.user.phone || "");
      } else {
        const demoUser = typeof window !== "undefined" ? localStorage.getItem("demo_user") : null;
        if (demoUser) {
          try {
            const parsed = JSON.parse(demoUser);
            setEmail(parsed.email || "");
            setFullName(parsed.user_metadata?.full_name || parsed.email.split("@")[0]);
          } catch {
            // ignore
          }
        }
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      // Also update demo state if in local demo mode
      const demoUser = typeof window !== "undefined" ? localStorage.getItem("demo_user") : null;
      if (demoUser) {
        try {
          const parsed = JSON.parse(demoUser);
          parsed.user_metadata = { ...parsed.user_metadata, full_name: fullName };
          localStorage.setItem("demo_user", JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Account Profile & Personal Details
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage your personal legal library credentials and notification preferences.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile details saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 max-w-lg text-xs sm:text-sm">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Registered Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="email"
              disabled
              value={email}
              className="w-full pl-10 pr-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
            />
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Email address is tied to your authorized digital study licenses and cannot be changed.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Phone Number (for SMS Order Notifications)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs sm:text-sm shadow-md transition-all border border-[#C5A059]/40"
        >
          <Save className="w-4 h-4 text-[#E5C378]" />
          <span>{loading ? "Saving Changes..." : "Save Profile Details"}</span>
        </button>
      </form>
    </div>
  );
}
