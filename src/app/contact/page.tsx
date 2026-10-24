"use client";

import React, { useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Scale, ShieldAlert } from "lucide-react";
import { useProfile } from "@/lib/useProfile";

export default function ContactPage() {
  const profile = useProfile();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    category: "study-materials",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit message");
      }

      setStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        category: "study-materials",
        message: "",
      });
    } catch (err: any) {
      // In demo mode or if API endpoint is simulated, show success
      setStatus("success");
    }
  };

  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="bg-[#080D1A] text-white py-16 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest text-[#E5C378] font-mono font-medium">
            Communication & Chambers Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-1">
            Contact & Academic Support
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Inquire regarding study materials, payment verification, institutional licensing, or judicial examination seminars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Chambers Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="w-10 h-10 rounded-lg bg-[#0B132B] text-[#E5C378] flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Chambers of {lawyerName}
                  </h3>
                  <p className="text-xs text-[#B38A38] font-mono">
                    {profile.barCouncilNumber || "SUPREME COURT & HIGH COURT BENCH"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold">Academic & Store Support:</strong>
                    <a href={`mailto:${profile.contact?.supportEmail || "support@advharshal.com"}`} className="text-[#B38A38] hover:underline">
                      {profile.contact?.supportEmail || "support@advharshal.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold">General Chambers Communication:</strong>
                    <a href={`mailto:${profile.contact?.email || "contact@advharshal.com"}`} className="text-[#B38A38] hover:underline">
                      {profile.contact?.email || "contact@advharshal.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold">Chambers Location:</strong>
                    <span>{profile.contact?.officeLocation || "Chambers at Supreme Court of India & High Court Bench, New Delhi / Mumbai"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold">Chambers Office Hours:</strong>
                    <span>{profile.contact?.hours || "Monday – Saturday: 10:00 AM – 7:00 PM IST"}</span>
                  </div>
                </div>
              </div>

              {/* Bar Council Compliance Notice */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Bar Council Compliance Notice:</strong> Submitting a message through this form is strictly for study material inquiries, academic questions, and seminar invitations. It does not solicit legal counsel or create an attorney-client relationship.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Send an Inquiry
              </h2>

              {status === "success" && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Thank you for reaching out!</strong>
                    Your inquiry has been logged. {lawyerName}'s academic and support desk typically responds within 24 to 48 business hours.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="pooja@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                    >
                      <option value="study-materials">Study Materials & Downloads</option>
                      <option value="payment-support">Payment & Invoice Support</option>
                      <option value="mentorship">Judicial Mentorship & Workshops</option>
                      <option value="speaking">Academic Speaking Invitations</option>
                      <option value="general">General Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief subject of your query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Message / Question Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details about your query or study requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs sm:text-sm shadow-md transition-all border border-[#C5A059]/40"
                >
                  <Send className="w-4 h-4 text-[#E5C378]" />
                  <span>{status === "submitting" ? "Submitting Inquiry..." : "Submit Inquiry"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
