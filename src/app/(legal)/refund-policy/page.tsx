import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Official refund and cancellation policy for digital study materials and PDF compendiums.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#B38A38] font-mono font-bold">
            Consumer Policy
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B132B] mt-1">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-stone-500 mt-1">Last Updated: October 2026</p>
        </div>

        <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            1. Nature of Digital Products
          </h2>
          <p>
            All study materials sold on this platform are downloadable digital PDF documents. Because digital files cannot be physically returned once access or download credentials have been granted, <strong>all purchases are generally deemed final and non-refundable</strong> once payment has been captured and access provisioned to your account.
          </p>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            2. Eligible Exceptions for Full Refund
          </h2>
          <p>A 100% full refund will be promptly issued under the following specific circumstances:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Duplicate Transaction:</strong> If a customer was charged more than once for the same study material due to a network glitch or payment gateway timeout.
            </li>
            <li>
              <strong>Defective or Corrupted File:</strong> If the provided digital download file is corrupted, unreadable, or missing pages, and our technical support desk is unable to deliver a functional replacement file within 48 hours of notification.
            </li>
            <li>
              <strong>Unauthorized Payment:</strong> Upon verification of fraudulent charge reported through official banking channels.
            </li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            3. How to Request a Refund
          </h2>
          <p>
            To request a refund under the eligible exceptions above, please send an email to <a href="mailto:support@advharshal.com" className="text-[#B38A38] underline font-semibold">support@advharshal.com</a> within <strong>7 days</strong> of your transaction date with:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Your Order Number (e.g. ORD-...)</li>
            <li>Razorpay Payment ID (e.g. pay_...)</li>
            <li>Registered Email Address</li>
            <li>A concise description of the issue encountered (with screenshot if applicable)</li>
          </ol>

          <h2 className="font-serif text-lg font-bold text-stone-900 mt-6">
            4. Refund Processing Timelines
          </h2>
          <p>
            Approved refunds are initiated immediately through the Razorpay payment gateway and typically reflect in the original source payment method (Bank Account, UPI, Debit/Credit Card) within <strong>5 to 7 business days</strong> as per standard Reserve Bank of India (RBI) settlement guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
