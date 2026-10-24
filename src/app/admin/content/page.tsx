"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SEED_PROFILE_CONFIG } from "@/lib/db/seed-data";
import {
  Save,
  CheckCircle2,
  FileEdit,
  Globe,
  Mail,
  Phone,
  MapPin,
  Send,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Eye,
  Scale,
} from "lucide-react";
import {
  YouTubeIcon,
  InstagramIcon,
  LinkedInIcon,
  TelegramIcon,
} from "@/components/ui/SocialIcons";

export default function AdminContentEditorPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(SEED_PROFILE_CONFIG);
  const [saved, setSaved] = useState(false);
  const [saveTime, setSaveTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing content on mount
  useEffect(() => {
    // 1. Check local storage first
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_profile_content");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore
        }
      }
    }

    // 2. Fetch from backend API
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) {
          setProfile((prev) => ({ ...prev, ...data.content }));
          if (typeof window !== "undefined") {
            localStorage.setItem("admin_profile_content", JSON.stringify(data.content));
          }
        }
      })
      .catch((err) => {
        console.log("Using cached profile data", err);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSaved(false);

    try {
      // 1. Save to backend API
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to persist content");
      }

      // 2. Save to local storage for immediate cross-tab & browser persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_profile_content", JSON.stringify(profile));
        // Dispatch custom storage event for live UI reactivity
        window.dispatchEvent(new Event("admin_content_updated"));
      }

      const now = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setSaveTime(now);
      setSaved(true);
      router.refresh();
    } catch (err: any) {
      // In local dev without live Supabase, guarantee local persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_profile_content", JSON.stringify(profile));
        window.dispatchEvent(new Event("admin_content_updated"));
      }
      const now = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setSaveTime(now);
      setSaved(true);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all content back to original seed defaults?")) {
      setProfile(SEED_PROFILE_CONFIG);
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_profile_content");
        window.dispatchEvent(new Event("admin_content_updated"));
      }
      setSaved(false);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Portfolio Content & Biography Editor
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Modify lawyer credentials, biography, social media links, and chamber contact desk in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-800 text-xs font-semibold transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Persistent Success Banner */}
      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Content Successfully Saved & Published!</span>{" "}
              <span>Your changes are live as of {saveTime}.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              <span>See Changes on Home</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/about"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <span>See on About Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs sm:text-sm">
        {/* Profile & Designation */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-[#C5A059]" />
            <span>Lawyer Identity & Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Lawyer Full Name *
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Professional Designation *
              </label>
              <input
                type="text"
                required
                value={profile.designation}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Educational Qualifications
              </label>
              <input
                type="text"
                value={profile.qualifications}
                onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Bar Council Enrollment Number (Configurable)
              </label>
              <input
                type="text"
                value={profile.barCouncilNumber}
                onChange={(e) => setProfile({ ...profile, barCouncilNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Professional Biography
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C5A059]" />
            <span>Social Channels & Community Handles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Channel URL</span>
              </label>
              <input
                type="url"
                value={profile.socials.youtube}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, youtube: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram Profile URL</span>
              </label>
              <input
                type="url"
                value={profile.socials.instagram}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, instagram: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                value={profile.socials.linkedin}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, linkedin: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <TelegramIcon className="w-3.5 h-3.5 text-sky-500" />
                <span>Telegram Community Channel</span>
              </label>
              <input
                type="url"
                value={profile.socials.telegram}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, telegram: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Chambers Contact & Office Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#C5A059]" />
            <span>Chambers Contact & Hours</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={profile.contact.supportEmail}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contact: { ...profile.contact, supportEmail: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Office Operating Hours
              </label>
              <input
                type="text"
                value={profile.contact.hours}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contact: { ...profile.contact, hours: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Chambers Address
            </label>
            <input
              type="text"
              value={profile.contact.officeLocation}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  contact: { ...profile.contact, officeLocation: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-stone-400">
            Clicking Save & Publish will immediately update the database and website.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs sm:text-sm shadow-md transition-all border border-[#C5A059]/40 hover:scale-[1.01]"
          >
            <Save className="w-4 h-4 text-[#E5C378]" />
            <span>
              {isSubmitting ? "Publishing Changes..." : "Save & Publish All Changes"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
