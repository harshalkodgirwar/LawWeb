import React from "react";
import { Metadata } from "next";
import { getProfileContent } from "@/lib/supabase/data-service";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy regarding collection, usage, and protection of customer information.",
};

export default async function PrivacyPage() {
  const profile = await getProfileContent();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";

  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#B38A38] font-mono font-bold">
            Legal Compliance
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B132B] mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          <p>
            This Privacy Policy governs the manner in which the Chambers and Academic Academy of {lawyerName} ("we," "us," or "our") collects, uses, maintains, and discloses information collected from users (each, a "User") of the website.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            1. Information We Collect
          </h2>
          <p>
            We collect personal identification information from Users in various ways, including when Users visit our site, register on the site, place an order for study materials, subscribe to legal bulletins, and in connection with other activities, services, or resources we make available. Users may be asked for their name, email address, phone number, and academic background where relevant.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            2. Payment Information & Security
          </h2>
          <p>
            Payment transactions for digital study materials are processed securely through <strong>Razorpay</strong>. We do <strong>NOT</strong> collect, view, or store credit/debit card numbers, CVVs, or Net Banking credentials on our servers. All sensitive financial communication is protected with 256-bit SSL encryption.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            3. How We Use Collected Information
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provision and manage your purchased digital study library.</li>
            <li>To send order confirmation receipts and download authorization keys.</li>
            <li>To respond to customer support inquiries and feedback.</li>
            <li>To notify readers of important statutory updates (e.g. amendments to BNS, BNSS, BSA).</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            4. Protection of Digital Documents
          </h2>
          <p>
            Purchased PDF documents may contain invisible personalized digital watermarks (including buyer's registered name and order ID) to protect the intellectual property rights of the author and prevent unauthorized commercial distribution.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            5. Contact Information
          </h2>
          <p>
            For any questions regarding this Privacy Policy, please contact our data desk at <a href="mailto:support@advharshal.com" className="text-[#B38A38] underline">support@advharshal.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
